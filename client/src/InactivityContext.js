import React, { createContext, useContext, useEffect, useRef, useCallback } from 'react';

const InactivityContext = createContext();

export const useInactivity = () => useContext(InactivityContext);

export const InactivityProvider = ({ children }) => {
  const inactivityTimer = useRef(null); // Store the inactivity timer
  const INACTIVITY_PERIOD = 10000; // Lock after 10 seconds of inactivity

  // Lock screen function (called after inactivity period)
  const lockScreen = useCallback(() => {
    console.log('Locking screen due to inactivity');
    
    // Redirect to lock.html page to simulate locking the system
    // If it's an Electron app, this would lock the screen, for now, simulate it using fullscreen
    if (window.electron) {
      window.electron.lockScreen(); // Lock system using Electron API
    } else {
      // Simulate by redirecting to lock.html and forcing fullscreen
      window.location.replace('../lock.html'); // Redirect to the lock screen page
    }
  }, []);

  // Reset inactivity timer on user activity
  const resetTimer = useCallback(() => {
    clearTimeout(inactivityTimer.current); // Clear any existing timer
    inactivityTimer.current = setTimeout(lockScreen, INACTIVITY_PERIOD); // Start a new timer
  }, [lockScreen, INACTIVITY_PERIOD]);

  useEffect(() => {
    // Events that will trigger a reset of the timer
    const events = ['mousemove', 'keydown', 'click', 'touchstart']; // Detect various user activities

    // Attach event listeners to reset the timer on user activity
    events.forEach((event) => window.addEventListener(event, resetTimer));

    // Start the inactivity timer on component mount
    resetTimer();

    // Cleanup event listeners on component unmount
    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      clearTimeout(inactivityTimer.current);
    };
  }, [resetTimer]);

  return (
    <InactivityContext.Provider value={{ resetTimer }}>
      {children}
    </InactivityContext.Provider>
  );
};
