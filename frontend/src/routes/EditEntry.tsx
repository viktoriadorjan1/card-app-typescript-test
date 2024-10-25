import { ChangeEvent, MouseEvent, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Entry, EntryContextType } from "../@types/context";
import { EntryContext } from "../utilities/globalContext";

export default function EditEntry() {
  const { id } = useParams();
  const emptyEntry: Entry = { title: "", description: "", created_at: new Date() };

  const { updateEntry, entries } = useContext(EntryContext) as EntryContextType;
  const [newEntry, setNewEntry] = useState<Entry>(emptyEntry);

  useEffect(() => {
    const entry = entries.filter((entry) => entry.id == id)[0];
    setNewEntry(entry);
  }, []);
  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewEntry({
      ...newEntry,
      [event.target.name]: event.target.value,
    });
  };
  const handleSend = (e: MouseEvent<HTMLButtonElement>) => {
    updateEntry(id as string, newEntry);
  };
  return (
    <section className="flex justify-center flex-col w-fit ml-auto mr-auto mt-10 gap-5 bg-gray-300 dark:bg-gray-600 p-8 rounded-md text-black dark:text-white">
      <input
        className="p-3 rounded-md dark:bg-gray-800"
        type="text"
        placeholder="Title"
        name="title"
        value={newEntry.title}
        onChange={handleInputChange}
      />
      <textarea
        className="p-3 rounded-md dark:bg-gray-800"
        placeholder="Description"
        name="description"
        value={newEntry.description}
        onChange={handleInputChange}
      />
      <div className="flex flex-col">
        <span>Creation Date:</span>
        <input
          className="p-3 rounded-md dark:bg-gray-800"
          type="date"
          name="created_at"
          value={new Date(newEntry.created_at).toISOString().split("T")[0]}
          onChange={handleInputChange}
        />
      </div>
      <div className="flex flex-col">
        <span>Scheduled Date:</span>
        <input
          className="p-3 rounded-md dark:bg-gray-800"
          type="date"
          name="scheduled_at"
          value={newEntry.scheduled_at ? new Date(newEntry.scheduled_at).toISOString().split("T")[0] : ""}
          onChange={handleInputChange}
        />
      </div>
      <button
        onClick={(e) => {
          handleSend(e);
        }}
        className="bg-blue-400 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-400 font-semibold text-white p-3 rounded-md"
      >
        Update
      </button>
    </section>
  );
}
