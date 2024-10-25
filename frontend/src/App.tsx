import React from "react";
import { useState, createContext } from "react";
import NavBar from './components/NavBar'
import AllEntries from './routes/AllEntries'
import NewEntry from './routes/NewEntry'
import EditEntry from './routes/EditEntry'
import { EntryProvider } from './utilities/globalContext'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

export const ThemeContext = createContext({
  themeName: 'light',
  onToggle: () => {},
});

export default function App() {
  // default: light theme
  const [theme, setTheme] = useState<string>('light');

  const onToggle = () => {
    setTheme((previousTheme) => (previousTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ themeName: theme, onToggle: onToggle}}>
    <div className={theme === 'dark' ? 'dark' : ''}>
      <section className="min-h-screen dark:bg-gray-800">
      <Router>
        <EntryProvider>
        <NavBar></NavBar>
          <Routes>
            <Route path="/" element={<AllEntries/>}>
            </Route>
            <Route path="create" element={<NewEntry/>}>
            </Route>
            <Route path="edit/:id" element={<EditEntry/>}>
            </Route>
          </Routes>
        </EntryProvider>
        </Router>
        </section>
    </div>
    </ThemeContext.Provider>
  );
}
