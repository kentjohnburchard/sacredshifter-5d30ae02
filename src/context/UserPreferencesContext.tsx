
import React, { createContext, useContext, useState } from 'react';

interface UserPreferences {
  reduceAnimations: boolean;
  theme: string;
}

interface UserPreferencesContextType {
  userPreferences: UserPreferences;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
}

const defaultPreferences = {
  reduceAnimations: false,
  theme: 'dark',
};

const UserPreferencesContext = createContext<UserPreferencesContextType>({
  userPreferences: defaultPreferences,
  updatePreferences: () => {},
});

export const UserPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(defaultPreferences);

  const updatePreferences = (preferences: Partial<UserPreferences>) => {
    setUserPreferences((prev) => ({ ...prev, ...preferences }));
  };

  return (
    <UserPreferencesContext.Provider value={{ userPreferences, updatePreferences }}>
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => useContext(UserPreferencesContext);
