//[Imports]
import { useState, createContext, useEffect, useRef } from "react";
import { loadDatabase, sortDefaults, sortEntries, sortMementos, getToday } from "./utils";
//[Import contexts]
import useEntries from "./useEntries";
import useMementos from "./useMementos";
import useExtendedMoment from "./useExtendedMoment";
import useExtendedMemento from "./useExtendedMemento";
import useMementoHistory from "./useMementoHistory";
import useMomentHistory from "./useMomentHistory";
import useMemoryHistory from "./useMemoryHistory";
import useNotifications from "./useNotifications";

const format = {
  date: {}, //{ selected -> ISOString, set -> func(selected ISOString) }
  //journal page
  moments: {}, //{ list: [ moment object ], data: [ names -> string, due -> bool], set -> func(name, new state) }
  mementos: {}, //{ list: [ memento object ], colors -> func(ISOString), set -> func(name, new state) }
  memories: {}, //{ list: [ memory object ], set -> func(title, content) }
  //history page
  mementoHistory: {}, //{ type -> object, list -> [objects], stats -> object, colors -> func(date, list), set -> func(object), date -> ISOString, setDate -> func(selected ISOString) }
  momentHistory: {}, //{ type -> object, stats -> { lastDate -> ISOString, completePercentage -> number }, stats -> object, colors -> func(date, list), set -> func(object) }
  memoryHistory: {}, //{ term -> string, list -> [objects], set -> func(object), mode -> string, setMode -> func(string) }
  //debug
  fetchData: {}, //{ entry: -> func() }
  //general
  defaults: {
    //defaults object
    momentOptions: [],
    mementoOptions: [],
    memoryTitles: [],
  },
  navigation: {}, //{ history -> string, setHistory -> func(string), content -> scroll ref }
  alerts: {}, //{ display -> bool, text -> string, set -> func(bool, text) }
};

export const AppContext = createContext(format);

export function AppContextProvider({ children }) {
  //[Load Database]
  const [defaults, setDefaults] = useState({});
  const [entries, setEntries] = useState([]);
  const [mementos, setMementos] = useState([]);
  useEffect(() => {
    (async () => {
      const data = await loadDatabase();
      const defaults = sortDefaults(data?.defaults);
      const entries = sortEntries(data?.entries, defaults);
      const mementos = sortMementos(data?.mementos);

      setDefaults(defaults);
      setEntries(entries);
      setMementos(mementos);
    })();
  }, []);

  //[Date]
  const [selectedDate, setSelectedDate] = useState(getToday());
  const setDate = (date) => {
    date = date.split("T")[0];
    if (selectedDate === date) return;
    setSelectedDate(date);
  };
  //[Navigation]
  const [historyTab, setHistoryTab] = useState("moment");
  const historyPage = useRef(null);

  //[Alerts]
  const [displayToast, setDisplayToast] = useState(false);
  const toastText = useRef("");
  const setToastState = (display, text) => {
    setDisplayToast(display);
    if (text !== undefined) toastText.current = text;
  };

  //[Collect context]
  //expanded
  const expMoments = useExtendedMoment(defaults, entries, selectedDate);
  const expMementos = useExtendedMemento(defaults, mementos, setToastState);
  //basic
  const entryCont = useEntries(defaults, entries, setEntries, expMoments.refresh, selectedDate, setToastState);
  const memCont = useMementos(mementos, setMementos, expMementos?.data, selectedDate, setToastState);
  //history
  const mementoHCont = useMementoHistory(expMementos?.data, expMementos?.stats, setToastState);
  const momentHCont = useMomentHistory(expMoments?.data, setToastState);
  const memoryHCont = useMemoryHistory(entries, setToastState);
  //extra
  const setFuncs = { date: setDate, moment: entryCont?.moments?.set };
  useNotifications(defaults, entries, expMoments?.data, expMementos, setFuncs, setToastState);

  return (
    <AppContext.Provider
      value={{
        date: { selected: selectedDate, set: setDate },
        //journal page
        moments: { ...entryCont.moments, data: expMoments.selectedData },
        mementos: memCont.mementos,
        memories: entryCont.memories,
        //history page
        mementoHistory: { ...mementoHCont, options: expMementos.options, colorsMain: expMementos.colorsMain },
        momentHistory: momentHCont,
        memoryHistory: memoryHCont,
        //debug
        fetchData: { entry: entryCont.fetchData },
        //general
        defaults: defaults,
        navigation: { history: historyTab, setHistory: setHistoryTab, content: historyPage },
        alerts: { display: displayToast, text: toastText, set: setToastState },
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
