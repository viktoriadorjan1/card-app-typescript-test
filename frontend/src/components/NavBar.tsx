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
      {isSettingsDialogOpen && <label className="inline-flex items-center cursor-pointer">
      <input type="checkbox" value="" className="sr-only peer" checked={themeContext.themeName == "dark"} onChange={themeContext.onToggle}></input>
      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
      <span className="pl-2 ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Dark mode toggle</span>
      </label>}
      
    </nav>
  );
}
