import React, { createContext, useState, useContext } from 'react';

const GamificationContext = createContext();

export function useGamification() {
  return useContext(GamificationContext);
}

export function GamificationProvider({ children }) {
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [badges, setBadges] = useState([]);

  const addXp = (amount) => {
    setXp(prevXp => {
      const newXp = prevXp + amount;
      // Level up every 1000 XP
      if (newXp >= level * 1000) {
        setLevel(prevLevel => prevLevel + 1);
      }
      return newXp;
    });
  };

  const addBadge = (badge) => {
    setBadges(prevBadges => [...prevBadges, badge]);
  };

  const value = {
    xp,
    level,
    badges,
    addXp,
    addBadge
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
} 