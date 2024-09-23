// src/SmartContractComparison.js
import React, { useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Styles for responsiveness
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: '24px',
    margin: '20px 0',
  },
  contractContainer: {
    display: 'flex',
    justifyContent: 'space-between', // Changed from space-around to space-between
    width: '100%',
    flexWrap: 'wrap',
  },
  contractCard: {
    // border: '1px solid #ccc',
    // borderRadius: '8px',
    margin: '10px',
    padding: '10px',
    width: '45%', // Adjust width for responsiveness
    cursor: 'pointer',
  },
};

const SmartContractComparison = () => {
  // State to manage expanded contract visibility
  const [expandedContract, setExpandedContract] = useState(null);

  // Toggle function for contract visibility
  const toggleContract = (contract) => {
    setExpandedContract(expandedContract === contract ? null : contract);
  };

  // Contracts as strings
  const optimizedContract = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Importing OpenZeppelin's ReentrancyGuard and Ownable
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Importing Chainlink's AggregatorV3Interface for price feeds
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/// @title FundMe - An optimized funding contract with enhanced security and functionality
/// @author 
/// @notice This contract allows users to fund and the owner to withdraw with additional safeguards
/// @dev Incorporates ReentrancyGuard, custom errors, funding caps, and Chainlink price feeds

contract FundMe is ReentrancyGuard, Ownable {
    // State Variables

    /// @notice Mapping to track the amount funded by each address
    mapping(address => uint256) public addressToAmountFunded;

    /// @notice Array of unique funders
    address[] private funders;

    /// @notice The minimum USD amount required to fund (scaled by 1e18)
    uint256 public MINIMUM_USD;

    /// @notice The maximum number of funders allowed
    uint256 public constant MAX_FUNDERS = 100;

    /// @notice The funding cap in USD (scaled by 1e18)
    uint256 public immutable FUNDING_CAP;

    /// @notice Chainlink Price Feed interface
    AggregatorV3Interface internal priceFeed;

    /// @notice Total funds in USD (scaled by 1e18)
    uint256 public totalFundsUSD;

    // Events

    /// @notice Emitted when a new funding is received
    /// @param funder The address of the funder
    /// @param amount The amount funded
    event Funded(address indexed funder, uint256 amount);

    /// @notice Emitted when funds are withdrawn
    /// @param owner The address of the owner withdrawing funds
    /// @param amount The amount withdrawn
    event Withdrawn(address indexed owner, uint256 amount);

    // Custom Errors
    error NotOwner();
    error TransferFailed();
    error MinimumFundingNotMet();
    error FundingCapReached();
    error MaxFundersReached();

    // Modifiers

    /// @notice Ensures that the funding cap has not been reached
    modifier fundingCapNotReached(uint256 amountUSD) {
        if (totalFundsUSD + amountUSD > FUNDING_CAP) {
            revert FundingCapReached();
        }
        _;
    }

    /// @notice Ensures that the number of funders does not exceed the maximum allowed
    modifier fundersLimitNotReached() {
        if (funders.length >= MAX_FUNDERS) {
            revert MaxFundersReached();
        }
        _;
    }

    // Constructor

    /// @notice Sets the deployer as the owner and initializes price feed and funding cap
    /// @param _priceFeed The address of the Chainlink ETH/USD price feed
    /// @param _fundingCap The maximum funding cap in USD (scaled by 1e18)
    constructor(address _priceFeed, uint256 _fundingCap) {
        priceFeed = AggregatorV3Interface(_priceFeed);
        FUNDING_CAP = _fundingCap;
        updateMinimumUSD(50e18); // Initial minimum funding amount
    }

    // Functions

    /// @notice Allows users to fund the contract
    /// @dev Adds funders to the array only if they haven't funded before to save gas and enforces funding cap and funders limit
    /// @param amountUSD The amount in USD (scaled by 1e18) to fund
    function fund(uint256 amountUSD) public payable nonReentrant fundingCapNotReached(amountUSD) fundersLimitNotReached {
        uint256 ethAmount = getConversionRate(amountUSD);
        if (msg.value < ethAmount) {
            revert MinimumFundingNotMet();
        }

        // Add funder only if they are not already in the funders array
        if (addressToAmountFunded[msg.sender] == 0) {
            funders.push(msg.sender);
        }

        addressToAmountFunded[msg.sender] += msg.value;
        totalFundsUSD += amountUSD;

        emit Funded(msg.sender, msg.value);
    }

    /// @notice Allows the owner to withdraw all funds
    /// @dev Uses call instead of transfer for better gas management and includes reentrancy protection
    function withdraw() public onlyOwner nonReentrant {
        uint256 contractBalance = address(this).balance;
        if (contractBalance == 0) {
            revert FundingCapReached();
        }

        // Reset the funding amounts before transferring to prevent re-entrancy
        for (uint256 i = 0; i < funders.length; i++) {
            address funder = funders[i];
            addressToAmountFunded[funder] = 0;
        }

        // Reset the funders array and total funds
        delete funders;
        totalFundsUSD = 0;

        // Transfer the funds to the owner using call
        (bool success, ) = owner().call{value: contractBalance}("");
        if (!success) {
            revert TransferFailed();
        }

        emit Withdrawn(owner(), contractBalance);
    }

    /// @notice Fallback function to handle unexpected calls
    fallback() external payable {
        fund(getMinimumUSD());
    }

    /// @notice Receive function to handle plain ether transfers
    receive() external payable {
        fund(getMinimumUSD());
    }

    /// @notice Updates the minimum USD required to fund
    /// @param _minimumUSD The new minimum USD amount (scaled by 1e18)
    function updateMinimumUSD(uint256 _minimumUSD) public onlyOwner {
        MINIMUM_USD = _minimumUSD;
    }

    /// @notice Retrieves the latest ETH/USD price from Chainlink
    /// @return price The current ETH price in USD (scaled by 1e8)
    function getPrice() public view returns (uint256 price) {
        (
            , 
            int256 answer,
            ,
            ,
            
        ) = priceFeed.latestRoundData();
        // ETH/USD rate in 8 decimal places
        return uint256(answer);
    }

    /// @notice Converts USD amount to ETH based on the current price
    /// @param amountUSD The amount in USD (scaled by 1e18)
    /// @return ethAmount The equivalent amount in ETH (in wei)
    function getConversionRate(uint256 amountUSD) public view returns (uint256 ethAmount) {
        uint256 ethPrice = getPrice();
        // (USD * 1e18) / (ETH price in USD * 1e8) = ETH amount in wei
        ethAmount = (amountUSD * 1e18) / (ethPrice * 1e8);
    }

    /// @notice Retrieves the total funds in USD
    /// @return totalUSD The total funds in USD (scaled by 1e18)
    function getTotalFunds() public view returns (uint256 totalUSD) {
        return totalFundsUSD;
    }

    /// @notice Retrieves the current minimum USD required to fund
    /// @return The minimum USD amount (scaled by 1e18)
    function getMinimumUSD() public view returns (uint256) {
        return MINIMUM_USD;
    }

    /// @notice Returns the list of funders
    /// @return The array of funders' addresses
    function getFunders() public view returns (address[] memory) {
        return funders;
    }
}

`;

  const nonOptimizedContract = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract NonOptimizedFundMe {
    mapping(address => uint256) public addressToAmountFunded;
    address[] public funders;

    address public owner;
    uint256 public minimumUSD = 50 * 10 ** 18;

    constructor() {
        owner = msg.sender;
    }

    function fund() public payable {
        if (msg.value < minimumUSD) {
            revert("Minimum funding amount not met");
        }
        addressToAmountFunded[msg.sender] += msg.value;
        funders.push(msg.sender);
    }

    function withdraw() public {
        if (msg.sender != owner) {
            revert("Caller is not the owner");
        }
        for (uint256 i = 0; i < funders.length; i++) {
            addressToAmountFunded[funders[i]] = 0;
        }
        funders = new address;
        payable(owner).transfer(address(this).balance);
    }

    // No fallback or receive functions
}`;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Contract Optimization</h1>
      <div style={styles.contractContainer}>
        {/* Optimized Contract */}
        <div style={styles.contractCard} onClick={() => toggleContract('optimized')}>
          <h2>Optimized Contract {expandedContract === 'optimized' ? '▲' : '▼'}</h2>
          {expandedContract === 'optimized' && (
            <SyntaxHighlighter language="solidity" style={okaidia}>
              {optimizedContract}
            </SyntaxHighlighter>
          )}
        </div>
        {/* Non-Optimized Contract */}
        <div style={styles.contractCard} onClick={() => toggleContract('nonOptimized')}>
          <h2>Non-Optimized Contract {expandedContract === 'nonOptimized' ? '▲' : '▼'}</h2>
          {expandedContract === 'nonOptimized' && (
            <SyntaxHighlighter language="solidity" style={okaidia}>
              {nonOptimizedContract}
            </SyntaxHighlighter>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartContractComparison;
