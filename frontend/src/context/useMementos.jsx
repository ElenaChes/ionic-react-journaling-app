//[Imports]
import { useState, useEffect } from "react";
import { datesInterval, editDatabaseMemento, sortMementos } from "./utils";

export default function useMementos(mementos, setMementos, mementosData, selectedDate, setToastState) {
  //[Mementos]
  let mementosEntries = {};
  const [selectedMementos, setSelectedMementos] = useState([]);
  const refreshSelectedMementos = () => {
    if (!mementosData?.length) return setSelectedMementos([]);
    if (mementosEntries[selectedDate]) return setSelectedMementos(mementosEntries[selectedDate]);
    mementosEntries[selectedDate] = mementosData.filter(
      (memento) => selectedDate >= memento.start && (selectedDate <= memento.end || !memento.end)
    );
    setSelectedMementos(mementosEntries[selectedDate]);
  };
  useEffect(() => {
    refreshSelectedMementos();
  }, [selectedDate, mementosData]);

  //[Update memento]
  const setMementoDates = async (memento) => {
    const { name, start, end } = memento;
    if (!name) return console.log(`Memento missing name: ${memento}`);
    const duration = end ? datesInterval(start, end) + 1 : -1;
    if (start) memento.duration = duration;
    let id = memento.id || memento._id;
    let mementosList = [...mementos];
    let index;
    //[New memento]
    if (!id) {
      mementosList.push(memento);
      mementosList = sortMementos(mementosList);
      index = mementosList?.findIndex((mem) => mem.name === name && mem.start === start && mem.end === end);
      setToastState(false, "Memento added.");
    } //[Edit memento]
    else if (start) {
      index = mementosList?.findIndex((mem) => mem.id === id || mem._id === id);
      mementosList[index].start = start;
      mementosList[index].end = end;
      mementosList[index].duration = duration;
      setToastState(false, "Memento updated.");
    } //[Delete memento]
    else {
      mementosList = mementosList.filter((mem) => !(mem.name === name && (mem.id === id || mem._id === id)));
      setToastState(false, "Memento deleted.");
    }
    id = await editDatabaseMemento(memento);
    if (id && index >= 0) mementosList[index]._id = id;
    mementosEntries = {};
    setMementos(mementosList);
    refreshSelectedMementos();
    setToastState(true);
  };

  return { mementos: { list: selectedMementos, set: setMementoDates } };
}
