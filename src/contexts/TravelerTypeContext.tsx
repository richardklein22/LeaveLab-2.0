'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type TravelerType = 'nomad' | 'traveler';

interface TravelerTypeContextType {
  travelerType: TravelerType;
  setTravelerType: (type: TravelerType) => void;
}

const TravelerTypeContext = createContext<TravelerTypeContextType | undefined>(undefined);

export function TravelerTypeProvider({ children }: { children: ReactNode }) {
  const [travelerType, setTravelerType] = useState<TravelerType>('nomad');

  return (
    <TravelerTypeContext.Provider value={{ travelerType, setTravelerType }}>
      {children}
    </TravelerTypeContext.Provider>
  );
}

export function useTravelerType() {
  const context = useContext(TravelerTypeContext);
  if (context === undefined) {
    throw new Error('useTravelerType must be used within a TravelerTypeProvider');
  }
  return context;
}

