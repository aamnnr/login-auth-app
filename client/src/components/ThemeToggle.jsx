import React from 'react';
import { Sun, Moon } from 'react-feather';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="
        rounded-lg p-2
        text-gray-600 hover:bg-gray-200
        dark:text-gray-300 dark:hover:bg-gray-700
      "
    >
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
};

export default ThemeToggle;
