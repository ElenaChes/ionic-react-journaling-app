const printLogs = false;
//[Imports]
import { useState, useEffect } from "react";
import { editDatabaseEntry, sortEntries, sortEntryContent } from "./utils";

export default function useEntries(defaults, entries, setEntries, refreshSelectedMomentStats, selectedDate, setToastState) {
  const getDefaultMemories = () => {
    const titles = defaults?.memoryTitles?.filter((title) => title.default) || [];
    return titles.map((title) => {
      return { title: title.name, content: "" };
    });
  };

  //[Memories & Moments]
  let entriesIndex = entries?.findIndex((entry) => entry.date === selectedDate);
  const [selectedMemories, setSelectedMemories] = useState([]);
  const [selectedMoments, setSelectedMoments] = useState([]);
  const refreshSelectedEntries = () => {
    if (!entries?.length || !entries[entriesIndex]) {
      setSelectedMemories([]);
      setSelectedMoments([]);
      return;
    }
    setSelectedMemories(entries[entriesIndex].memories);
    setSelectedMoments(entries[entriesIndex].moments);
  };
  useEffect(() => {
    refreshSelectedEntries();
  }, [selectedDate, entries]);

  //[Updating entries]
  let entryCreationLocks = {};
  let entryUpdateQueue = {};
  //new day
  const addEntry = (entriesList, entry, date) => {
    if (!entry) entry = { date: date, moments: [], memories: getDefaultMemories() };
    if (printLogs) console.log(entry);
    entriesList.push(entry);
    entriesList = sortEntries(entriesList);
    if (date !== selectedDate) return;
    entriesIndex = entriesList.findIndex((e) => e.date === selectedDate);
  };
  //find day entry
  const fetchEntry = (date) => {
    date = date || selectedDate;
    let entriesList = [...entries];
    let index = entriesList.findIndex((e) => e.date === date);
    //[New entry]
    if (index < 0) {
      addEntry(entriesList, null, date);
      index = entriesList.findIndex((e) => e.date === date);
      if (index < 0) return null; //failsafe
    }
    return entriesList[index];
  };
  //queue entry update
  const updateEntry = (setChanges, date) => {
    date = date || selectedDate;
    //[Fetch entry]
    let entry = entryUpdateQueue[date] || fetchEntry(date);
    if (!entry) return console.log(`Couldn't create an entry for ${date}`);

    //[Handle entry]
    setChanges(entry); //apply changes
    entry = sortEntryContent(entry, defaults);
    entryUpdateQueue[date] = entry;
    runEntryUpdate(); //try to update
  };
  //update day entry
  const runEntryUpdate = async (date) => {
    date = date || selectedDate;
    //[Avoid race conditions]
    if (entryCreationLocks[date])
      return printLogs ? console.log(`[SKIPPED] Still locked, will use queued data for ${date}`) : null;

    //[Next in queue]
    if (!entryUpdateQueue[date]) return printLogs ? console.log(`[FINISHED] No more queued data for ${date}`) : null;
    const entry = { ...entryUpdateQueue[date] };
    delete entryUpdateQueue[date];

    //[Lock]
    entryCreationLocks[date] = true;
    if (printLogs) console.log(`[LOCKED] Writing to DB for ${date}`);

    //[Update database]
    if (printLogs) console.log(entry);
    let id = await editDatabaseEntry(entry);
    if (id) entry._id = id;

    //[Update local entries]
    let entriesList = [...entries];
    let index = entriesList.findIndex((e) => e.date === date);
    const keepEntry = entry?.moments.length || entry?.memories?.some((memory) => memory.content);
    //Add if missing & has content
    if (keepEntry && index < 0) addEntry(entriesList, entry);
    else {
      //Update
      if (keepEntry) entriesList[index] = entry;
      //Delete (empty entry)
      else {
        id = entry.id || entry._id;
        entriesList = entriesList.filter((ent) => !(ent.date === entry.date && (ent.id === id || ent._id === id)));
        setToastState(false, "Entry cleared.");
      }
    }
    //[Refresh app]
    setEntries(entriesList);
    refreshSelectedEntries();
    refreshSelectedMomentStats();
    setToastState(true);

    //[Reset index in case]
    entriesIndex = entriesList.findIndex((e) => e.date === selectedDate);

    //[Unlock]
    delete entryCreationLocks[date];
    if (printLogs) console.log(`[UNLOCKED] Finished ${date}`);

    //[Check queue]
    if (entryUpdateQueue[date]) {
      if (printLogs) console.log(`[RETRY] More updates found for ${date}, rerunning...`);
      runEntryUpdate();
    } else if (printLogs) console.log(`[DONE] No more updates for ${date}`);
  };

  //[Update memory]
  const setMemoryContent = (title, content, date) => {
    return updateEntry((entry) => {
      if (!entry.memories?.length) entry.memories = getDefaultMemories();//failsafe
      entry.memories = entry.memories.map((ent) => (ent.title === title ? { title: ent.title, content: content } : ent));
    }, date);
  };
  //[Update moment]
  const setMomentState = (name, state, date) => {
    return updateEntry((entry) => {
      if (state && !entry.moments.includes(name)) entry.moments.push(name);
      else if (entry.moments.includes(name)) entry.moments = entry.moments.filter((moment) => moment !== name);
    }, date);
  };

  //[Format day entry]
  const fetchData = () => {
    const moments = selectedMoments || [];
    let memories = (selectedMemories?.length ? selectedMemories : getDefaultMemories()).map(({ _id, ...memory }) => memory);
    return { date: selectedDate, moments, memories };
  };

  return {
    moments: { list: selectedMoments, set: setMomentState },
    memories: { list: selectedMemories, set: setMemoryContent },
    fetchData,
  };
}
