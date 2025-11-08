//[Imports]
import { useState, useRef, useEffect } from "react";
import { datesInterval } from "./utils";

export default function useMomentHistory(momentsData) {
  //[Moments history]
  let momentStats = useRef({});
  const defaultStats = { lastDate: "n/a", completePercentage: 0 };
  const [selectedMomentType, setSelectedMomentType] = useState(null);
  const [selectedMomentList, setSelectedMomentList] = useState([]);
  const [selectedMomentStats, setSelectedMomentStats] = useState(defaultStats);
  const refreshSelectedMomentList = () => {
    if (!momentsData?.length || !selectedMomentType?.name) {
      setSelectedMomentList([]);
      setSelectedMomentStats(defaultStats);
      return;
    }
    const index = momentsData.findIndex((entry) =>
      entry.moments.some((moment) => moment.name === selectedMomentType.name && moment.completed)
    );
    if (index < 0) {
      setSelectedMomentList([]);
      setSelectedMomentStats(defaultStats);
      return;
    }
    const slicedMomentList = [...momentsData].slice(index);
    const parsedMomentList =
      slicedMomentList.flatMap((entry) =>
        entry.moments
          .filter((moment) => moment.name === selectedMomentType.name)
          .map((moment) => ({
            date: entry.date,
            due: moment.due,
            completed: moment.completed,
          }))
      ) || [];

    setSelectedMomentList(parsedMomentList);

    //[Calculate stats]
    if (!momentStats.current[selectedMomentType.name]) {
      const lastCompleted = parsedMomentList.findLast((moment) => moment.completed);
      const lastDate = lastCompleted
        ? (() => {
            const interval = datesInterval(lastCompleted.date);
            return interval > 1 ? interval + " days ago" : interval === 0 ? "Today" : "Yesterday";
          })()
        : "n/a";
      const total = parsedMomentList.length;
      const invalidCount = parsedMomentList.filter((moment) => !moment.completed && moment.due === "due").length;
      const completePercentage = total === 0 ? 0 : Math.round(100 - (invalidCount / total) * 100);
      momentStats.current[selectedMomentType.name] = { lastDate, completePercentage };
    }
    return setSelectedMomentStats(momentStats.current[selectedMomentType.name]);
  };
  useEffect(() => {
    momentStats.current = {};
  }, [momentsData]);

  useEffect(() => {
    refreshSelectedMomentList();
  }, [selectedMomentType, momentsData]);

  const setSelectedType = (moment) => {
    if (!moment || !moment.name) return setSelectedMomentType({});
    return setSelectedMomentType(moment);
  };

  //[Calendar highlighting]
  const options = {
    downlight: { textColor: "var(--ion-custom-gray7)", backgroundColor: "var(--ion-custom-gray1)" },
    midlight: { textColor: "var(--ion-custom-gray7)", backgroundColor: "var(--ion-custom-gray3)" },
    highlight: { textColor: "var(--ion-custom-gray7)", backgroundColor: "var(--ion-custom-gray5)" },
  };
  const highlightMomentList = (date) => {
    date = date.split("T")[0];
    if (!selectedMomentList?.length) return options.downlight;
    //highlight done moments
    if (selectedMomentList.some((moment) => date === moment.date && moment.completed)) return options.highlight;
    //highlight not due
    if (selectedMomentList.some((moment) => date === moment.date && moment.due !== "due")) return options.midlight;
    //default
    return options.downlight;
  };

  return {
    type: selectedMomentType,
    stats: selectedMomentStats,
    colors: highlightMomentList,
    set: setSelectedType,
  };
}
