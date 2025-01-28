import React, { useState, useEffect, useRef } from 'react'

import './MatrixTerminal.css'

const asciiArt = `
                                   ,::::                                        
                                   :::;;:::;                                    
                             ::;;;;;:,:::;::;   ,                               
                           ::::;::;;;::,:::;:::::                               
                          ::::,,,,,:,,,,,,,,,,,::::                             
                         ::::,,,,,:=iti+;,.. .,::::;                            
                      ,,:;:,,,.:iYVVXXRRXVt:  .,:::;:                           
                     ,::::,,..=IYVVVXXXRRXVY+  .,,,:::,                         
                     ::,,..,.;++iittVXXItiiit;.,.,::;:                          
                     ,,,,.:,,     ..:;:........,,.,,::,                         
                    ,,,,,...,.     .+YI:      ,,,.,::::,                        
                   ,,,,,...,+::,,,:+YXVt;,:,.:=, :,,.,,,                        
                   .,......=IYVVYYYIIVIIYYVVYYY; ..,,,,,                        
                    ..   ,:=IYVIIi+;=t;=+tIYXYI=;:..,,,,                        
                     ...  :=tI:;=+itYYIt+;;;itt=;. ...                          
                     ...  ::=+:+=tYVVYVVY++:;==:. ..,                           
         VVXRRRBMMMBBR+;::;;++=+++itttttiii====;:,,,;YI=i;++=                   
         IRBBBBW#WWMBXXVYYYYVXVVYIIYYVVXRBMW#WMMBRXXRRXVVYIYYt;                 
         +IYIYXBM###WMRRXVVVVVXVXRXXXRBBMW###WBRXYIttIIttiitt++                 
         =I+itIYXRMW###WWMBBRRBRBBBBMMWW###WMBRXVIti+++++===;+                  
         =+++ittIYVXRBMW###############WMMBRXVVXXXVt+===;;ii=;                  
         =i==+iitttIYVXXRRBMMWWWWWMMMBBBRRXVVYVYIYYVY=;;;;IYti                  
         ;===+++iItttIIYXVXXXRRRRRXXXXVXRRXYtIYVtitIXV+;;;tY=;                  
         ;=;==+ttIYYItittIIVVXXXXYIIIttYYXRXY+iitIIIYXVi=;+i;;                  
         ;;==+i+iii++i++itittItIItiiii+iiiittIIt++i=++iiYVVi=i                  
         ;=;;+i+=======++iti+i+++++++it+=+++=+==+i+;===;==+;=BB                 
         V;;;=====;=====+++++==+===++=+ii=;;;=;;==ii++=;;;;;+RXXV               
       XXX;;;;;==i;=;;;=i+==++;;=;;=====ti===;;=;;;++;;;;=iiVRRVYI              
      XXXR+=;;;;+tttti+==+==iIIi=;;;;;;+IYVI=;;;;;+tIti=;=IVXXXXVYYVVV          
  +tIYYXVVi;;;;==+YYVVi=;;++=+tii=;;;;===tiii;;;;;=;++++;;iXYXXXVVVVVXX         
VYIYYYYVXXXI;;;+IVVYIt+i++++=;;;;;;;;++i;=;;;;;;;;;;;;;;;;=iVVXRXXXXXXV         
VVVVVVVXVVXVIIt+==;;===+tIi++;;;;;;;;=i+=;;;;;;;;;==;;;;:;tRXVXXXXXXXXV         
XXXXRRRYVVitIt;;==;;;;;==+t++=;=;;;;;;==i=+=;:::::;;;;;;;=tIVXYXRRRRRXV         
XVXXXXRXYVI==;;;;;;;;;;+i+YIii==+====;;;t+tti+=;::::::;;=itVXXVVVVXRRVt         
RRRRXVVXYXXYYIti;;;;;;;=YtIXVVIYti+;+;;;XitIIItt=:::::;=++iIYVXRRXRXXVI         
RXXYVVVXRXI+;==;;;;;;=;;=;;++=+it++==;+==;;;;;;;:;;;;;;;;+++ItIVXXVVYtXB        
RRRXXXXVVI+;;;;;;;;;;=+++=+==i++=+i+=i++Y=;;;;::::::;===;;;;VYIitYVVYt+V+=      
XXXXXXXItYi;;;;;;;;;;;;;=;===+==+=+t==iii;;;;;;::;=;:::::;:=VVVitIVVYi=::;;     
YVXXVVIiYVt;;;;;;=;::::;=;=+++==+=+t++Iti+;;:::::;;+=;:;:::+VXVitYVVYI=;:::;    
YVVVYYitXRt;:::;+itt+=:::;;=iIItt;=+=+Vttti+;::::==ii+=::::iY:=;+tYYYI=:,::::   
IYVVYIi=IX+:::;;;;+=+====+++itItIIIIIYVIIYIYIIIIIIIYIIItIIIYY ;==+IIIt=:,,,::   
tYYYIt+;==:::+XRBBMWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWMMMBMMMX  ;=+ittti+;;:,:;   
iIIIti+;;     RBMBMWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWMMBBMMB   ;++iii==;;:,:    
+tttii+=      RRBMMWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWMMMRMMB    ===;==;;;:::    
=++++==+      RRBMBWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWMBMRBMB      ,::::::;:     

`

