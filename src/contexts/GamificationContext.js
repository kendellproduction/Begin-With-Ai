import React, { createContext, useContext, useState } from 'react';

const GamificationContext = createContext();

export function useGamification() {
  return useContext(GamificationContext);
}

export function GamificationProvider({ children }) {
  const [userStats, setUserStats] = useState({
    xp: 340,
    level: 2,
  });

  const value = {
    userStats,
    setUserStats,
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
} 