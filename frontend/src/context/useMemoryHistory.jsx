//[Imports]
import { useState, useEffect } from "react";

export default function useMemoryHistory(entries) {
  //[Memory history]
  const [selectedMemoryTerm, setSelectedMemoryTerm] = useState("");
  const [selectedMemoryList, setSelectedMemoryList] = useState([]);
  const [selectedSearchMode, setSelectedSearchMode] = useState("content");
  const refreshSelectedMemoryList = () => {
    if (!entries?.length) return setSelectedMemoryList([]);
    if (!selectedMemoryTerm) return setSelectedMemoryList([]);
    const termLowerCase = selectedMemoryTerm.toLowerCase();
    const parsedMemoryList =
      entries
        .flatMap((entry) =>
          entry.memories
            .filter((memory) => {
              switch (selectedSearchMode) {
                case "content":
                  return memory.content.toLowerCase().includes(termLowerCase);
                case "title":
                  return memory.title.toLowerCase().includes(termLowerCase);
                default:
                  return (
                    memory.content.toLowerCase().includes(termLowerCase) || memory.title.toLowerCase().includes(termLowerCase)
                  );
              }
            })
            .map((memory) => ({
              date: entry.date,
              title: memory.title,
              content: memory.content,
            }))
        )
        .reverse() || [];
    setSelectedMemoryList(parsedMemoryList);
  };
  useEffect(() => {
    refreshSelectedMemoryList();
  }, [selectedMemoryTerm, selectedSearchMode, entries]);

  const setSelectedTerm = (term) => {
    if (!term) return setSelectedMemoryTerm("");
    return setSelectedMemoryTerm(term);
  };
  const setSelectedMode = (mode) => {
    if (!mode) return setSelectedSearchMode("content");
    return setSelectedSearchMode(mode);
  };

  return {
    term: selectedMemoryTerm,
    list: selectedMemoryList,
    set: setSelectedTerm,
    mode: selectedSearchMode,
    setMode: setSelectedMode,
  };
}