const MatrixTerminal = ({ animate }) => {
  const [lines, setLines] = useState([])
  const [data, setData] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [asciiLines, setAsciiLines] = useState([])
  const [isAsciiComplete, setIsAsciiComplete] = useState(false)
  const [asciiIndex, setAsciiIndex] = useState(0)
  const [animationState, setAnimationState] = useState(false)
  const [userInput, setUserInput] = useState('')
  const [userMessages, setUserMessages] = useState([])
  const [typingMessage, setTypingMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [displayedMessages, setDisplayedMessages] = useState([])
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [subscriptionEmail, setSubscriptionEmail] = useState('')
  const [subscriptionStatus, setSubscriptionStatus] = useState('')
  const [showMenu, setShowMenu] = useState(true)
  const [menuOptions, setMenuOptions] = useState([
    { command: 'art', description: 'Display ASCII art' },
    { command: 'commits', description: 'Show recent Git commits' },
    { command: 'demo', description: 'Show demo terminal data' },
    { command: 'subscribe', description: 'Subscribe to updates' },
    { command: 'help', description: 'Show available commands' },
    { command: 'clear', description: 'Clear terminal' },
  ])
  // Add ref for scrolling
  const terminalContentRef = useRef(null)
  // Add new state for loading
  const [isLoading, setIsLoading] = useState(false)

  // Add scroll effect
  useEffect(() => {
    if (terminalContentRef.current) {
      terminalContentRef.current.scrollTop =
        terminalContentRef.current.scrollHeight
    }
  }, [lines, asciiLines, displayedMessages])

  // Add function to fetch commit data
  const fetchCommitHistory = async () => {
    try {
      const username = 'shinedark'
      const START_DATE = new Date('2025-01-06')
      let allCommits = []
      let page = 1

      while (true) {
        const response = await fetch(
          `https://api.github.com/search/commits?q=author:${username}+author-date:>=${START_DATE.toISOString()}&page=${page}&per_page=100`,
          {
            headers: {
              Authorization: `token ${process.env.REACT_APP_GITHUB_TOKEN}`,
              Accept: 'application/vnd.github.cloak-preview+json',
            },
          },
        )
        if (!response.ok) {
          throw new Error('Failed to fetch commit history')
        }

        const { items: commits, total_count } = await response.json()
        if (!commits || commits.length === 0) break

        allCommits = [...allCommits, ...commits]
        if (allCommits.length >= total_count) break
        page++
      }

      // console.log(allCommits)

      // Format commits into terminal lines
      const commitLines = allCommits.map(
        (item) =>
          `[${item.repository.name}] ${item.commit.message.split('\n')[0]}`,
      )

      // Add commits to lines
      setData((prevData) => [...prevData, ...commitLines])
    } catch (err) {
      console.error('Error fetching commit history:', err)
      setData((prevData) => [...prevData, 'Error fetching commit history'])
    }
  }

  useEffect(() => {
    const artLines = asciiArt.split('\n').slice(1)

    const typewriterEffect = () => {
      if (!isAsciiComplete) {
        if (asciiIndex < artLines.length) {
          setAsciiLines((prev) => [...prev, artLines[asciiIndex]])
          setAsciiIndex((prev) => prev + 1)
        } else {
          setIsAsciiComplete(true)
          setData([])
          displayMenu()
        }
      } else {
        if (currentIndex < data.length) {
          setLines((prev) => [...prev, data[currentIndex]])
          setCurrentIndex((prev) => prev + 1)
        }
      }
    }

    const timer = setInterval(typewriterEffect, 100)
    return () => clearInterval(timer)
  }, [asciiIndex, currentIndex, isAsciiComplete, data.length])

  useEffect(() => {
    if (animate) {
      setAnimationState(true)
    } else {
      setAnimationState(false)
    }
  }, [animate])

  const handleInputChange = (e) => {
    setUserInput(e.target.value)
  }

  // Add email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const displayMenu = () => {
    const menuText = [
      'Welcome to TERMINAL 303',
      'Available commands:',
      ...menuOptions.map(
        (opt) => `  ${opt.command.padEnd(10)} - ${opt.description}`,
      ),
      '',
      'Enter a command to begin:',
    ]
    setDisplayedMessages(menuText)
    setCurrentMessageIndex(menuText.length)
  }

  const handleInputSubmit = async (e) => {
    e.preventDefault()
    if (userInput.trim()) {
      const input = userInput.toLowerCase()
      setDisplayedMessages((prev) => [...prev, `> ${userInput}`])
      setUserInput('')

      switch (input) {
        case 'art':
          setAsciiLines([])
          setAsciiIndex(0)
          setIsAsciiComplete(false)
          setLines([])
          setData([])
          setDisplayedMessages([])
          break
        case 'commits':
          setLines([])
          setCurrentIndex(0)
          setAsciiLines([])
          setDisplayedMessages([])
          await fetchCommitHistory()
          break
        case 'demo':
          setLines([])
          setCurrentIndex(0)
          setAsciiLines([])
          setDisplayedMessages([])
          const dummyData = require('../../data/terminal-data.json')
          setData(dummyData.lines)
          break
        case 'clear':
          setLines([])
          setAsciiLines([])
          setUserMessages([])
          setDisplayedMessages([])
          setData([])
          displayMenu()
          break
        case 'help':
          displayMenu()
          break
        case 'subscribe':
          setIsSubscribing(true)
          setSubscriptionEmail('')
          setSubscriptionStatus('pending')
          setDisplayedMessages((prev) => [
            ...prev,
            'Please enter your email to subscribe:',
          ])
          break
        default:
          if (isSubscribing) {
            if (!isValidEmail(input)) {
              setDisplayedMessages((prev) => [
                ...prev,
                'Please enter a valid email address.',
                'Try again or type "clear" to cancel.',
              ])
              setSubscriptionStatus('error')
              return
            }

            setSubscriptionEmail(input)
            setIsLoading(true)
            setDisplayedMessages((prev) => [
              ...prev,
              `Attempting to subscribe: ${input}`,
              'Processing...',
            ])

            try {
              const response = await fetch(
                `${process.env.REACT_APP_API_URL}/api/subscribers/subscribe`,
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ email: input }),
                },
              )

              const data = await response.json()

              if (!response.ok) {
                throw new Error(data.message || 'Something went wrong')
              }

              setDisplayedMessages((prev) => [
                ...prev,
                '✓ Subscription successful!',
                `Email confirmed: ${input}`,
                'You will receive updates about new projects and features.',
                '',
                'Type "help" to see available commands.',
              ])
              setSubscriptionStatus('success')
            } catch (error) {
              setDisplayedMessages((prev) => [
                ...prev,
                `× Subscription failed: ${
                  error.message || 'Something went wrong.'
                }`,
                'Please try again or type "clear" to cancel.',
              ])
              setSubscriptionStatus('error')
            } finally {
              setIsLoading(false)
              setIsSubscribing(false)
            }
          } else {
            setDisplayedMessages((prev) => [
              ...prev,
              'Unknown command. Type "help" to see available commands.',
            ])
          }
      }
    }
  }

  useEffect(() => {
    if (userMessages.length > displayedMessages.length) {
      setDisplayedMessages((prev) => [
        ...prev,
        ...userMessages.slice(prev.length),
      ])
    }
  }, [userMessages, displayedMessages.length])

  const renderTerminal = () => {
    if (animate) return
    return (
      <div
        className={
          animationState
            ? 'matrix-terminal-animate-continuous'
            : 'matrix-terminal-animate-initial'
        }
      >
        <div className="terminal-header">
          <span className="terminal-title">TERMINAL 303</span>
          <div className="terminal-buttons">
            <span className="terminal-button close"></span>
            <span className="terminal-button minimize"></span>
            <span className="terminal-button maximize"></span>
          </div>
        </div>
        <div className="terminal-content" ref={terminalContentRef}>
          <div className="ascii-art">
            {asciiLines.map((line, index) => (
              <div key={index} className="terminal-line">
                <span className="prompt">$</span>
                <span className="text">{line}</span>
              </div>
            ))}
          </div>
          {lines.map((line, index) => (
            <div key={index} className="terminal-line">
              <span className="prompt">$</span>
              <span className="text">{line}</span>
            </div>
          ))}
          {displayedMessages.map((message, index) => (
            <div key={`msg-${index}`} className="terminal-line">
              <span className="prompt">
                {message.startsWith('>') ? '' : '$'}
              </span>
              <span className="text user-message">{message}</span>
            </div>
          ))}
          <div className="terminal-line">
            <span className="prompt">$</span>
            <input
              type="text"
              placeholder="TYPE TO SEE"
              value={userInput}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleInputSubmit(e)
                }
              }}
              className="terminal-input"
              autoFocus
            />
          </div>
        </div>
      </div>
    )
  }

  return <div className="matrix-terminal-container">{renderTerminal()}</div>
}

export default MatrixTerminal
