import React from "react";
import NavBar from './components/NavBar'
import AllEntries from './routes/AllEntries'
import NewEntry from './routes/NewEntry'
import EditEntry from './routes/EditEntry'
import CssBaseline from '@mui/material/CssBaseline';
import { EntryProvider } from './utilities/globalContext'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

export default function App() {

  const darkTheme = createTheme({
    palette: {
      mode: 'dark'
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <section>
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
    </ThemeProvider>
  );
}
