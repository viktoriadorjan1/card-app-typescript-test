import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import { ThemeContext } from "../App";

export default function NavBar() {
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState<boolean>(false);
  const themeContext = useContext(ThemeContext);

  return (
    <nav className="flex justify-center gap-5">
      <NavLink
        className="m-3 p-4 text-xl bg-blue-400 dark:bg-blue-500 hover:bg-blue-500 dark:hover:bg-blue-400 rounded-md font-medium text-white"
        to={"/"}
      >
        All Entries
      </NavLink>
      <NavLink
        className="m-3 p-4 text-xl bg-blue-400 dark:bg-blue-500 hover:bg-blue-500 dark:hover:bg-blue-400 rounded-md font-medium text-white"
        to={"/create"}
      >
        New Entry
      </NavLink>
      <button
        onClick={() => setIsSettingsDialogOpen(!isSettingsDialogOpen)}
        className="m-3 p-4 text-xl bg-blue-400 dark:bg-blue-500 hover:bg-blue-500 dark:hover:bg-blue-400 rounded-md font-medium text-white"
      >
        Settings
      </button>
      {isSettingsDialogOpen && <Toggle onChange={themeContext.onToggle} icons={{ checked: "☀️", unchecked: "🌙" }} />}
    </nav>
  );
}
