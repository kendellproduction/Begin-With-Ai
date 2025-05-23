import { useState, useRef, useEffect } from 'react';
import { sanitizeCode, checkRateLimit } from '../utils/sanitization';

/**
 * Custom hook for executing code safely in a sandboxed iframe
 * This prevents malicious code from accessing the parent page or user data
 * Enhanced with security measures following BeginningWithAi guidelines
 */
export default function useSandboxExecution() {
  const [output, setOutput] = useState('');
  const [error, setError] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const iframeRef = useRef(null);
  
  // Create and setup sandbox iframe on component mount
  useEffect(() => {
    // Create a sandboxed iframe
    const iframe = document.createElement('iframe');
    
    // Set strict sandbox attributes - more restrictive for security
    iframe.sandbox = 'allow-scripts';
    iframe.setAttribute('data-security', 'sandboxed');
    
    // Make it invisible but keep it in the DOM
    iframe.style.display = 'none';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    
    // Append to document
    document.body.appendChild(iframe);
    
    // Store reference
    iframeRef.current = iframe;
    
    // Setup message listener for communication with the iframe
    const handleMessage = (event) => {
      // Only accept messages from our iframe
      if (event.source !== iframe.contentWindow) return;
      
      // Validate message structure
      if (!event.data || typeof event.data !== 'object') return;
      
      const { type, data } = event.data;
      
      if (type === 'output') {
        setOutput(prev => prev + data);
      } else if (type === 'error') {
        setError(data);
        setIsRunning(false);
      } else if (type === 'done') {
        setIsRunning(false);
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    // Cleanup
    return () => {
      window.removeEventListener('message', handleMessage);
      if (iframe.parentNode) {
        document.body.removeChild(iframe);
      }
    };
  }, []);
  
  // Function to execute code in the sandbox
  const executeCode = (code, language = 'javascript', timeout = 5000, userId = 'anonymous') => {
    if (!iframeRef.current) {
      setError({ message: 'Sandbox not initialized' });
      return;
    }
    
    // Rate limiting check
    const rateCheck = checkRateLimit(`code_execution_${userId}`, 10, 60000); // 10 executions per minute
    if (!rateCheck.allowed) {
      setError({ message: 'Too many code executions. Please wait a minute before trying again.' });
      return;
    }
    
    // Sanitize the code before execution
    const sanitizedCode = sanitizeCode(code, language);
    
    // Check for blocked patterns
    if (sanitizedCode.includes('EVAL_BLOCKED') || 
        sanitizedCode.includes('FUNCTION_BLOCKED') || 
        sanitizedCode.includes('DOCUMENT_WRITE_BLOCKED')) {
      setError({ message: 'Code contains potentially dangerous patterns that have been blocked for security.' });
      return;
    }
    
    // Reset state
    setOutput('');
    setError(null);
    setIsRunning(true);
    
    // Create sandbox HTML with enhanced CSP headers
    const sandboxHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta http-equiv="Content-Security-Policy" 
                content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline';">
          <meta http-equiv="X-Content-Type-Options" content="nosniff">
          <meta http-equiv="X-Frame-Options" content="DENY">
          <title>Secure Code Sandbox</title>
        </head>
        <body>
          <script>
            // Security: Block access to dangerous APIs
            delete window.fetch;
            delete window.XMLHttpRequest;
            delete window.WebSocket;
            delete window.localStorage;
            delete window.sessionStorage;
            delete window.indexedDB;
            delete window.location;
            delete window.history;
            delete window.navigator;
            
            // Override console methods
            const originalConsole = console;
            
            console = Object.keys(originalConsole).reduce((acc, key) => {
              if (typeof originalConsole[key] === 'function') {
                acc[key] = (...args) => {
                  try {
                    // Sanitize output to prevent injection
                    const sanitizedArgs = args.map(arg => {
                      if (typeof arg === 'object') {
                        try {
                          return JSON.stringify(arg, null, 2);
                        } catch (e) {
                          return '[Object: Cannot stringify]';
                        }
                      }
                      return String(arg).replace(/<script[^>]*>.*?<\\/script>/gi, '[SCRIPT_BLOCKED]');
                    });
                    
                    // Send output to parent
                    window.parent.postMessage({
                      type: 'output',
                      data: sanitizedArgs.join(' ') + '\\n'
                    }, '*');
                    
                    // Also log to original console
                    originalConsole[key](...args);
                  } catch (e) {
                    window.parent.postMessage({
                      type: 'error',
                      data: { message: 'Console output error: ' + e.message }
                    }, '*');
                  }
                };
              } else {
                acc[key] = originalConsole[key];
              }
              return acc;
            }, {});
            
            // Set up error handling
            window.onerror = (message, source, line, column, error) => {
              window.parent.postMessage({
                type: 'error',
                data: { 
                  message: String(message).substring(0, 500), // Limit error message length
                  line: line,
                  column: column 
                }
              }, '*');
              return true;
            };
            
            // Unhandled promise rejection handler
            window.addEventListener('unhandledrejection', function(event) {
              window.parent.postMessage({
                type: 'error',
                data: { message: 'Unhandled promise rejection: ' + String(event.reason).substring(0, 500) }
              }, '*');
            });
            
            // Add execution timeout
            const timeoutId = setTimeout(() => {
              window.parent.postMessage({
                type: 'error',
                data: { message: 'Code execution timed out after ${timeout}ms' }
              }, '*');
            }, ${timeout});
            
            // Execute the code with additional security wrapping
            try {
              // Create isolated scope
              (function() {
                'use strict';
                
                // Block dangerous global access
                const blocked = () => {
                  throw new Error('Access to this API is blocked for security reasons');
                };
                
                // Override dangerous functions
                window.eval = blocked;
                window.Function = blocked;
                window.setTimeout = (fn, delay) => {
                  if (typeof fn === 'string') throw new Error('setTimeout with string code is blocked');
                  return originalSetTimeout(fn, Math.min(delay, 1000)); // Max 1 second delay
                };
                window.setInterval = blocked;
                
                const originalSetTimeout = window.setTimeout;
                
                ${language === 'javascript' ? sanitizedCode : ''}
                
                clearTimeout(timeoutId);
                window.parent.postMessage({ type: 'done' }, '*');
              })();
            } catch (e) {
              clearTimeout(timeoutId);
              window.parent.postMessage({
                type: 'error',
                data: { 
                  message: String(e.message).substring(0, 500),
                  line: e.lineNumber,
                  column: e.columnNumber 
                }
              }, '*');
            }
          </script>
        </body>
      </html>
    `;
    
    // Write to iframe
    const iframe = iframeRef.current;
    try {
      iframe.contentWindow.document.open();
      iframe.contentWindow.document.write(sandboxHTML);
      iframe.contentWindow.document.close();
    } catch (e) {
      setError({ message: 'Failed to execute code in sandbox: ' + e.message });
      setIsRunning(false);
    }
  };
  
  return {
    executeCode,
    output,
    error,
    isRunning
  };
} 