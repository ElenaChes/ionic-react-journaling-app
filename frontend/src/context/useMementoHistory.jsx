//[Imports]
import { useState, useEffect } from "react";
import { highlightMemList } from "./utils";

export default function useMementoHistory(mementosData, mementoStats) {
  //[Mementos history]
  const predict = 1; //how many to predict
  const [selectedMementoType, setSelectedMementoType] = useState(null);
  const [selectedMementoList, setSelectedMementoList] = useState([]);
  const [selectedMementoStats, setSelectedMementoStats] = useState({});
  const [selectedDate, setSelectedDate] = useState(undefined);
  const refreshSelectedMementoList = () => {
    if (!mementosData?.length) {
      setSelectedMementoList([]);
      setSelectedDate(undefined);
      return;
    }
    if (!selectedMementoType || !selectedMementoType?.name) return setSelectedMementoList([]);
    let shownPredicts = 0;
    const filteredMementoList = mementosData?.filter((mem) => {
      const matches = selectedMementoType.group
        ? selectedMementoType.name.includes(mem.name)
        : mem.name === selectedMementoType.name;
      if (!matches) return false; //not matching type
      if (!mem.estimated) return true; //past memento
      return shownPredicts++ < predict; //limit estimated amount
    });
    setSelectedMementoList(filteredMementoList.reverse() || []);
    if (filteredMementoList[0]?.estimated && filteredMementoList[1]) return setSelectedDate(filteredMementoList[1]?.start);
    setSelectedDate(filteredMementoList[0]?.start);
  };
  const refreshSelectedMementoStats = () => {
    if (!mementoStats) return setSelectedMementoStats({});
    if (!selectedMementoType?.name && !selectedMementoType?.category) return setSelectedMementoStats({});
    let stat = selectedMementoType.group ? mementoStats[selectedMementoType.category] : mementoStats[selectedMementoType.name];
    if (!stat) return setSelectedMementoStats({});
    setSelectedMementoStats(stat || {});
  };
  useEffect(() => {
    refreshSelectedMementoList();
  }, [selectedMementoType, mementosData]);

  useEffect(() => {
    refreshSelectedMementoStats();
  }, [selectedMementoType, mementoStats]);

  const setSelectedType = (memento) => {
    if (!memento || !memento.name || (memento.group && !memento.category)) return setSelectedMementoType({});
    return setSelectedMementoType(memento);
  };

  return {
    type: selectedMementoType,
    list: selectedMementoList,
    stats: selectedMementoStats,
    colors: (date) => highlightMemList(date, selectedMementoList),
    set: setSelectedType,
    date: selectedDate,
    setDate: setSelectedDate,
  };
}
