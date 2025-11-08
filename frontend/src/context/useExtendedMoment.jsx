//[Imports]
import { useState, useEffect } from "react";
import { isMomentDue, calculateMomentStates, calculateMomentStatesUntilDate } from "./utils";
import { getToday, getTomorrow } from "./utils";

export default function useExtendedMoment(defaults, entries, selectedDate) {
  //[Extra Moment Data]
  const [momentsData, setMomentsData] = useState([]);
  const refreshMomentsData = () => {
    if (!entries?.length) return setMomentsData([]);
    if (!defaults?.momentOptions?.length) return setMomentsData([]);

    //[Calculate states (due/not due/could do)]
    const momentStates = calculateMomentStates(defaults.momentOptions);
    const momentDataEntries = [];

    const dayMoments = (date, moments) => {
      return {
        date: date,
        moments: defaults.momentOptions.map((moment) => {
          const completed = moments.includes(moment.name);
          return {
            name: moment.name,
            due: isMomentDue(moment, date, momentStates[moment.name], completed),
            completed: completed,
            order: moment.order,
          };
        }),
      };
    };
    //[Parse moments]
    for (const entry of entries) {
      momentDataEntries.push(dayMoments(entry.date, entry.moments));
    }
    //[Add today]
    const today = getToday();
    if (!momentDataEntries?.find((entry) => entry.date === today)) {
      momentDataEntries.push(dayMoments(today, []));
    }
    //[Add tomorrow]
    const tomorrow = getTomorrow();
    if (!momentDataEntries?.find((entry) => entry.date === tomorrow)) {
      momentDataEntries.push(dayMoments(tomorrow, []));
    }
    setMomentsData(momentDataEntries);
  };
  useEffect(() => {
    refreshMomentsData();
  }, [defaults, entries]);

  //[Selected data]
  const [selectedMomentData, setSelectedMomentStats] = useState([]);
  const refreshSelectedMomentStats = () => {
    if (!defaults?.momentOptions?.length) return setSelectedMomentStats([]);
    let momentsIndex = momentsData?.findIndex((entry) => entry.date === selectedDate);
    if (momentsIndex >= 0) return setSelectedMomentStats(momentsData[momentsIndex].moments);

    const momentStates = calculateMomentStatesUntilDate(defaults.momentOptions, entries, selectedDate);
    const tempMoments = defaults.momentOptions.map((moment) => ({
      name: moment.name,
      due: isMomentDue(moment, selectedDate, momentStates[moment.name], false),
      completed: false,
      order: moment.order,
    }));
    return setSelectedMomentStats(tempMoments);
  };
  useEffect(() => {
    refreshSelectedMomentStats();
  }, [selectedDate, momentsData]);

  return {
    data: momentsData,
    selectedData: selectedMomentData,
    refresh: refreshSelectedMomentStats,
  };
}
