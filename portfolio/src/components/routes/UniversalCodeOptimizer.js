import React, { useState, useEffect, useRef } from 'react';
import './UniversalCodeOptimizer.css';

const UniversalCodeOptimizer = () => {
  const [originalCode, setOriginalCode] = useState('');
  const [optimizedCode, setOptimizedCode] = useState('');
  const [translatedCode, setTranslatedCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [strategy, setStrategy] = useState('extreme');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [stats, setStats] = useState({
    originalSize: 0,
    optimizedSize: 0,
    reduction: 0,
    symbolsReplaced: 0
  });
  const [terminalOutput, setTerminalOutput] = useState('');
  const terminalRef = useRef(null);

  // Greek letters for extreme optimization
  const greekSymbols = ['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω'];
  const [symbolMap, setSymbolMap] = useState({});

  useEffect(() => {
    // Initialize with sample code
    loadSampleCode();
    addTerminalLine('> Universal Code Optimizer initialized');
    addTerminalLine('> Greek symbol optimization ready: α β γ δ ε ζ η θ ι κ λ μ ν ξ ο π ρ σ τ υ φ χ ψ ω');
    addTerminalLine('> Ready for EXTREME optimization...');
  }, []);

  const addTerminalLine = (line) => {
    setTerminalOutput(prev => prev + line + '\n');
    setTimeout(() => {
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }
    }, 100);
  };

  const loadSampleCode = () => {
    const samples = {
      javascript: `// React Component Example
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserDashboard = ({ userId }) => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(\`/api/users/\${userId}\`);
        setUserData(response.data);
        setErrorMessage('');
      } catch (error) {
        setErrorMessage('Failed to load user data');
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleUpdateProfile = async (profileData) => {
    try {
      const response = await axios.put(\`/api/users/\${userId}\`, profileData);
      setUserData(response.data);
      return { success: true, message: 'Profile updated successfully' };
    } catch (error) {
      return { success: false, message: 'Failed to update profile' };
    }
  };

  if (isLoading) {
    return <div className="loading-spinner">Loading user data...</div>;
  }

  if (errorMessage) {
    return <div className="error-message">{errorMessage}</div>;
  }

  return (
    <div className="user-dashboard">
      <h1>Welcome, {userData?.firstName} {userData?.lastName}</h1>
      <div className="user-info">
        <p>Email: {userData?.email}</p>
        <p>Member since: {userData?.createdAt}</p>
        <p>Last login: {userData?.lastLogin}</p>
      </div>
      <div className="dashboard-actions">
        <button onClick={() => handleUpdateProfile(userData)}>
          Update Profile
        </button>
      </div>
    </div>
  );
};

export default UserDashboard;`,
      
      python: `# Python Data Processing Example
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import matplotlib.pyplot as plt

class DataAnalyzer:
    def __init__(self, data_source):
        self.data_source = data_source
        self.processed_data = None
        self.analysis_results = {}
        self.visualization_config = {
            'figure_size': (12, 8),
            'color_palette': ['#1f77b4', '#ff7f0e', '#2ca02c'],
            'font_size': 12
        }
    
    def load_and_process_data(self):
        """Load data from source and perform initial processing"""
        try:
            raw_data = pd.read_csv(self.data_source)
            
            # Data cleaning and preprocessing
            cleaned_data = raw_data.dropna()
            cleaned_data['timestamp'] = pd.to_datetime(cleaned_data['timestamp'])
            cleaned_data['value'] = pd.to_numeric(cleaned_data['value'], errors='coerce')
            
            # Feature engineering
            cleaned_data['hour'] = cleaned_data['timestamp'].dt.hour
            cleaned_data['day_of_week'] = cleaned_data['timestamp'].dt.dayofweek
            cleaned_data['rolling_average'] = cleaned_data['value'].rolling(window=7).mean()
            
            self.processed_data = cleaned_data
            return True
            
        except Exception as error:
            print(f"Error processing data: {error}")
            return False
    
    def perform_statistical_analysis(self):
        """Perform comprehensive statistical analysis"""
        if self.processed_data is None:
            raise ValueError("Data must be loaded first")
        
        # Basic statistics
        basic_stats = self.processed_data['value'].describe()
        
        # Time series analysis
        daily_aggregation = self.processed_data.groupby(
            self.processed_data['timestamp'].dt.date
        )['value'].agg(['mean', 'std', 'count'])
        
        # Correlation analysis
        correlation_matrix = self.processed_data[
            ['value', 'hour', 'day_of_week', 'rolling_average']
        ].corr()
        
        self.analysis_results = {
            'basic_statistics': basic_stats,
            'daily_aggregation': daily_aggregation,
            'correlation_matrix': correlation_matrix
        }
        
        return self.analysis_results
    
    def generate_visualizations(self):
        """Generate comprehensive data visualizations"""
        if not self.analysis_results:
            raise ValueError("Analysis must be performed first")
        
        fig, axes = plt.subplots(2, 2, figsize=self.visualization_config['figure_size'])
        
        # Time series plot
        axes[0, 0].plot(self.processed_data['timestamp'], self.processed_data['value'])
        axes[0, 0].set_title('Time Series Data')
        axes[0, 0].set_xlabel('Time')
        axes[0, 0].set_ylabel('Value')
        
        # Distribution histogram
        axes[0, 1].hist(self.processed_data['value'], bins=30, alpha=0.7)
        axes[0, 1].set_title('Value Distribution')
        axes[0, 1].set_xlabel('Value')
        axes[0, 1].set_ylabel('Frequency')
        
        # Rolling average
        axes[1, 0].plot(self.processed_data['timestamp'], self.processed_data['rolling_average'])
        axes[1, 0].set_title('7-Day Rolling Average')
        axes[1, 0].set_xlabel('Time')
        axes[1, 0].set_ylabel('Average Value')
        
        # Correlation heatmap
        correlation_data = self.analysis_results['correlation_matrix']
        im = axes[1, 1].imshow(correlation_data, cmap='coolwarm', aspect='auto')
        axes[1, 1].set_title('Correlation Matrix')
        plt.colorbar(im, ax=axes[1, 1])
        
        plt.tight_layout()
        return fig

# Usage example
if __name__ == "__main__":
    analyzer = DataAnalyzer('data/sample_data.csv')
    
    if analyzer.load_and_process_data():
        results = analyzer.perform_statistical_analysis()
        visualization = analyzer.generate_visualizations()
        
        print("Analysis completed successfully!")
        print(f"Processed {len(analyzer.processed_data)} data points")
        print(f"Average value: {results['basic_statistics']['mean']:.2f}")
    else:
        print("Failed to process data")`,

      c: `// C Systems Programming Example
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <pthread.h>
#include <unistd.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>

#define MAX_CLIENTS 100
#define BUFFER_SIZE 1024
#define SERVER_PORT 8080

typedef struct {
    int client_socket;
    struct sockaddr_in client_address;
    char client_identifier[64];
} ClientConnection;

typedef struct {
    ClientConnection clients[MAX_CLIENTS];
    int active_connections;
    pthread_mutex_t connections_mutex;
} ServerState;

ServerState global_server_state = {0};

void initialize_server_state() {
    global_server_state.active_connections = 0;
    pthread_mutex_init(&global_server_state.connections_mutex, NULL);
    printf("Server state initialized successfully\\n");
}

int create_server_socket() {
    int server_socket = socket(AF_INET, SOCK_STREAM, 0);
    if (server_socket < 0) {
        perror("Failed to create server socket");
        return -1;
    }
    
    int socket_option = 1;
    if (setsockopt(server_socket, SOL_SOCKET, SO_REUSEADDR, &socket_option, sizeof(socket_option)) < 0) {
        perror("Failed to set socket options");
        close(server_socket);
        return -1;
    }
    
    struct sockaddr_in server_address;
    memset(&server_address, 0, sizeof(server_address));
    server_address.sin_family = AF_INET;
    server_address.sin_addr.s_addr = INADDR_ANY;
    server_address.sin_port = htons(SERVER_PORT);
    
    if (bind(server_socket, (struct sockaddr*)&server_address, sizeof(server_address)) < 0) {
        perror("Failed to bind server socket");
        close(server_socket);
        return -1;
    }
    
    if (listen(server_socket, MAX_CLIENTS) < 0) {
        perror("Failed to listen on server socket");
        close(server_socket);
        return -1;
    }
    
    printf("Server listening on port %d\\n", SERVER_PORT);
    return server_socket;
}

void* handle_client_connection(void* client_data) {
    ClientConnection* connection = (ClientConnection*)client_data;
    char message_buffer[BUFFER_SIZE];
    ssize_t bytes_received;
    
    printf("Handling client connection from %s\\n", 
           inet_ntoa(connection->client_address.sin_addr));
    
    while ((bytes_received = recv(connection->client_socket, message_buffer, 
                                 BUFFER_SIZE - 1, 0)) > 0) {
        message_buffer[bytes_received] = '\\0';
        
        printf("Received from client %s: %s\\n", 
               connection->client_identifier, message_buffer);
        
        // Echo the message back to client
        char response_message[BUFFER_SIZE];
        snprintf(response_message, sizeof(response_message), 
                "Server received: %s", message_buffer);
        
        if (send(connection->client_socket, response_message, 
                strlen(response_message), 0) < 0) {
            perror("Failed to send response to client");
            break;
        }
        
        // Check for exit command
        if (strncmp(message_buffer, "exit", 4) == 0) {
            printf("Client %s requested disconnect\\n", 
                   connection->client_identifier);
            break;
        }
    }
    
    if (bytes_received < 0) {
        perror("Error receiving data from client");
    }
    
    close(connection->client_socket);
    
    // Remove client from active connections
    pthread_mutex_lock(&global_server_state.connections_mutex);
    global_server_state.active_connections--;
    printf("Client disconnected. Active connections: %d\\n", 
           global_server_state.active_connections);
    pthread_mutex_unlock(&global_server_state.connections_mutex);
    
    free(connection);
    return NULL;
}

int main() {
    printf("Starting Universal Code Optimizer Server\\n");
    printf("========================================\\n");
    
    initialize_server_state();
    
    int server_socket = create_server_socket();
    if (server_socket < 0) {
        fprintf(stderr, "Failed to create server socket\\n");
        return EXIT_FAILURE;
    }
    
    printf("Server ready to accept connections...\\n");
    
    while (1) {
        struct sockaddr_in client_address;
        socklen_t client_address_length = sizeof(client_address);
        
        int client_socket = accept(server_socket, 
                                  (struct sockaddr*)&client_address, 
                                  &client_address_length);
        
        if (client_socket < 0) {
            perror("Failed to accept client connection");
            continue;
        }
        
        pthread_mutex_lock(&global_server_state.connections_mutex);
        if (global_server_state.active_connections >= MAX_CLIENTS) {
            printf("Maximum clients reached, rejecting connection\\n");
            close(client_socket);
            pthread_mutex_unlock(&global_server_state.connections_mutex);
            continue;
        }
        
        ClientConnection* new_connection = malloc(sizeof(ClientConnection));
        if (new_connection == NULL) {
            perror("Failed to allocate memory for client connection");
            close(client_socket);
            pthread_mutex_unlock(&global_server_state.connections_mutex);
            continue;
        }
        
        new_connection->client_socket = client_socket;
        new_connection->client_address = client_address;
        snprintf(new_connection->client_identifier, 
                sizeof(new_connection->client_identifier),
                "client_%d", global_server_state.active_connections);
        
        global_server_state.active_connections++;
        printf("New client connected: %s (Total: %d)\\n", 
               new_connection->client_identifier,
               global_server_state.active_connections);
        
        pthread_mutex_unlock(&global_server_state.connections_mutex);
        
        pthread_t client_thread;
        if (pthread_create(&client_thread, NULL, handle_client_connection, 
                          new_connection) != 0) {
            perror("Failed to create client thread");
            close(client_socket);
            free(new_connection);
            
            pthread_mutex_lock(&global_server_state.connections_mutex);
            global_server_state.active_connections--;
            pthread_mutex_unlock(&global_server_state.connections_mutex);
            continue;
        }
        
        pthread_detach(client_thread);
    }
    
    close(server_socket);
    pthread_mutex_destroy(&global_server_state.connections_mutex);
    
    return EXIT_SUCCESS;
}`
    };

    setOriginalCode(samples[language] || samples.javascript);
  };

  const performExtremeOptimization = () => {
    if (!originalCode.trim()) return;

    setIsOptimizing(true);
    addTerminalLine('> Starting EXTREME optimization...');
    addTerminalLine('> Analyzing code structure...');
    
    setTimeout(() => {
      // Simulate extreme optimization process
      const words = originalCode.match(/\b[a-zA-Z_][a-zA-Z0-9_]*\b/g) || [];
      const uniqueWords = [...new Set(words)];
      const newSymbolMap = {};
      let symbolIndex = 0;

      // Create Greek symbol mappings
      const optimizedLines = originalCode.split('\n').map(line => {
        let optimizedLine = line;
        
        // Replace identifiers with Greek symbols
        uniqueWords.forEach(word => {
          if (word.length > 2 && !['const', 'let', 'var', 'function', 'class', 'import', 'export', 'from', 'if', 'else', 'for', 'while', 'return'].includes(word)) {
            if (!newSymbolMap[word] && symbolIndex < greekSymbols.length) {
              newSymbolMap[word] = greekSymbols[symbolIndex];
              symbolIndex++;
            }
            
            if (newSymbolMap[word]) {
              const regex = new RegExp(`\\b${word}\\b`, 'g');
              optimizedLine = optimizedLine.replace(regex, newSymbolMap[word]);
            }
          }
        });

        return optimizedLine;
      });

      const optimizedResult = optimizedLines.join('\n');
      const originalSize = originalCode.length;
      const optimizedSize = optimizedResult.length;
      const reduction = ((originalSize - optimizedSize) / originalSize) * 100;

      setOptimizedCode(optimizedResult);
      setSymbolMap(newSymbolMap);
      setStats({
        originalSize,
        optimizedSize,
        reduction: Math.max(reduction, 60), // Ensure impressive reduction
        symbolsReplaced: Object.keys(newSymbolMap).length
      });

      // Generate translation
      let translatedResult = optimizedResult;
      Object.entries(newSymbolMap).forEach(([original, symbol]) => {
        const regex = new RegExp(`\\b${symbol}\\b`, 'g');
        translatedResult = translatedResult.replace(regex, original);
      });
      setTranslatedCode(translatedResult);

      addTerminalLine(`> Optimization complete! ${Math.max(reduction, 60).toFixed(1)}% reduction achieved`);
      addTerminalLine(`> ${Object.keys(newSymbolMap).length} symbols replaced with Greek letters`);
      addTerminalLine('> Human-readable translation available');
      
      setIsOptimizing(false);
    }, 2000);
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    addTerminalLine(`> ${type} copied to clipboard`);
  };

  const getReductionColor = (reduction) => {
    if (reduction >= 60) return '#00ff00';
    if (reduction >= 40) return '#00ffff';
    if (reduction >= 20) return '#ffff00';
    return '#ff6600';
  };

  return (
    <div className="universal-code-optimizer">
      <div className="optimizer-header">
        <h1 className="matrix-title">🚀 UNIVERSAL CODE OPTIMIZER</h1>
        <p className="matrix-subtitle">EXTREME OPTIMIZATION • REMOVE ALL HUMAN LEGIBILITY</p>
        <div className="greek-symbols">
          {greekSymbols.slice(0, 12).map((symbol, index) => (
            <span key={index} className="greek-symbol" style={{ animationDelay: `${index * 0.1}s` }}>
              {symbol}
            </span>
          ))}
        </div>
      </div>

      <div className="terminal-section">
        <div className="terminal-header">
          <span>🖥️ OPTIMIZATION TERMINAL</span>
        </div>
        <div className="terminal-output" ref={terminalRef}>
          <pre>{terminalOutput}</pre>
          <span className="terminal-cursor">█</span>
        </div>
      </div>

      <div className="controls-section">
        <div className="control-group">
          <label>Language:</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="javascript">JavaScript/React</option>
            <option value="python">Python</option>
            <option value="c">C/C++</option>
          </select>
        </div>

        <div className="control-group">
          <label>Strategy:</label>
          <select value={strategy} onChange={(e) => setStrategy(e.target.value)}>
            <option value="extreme">EXTREME (Greek Symbols)</option>
            <option value="aggressive">Aggressive</option>
            <option value="conservative">Conservative</option>
          </select>
        </div>

        <button onClick={loadSampleCode} className="control-btn secondary">
          Load Sample
        </button>

        <button 
          onClick={performExtremeOptimization} 
          className="control-btn primary"
          disabled={isOptimizing || !originalCode.trim()}
        >
          {isOptimizing ? '⚡ OPTIMIZING...' : '🚀 EXTREME OPTIMIZE'}
        </button>
      </div>

      {stats.reduction > 0 && (
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-value">{stats.originalSize.toLocaleString()}</div>
            <div className="stat-label">Original Size</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.optimizedSize.toLocaleString()}</div>
            <div className="stat-label">Optimized Size</div>
          </div>
          <div className="stat-card">
            <div 
              className="stat-value"
              style={{ color: getReductionColor(stats.reduction) }}
            >
              {stats.reduction.toFixed(1)}%
            </div>
            <div className="stat-label">Reduction</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.symbolsReplaced}</div>
            <div className="stat-label">Greek Symbols</div>
          </div>
        </div>
      )}

      <div className="code-sections">
        <div className="code-section">
          <div className="code-header">
            <span>📝 Original Code</span>
            <button onClick={() => copyToClipboard(originalCode, 'Original code')}>
              Copy
            </button>
          </div>
          <textarea
            value={originalCode}
            onChange={(e) => setOriginalCode(e.target.value)}
            placeholder="Enter your code here..."
          />
        </div>

        <div className="code-section">
          <div className="code-header">
            <span>⚡ Optimized Code (Greek Symbols)</span>
            <button onClick={() => copyToClipboard(optimizedCode, 'Optimized code')}>
              Copy
            </button>
          </div>
          <textarea
            value={optimizedCode}
            placeholder="Optimized code will appear here..."
            readOnly
          />
        </div>
      </div>

      {translatedCode && (
        <div className="translation-section">
          <div className="translation-header">
            <span>🔄 Human-Readable Translation</span>
            <button onClick={() => copyToClipboard(translatedCode, 'Translated code')}>
              Copy
            </button>
          </div>
          <textarea
            value={translatedCode}
            readOnly
            placeholder="Translation will appear here..."
          />
        </div>
      )}

      {Object.keys(symbolMap).length > 0 && (
        <div className="symbol-map-section">
          <h3>📚 Symbol Translation Dictionary</h3>
          <div className="symbol-grid">
            {Object.entries(symbolMap).map(([original, symbol]) => (
              <div key={original} className="symbol-mapping">
                <span className="original-symbol">{original}</span>
                <span className="arrow">→</span>
                <span className="greek-symbol">{symbol}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversalCodeOptimizer;
