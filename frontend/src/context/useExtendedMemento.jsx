//[Imports]
import { useState, useRef, useEffect } from "react";
import { calculateMementoOptions, calculateMementoStats, datesInterval, datesLabel, highlightMemList, predictMementoEnd, predictMementoStartEnd, sortMementos } from "./utils"; //prettier-ignore

export default function useExtendedMemento(defaults, mementos) {
  //[Extra Memento Data]
  const predict = 4; //amount of predictions to display
  const [mementosData, setMementosData] = useState([]);
  let mementoStats = useRef({});
  let mementoOptions = useRef([]);
  const [displayedMementos, setDisplayedMementos] = useState([]);
  const refreshMementosData = () => {
    if (!mementos?.length) return setMementosData([]);
    if (!defaults?.mementoOptions?.length) return setMementosData([]);
    const mementosGroups = mementos.reduce((map, memento) => {
      if (!map[memento.name]) map[memento.name] = [];
      map[memento.name].push(memento);
      return map;
    }, {});

    //[Parse mementos]
    const formattedOptions = calculateMementoOptions(defaults.mementoOptions);
    const mementoEntriesStats = calculateMementoStats(mementosGroups, formattedOptions);
    const mementoDataEntries = [];
    const displayedEntries = [];
    for (const option of formattedOptions) {
      const category = option.category;
      const type = option.group ? category : option.name;
      const stats = mementoEntriesStats[type];
      const names = option.group ? option.name : [option.name];
      const mementosGroup = names.flatMap((name) => mementosGroups[name] || []);
      if (!mementosGroup?.length) continue;

      //[Expand mementos]
      for (const memento of mementosGroup) {
        let end = memento.end;
        let estimateEnd = false;
        let duration = memento.duration < 0 ? datesInterval(memento.start, end) + 1 + (end ? "" : "+") : memento.duration;
        if (!duration) {
          duration = datesInterval(memento.start, end) + 1 + (end ? "" : "+");
          console.log(`Memento missing duration: ${memento.name}, start: ${memento.start}, duration: ${duration}`);
        }
        //predict end
        if (option?.predict && !memento.end && stats) {
          end = predictMementoEnd(memento.start, stats);
          estimateEnd = true;
        }
        if (option?.predict) displayedEntries.push({ name: type, start: memento.start, end: end });
        let expandedMemento = {
          name: memento.name,
          start: memento.start,
          end: !estimateEnd ? end : "",
          duration: duration,
          category: category,
          id: memento.id || memento._id,
        };
        if (option.group) expandedMemento.group = category;
        let label = datesLabel(expandedMemento, estimateEnd);
        mementoDataEntries.push({ ...expandedMemento, label });
      }
      if (!option?.predict || !stats || !stats.averageInterval || !stats.averageDuration) continue;
      //predict extra for predict = true mementos (start&end)
      let last = mementoDataEntries[mementoDataEntries.length - 1];
      last = { start: new Date(last.start), end: new Date(last.end) };
      for (let i = 0; i < predict; i++) {
        last = predictMementoStartEnd(last, option, stats);
        if (!last) break;
        displayedEntries.push({ name: type, start: last.startString, end: last.endString });
        let expandedMemento = { name: type, start: last.startString, end: last.endString, estimated: true, category: category };
        let label = datesLabel(expandedMemento, true, true);
        mementoDataEntries.push({ ...expandedMemento, label });
      }
    }
    mementoOptions.current = formattedOptions;
    mementoStats.current = mementoEntriesStats;
    setMementosData(sortMementos(mementoDataEntries));
    setDisplayedMementos(sortMementos(displayedEntries));
  };
  useEffect(() => {
    refreshMementosData();
  }, [defaults, mementos]);

  return {
    data: mementosData,
    stats: mementoStats.current,
    options: mementoOptions.current,
    colorsMain: (date) => highlightMemList(date, displayedMementos),
  };
}
