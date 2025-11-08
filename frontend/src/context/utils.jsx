const printLogs = false;
const testDate = "2025-04-27"; //date to print for
//[Database]
const api_url = import.meta.env.VITE_API;
const api_token = import.meta.env.VITE_TOKEN;
export const loadDatabase = async () => {
  return fetch(api_url + "/api/fetchAll", {
    headers: { Authorization: `Bearer ${api_token}` },
  })
    .then((response) => (response ? response.json() : {}))
    .then((data) => {
      if (printLogs) console.log("loadDatabase");
      if (data?.status !== 200) {
        console.log(`${data.status}: ${data.response}`);
        return {};
      }
      if (printLogs) console.log(data.response);
      return data.response;
    })
    .catch((error) => {
      console.error(error);
      return {};
    });
};
export const editDatabaseEntry = async (entry) => {
  return fetch(api_url + "/api/editEntry", {
    method: "POST",
    headers: { Authorization: `Bearer ${api_token}`, "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  })
    .then((response) => (response ? response.json() : {}))
    .then((data) => {
      if (printLogs) console.log("editDatabaseEntry");
      if (data?.status !== 200) {
        console.log(`${data.status}: ${data.response}`);
        return {};
      }
      if (printLogs) console.log(data.response);
      return data.response;
    })
    .catch((error) => {
      console.error(error);
      return {};
    });
};
export const editDatabaseMemento = async (memento) => {
  return fetch(api_url + "/api/editMemento", {
    method: "POST",
    headers: { Authorization: `Bearer ${api_token}`, "Content-Type": "application/json" },
    body: JSON.stringify(memento),
  })
    .then((response) => (response ? response.json() : {}))
    .then((data) => {
      if (printLogs) console.log("editDatabaseMemento");
      if (data?.status !== 200) {
        console.log(`${data.status}: ${data.response}`);
        return {};
      }
      if (printLogs) console.log(data.response);
      return data.response;
    })
    .catch((error) => {
      console.error(error);
      return {};
    });
};

//[Sort]
export const sortDefaults = (defaultLists) => {
  if (!defaultLists) return {};
  const sortByOrder = (list = []) => list.slice().sort((a, b) => a.order - b.order);

  return {
    ...defaultLists,
    momentOptions: sortByOrder(defaultLists.momentOptions),
    mementoOptions: sortByOrder(defaultLists.mementoOptions),
    memoryTitles: sortByOrder(defaultLists.memoryTitles),
  };
};
export const sortEntries = (entriesList = [], defaultLists) => {
  if (defaultLists) entriesList = entriesList.map((entry) => sortEntryContent(entry, defaultLists));
  return entriesList.sort((a, b) => a.date.localeCompare(b.date));
};
export const sortEntryContent = (entry, defaultLists) => {
  const { momentOptions, memoryTitles } = defaultLists;
  if (!momentOptions || !memoryTitles) return entry;
  //[Sort moments]
  const momentsOrder = Object.fromEntries(momentOptions.map((moment) => [moment.name, moment.order + 1]));
  entry.moments = entry.moments.sort((a, b) => {
    if (momentsOrder[a] && momentsOrder[b]) return momentsOrder[a] - momentsOrder[b];
    if (momentsOrder[a]) return -1;
    if (momentsOrder[b]) return 1;
    return a.localeCompare(b);
  });
  //[Sort memories]
  const memoriesOrder = Object.fromEntries(memoryTitles.map((memory) => [memory.name, memory.order + 1]));
  entry.memories = entry.memories.sort((a, b) => {
    if (memoriesOrder[a.title] && memoriesOrder[b.title]) return memoriesOrder[a.title] - memoriesOrder[b.title];
    if (memoriesOrder[a.title]) return -1;
    if (memoriesOrder[b.title]) return 1;
    return a.title.localeCompare(b.title);
  });
  return entry;
};
export const sortMementos = (mementoList = []) => {
  return mementoList.sort((a, b) => a.start.localeCompare(b.start));
};

//[Date]
const isDate = (date) => date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
export const dayLength = 1000 * 60 * 60 * 24;
export const getToday = () => new Date().toISOString().split("T")[0];
export const getTomorrow = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().split("T")[0];
};
export const formatDate = (date) => date?.split("-").reverse().join(".") || "";
export const dateInRange = (date, start, end, timestamp) => date >= start && (timestamp ? timestamp <= end : date <= end);
export const datesInterval = (start, end) => {
  const startDate = isDate(start) ? start : new Date(start);
  const endDate = end ? (isDate(end) ? end : new Date(end)) : new Date();
  if (!startDate || !endDate) return -1;
  return Math.floor((endDate.getTime() - startDate.getTime()) / dayLength);
};
export const makeDate = (date) => {
  if (!date) return "??";
  const d = date instanceof Date ? date : new Date(date); //fix: ensure it's a Date
  const dateString = d.toLocaleDateString();
  const timeString = d.toTimeString()?.slice(0, 5);
  return `${dateString}, ${timeString}`;
};

//[Moments]
export const calculateMomentStates = (momentOptions) => {
  const states = {};
  for (const moment of momentOptions) {
    states[moment.name] = { lastCompletedDate: null, spanCompletedCount: 0, spanStart: null };
  }
  return states;
};
export const calculateMomentStatesUntilDate = (momentOptions, entries, end) => {
  const states = calculateMomentStates(momentOptions);
  for (const entry of entries) {
    if (entry.date > end) break;
    for (const moment of momentOptions) {
      isMomentDue(moment, entry.date, states[moment.name], entry.moments.includes(moment.name));
    }
  }
  return states;
};
const getStartOfSpan = (span, date) => {
  let startOfSpan = date; //span = "day"
  if (span === "week") startOfSpan = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 1);
  else if (span === "month") startOfSpan = new Date(date.getFullYear(), date.getMonth(), 1 + 1);

  return startOfSpan.toISOString().split("T")[0];
};
const spanInDays = { day: 1, week: 7, month: 30 };
export const isMomentDue = (moment, stringDate, state, completed) => {
  const { name, quota, frequency, span } = moment;
  const date = new Date(stringDate);

  const log = (msg) => {
    if (printLogs && stringDate === testDate) console.log(`${name} ${msg}`);
  };

  //Quota: "[frequency] times per [span]"
  if (quota) {
    const startOfSpan = getStartOfSpan(span, date);
    //count times done since start of quota
    if (!state.spanStart || state.spanStart !== startOfSpan) {
      state.spanStart = startOfSpan;
      state.spanCompletedCount = 0;
    }
    if (completed) {
      state.spanCompletedCount++;
      log(`quota ${state.spanCompletedCount} times out of ${frequency} : not_due`);
      return "not_due";
    }
    //Calculate "days left" in the span
    const daysPassed = datesInterval(startOfSpan, date);
    const daysLeft = (spanInDays[span] ?? 7) - daysPassed;
    const completionsLeft = Math.max(frequency - state.spanCompletedCount, 0);

    let due = completionsLeft <= 0 ? "not_due" : completionsLeft >= daysLeft ? "due" : "could_do";
    log(`quota ${completionsLeft} <= 0 | ${completionsLeft} >= ${daysLeft} : ${due}`);
    return due;
  }

  //Interval: "every [frequency] [span]s"
  if (completed) {
    state.lastCompletedDate = stringDate;
    log(`interval 0 >= n : not_due`);
    return "not_due";
  }
  if (!state.lastCompletedDate) {
    log(`interval m >= n -> due`);
    return "due";
  }
  //check days since last done
  const actualInterval = datesInterval(state.lastCompletedDate, date);
  const expectedInterval = frequency * (spanInDays[span] ?? 1);
  let due = actualInterval >= expectedInterval ? "due" : "not_due";
  log(`interval ${actualInterval} >= ${expectedInterval} : ${due}`);
  return due;
};

//[Memory]
export const parseMarkdown = (text) => {
  if (!text) return "";
  return applySwapRules(text, true); //parse everything
};
export const unparseMarkdown = (text) => {
  if (!text) return "";
  return applySwapRules(text, false); //unparse everything
};
const swapRules = [
  { reg: /^@\s/, plain: "-", parsed: "•", spaceAfter: true }, // - at start → •
  { reg: /^@+$/, plain: "---", parsed: "⎯⎯⎯⎯⎯⎯⎯⎯⎯" }, // --- full line → ⎯⎯⎯⎯⎯⎯⎯⎯⎯
  { reg: /@/g, plain: "[ ]", parsed: "☐" }, // [ ] → ☐
  { reg: /@/g, plain: "[x]", parsed: "☒" }, // [x]  → ☒
  { reg: /\s@$/, plain: "V", parsed: "✓", spaceBefore: true }, // V at end → ✓
  { reg: /\s@$/, plain: "X", parsed: "✗", spaceBefore: true }, // X at end → ✗
];
const compiledRules = swapRules.map(({ reg, plain, parsed, spaceAfter, spaceBefore }) => {
  const safeParse = parsed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); //escape special regex chars
  const parseReg = new RegExp(reg.source.replace(/@/g, safeParse), reg.flags);

  const safePlain = plain.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); //escape special regex chars
  const plainReg = new RegExp(reg.source.replace(/@/g, safePlain), reg.flags);

  const after = spaceAfter ? " " : "";
  const before = spaceBefore ? " " : "";
  return {
    parse: { reg: plainReg, symbol: before + parsed + after },
    unparse: { reg: parseReg, symbol: before + plain + after },
  };
});
const applySwapRules = (text, plainToParsed) => {
  return text
    .split("\n")
    .map((line) => {
      compiledRules.forEach(({ parse, unparse }) => {
        line = line.replace(plainToParsed ? parse.reg : unparse.reg, plainToParsed ? parse.symbol : unparse.symbol);
      });
      return line;
    })
    .join("\n");
};

//[Memento]
export const calculateMementoOptions = (mementoOptions) => {
  const formattedOptions = [];
  for (const option of mementoOptions) {
    if (option.group) {
      let formattedOption = formattedOptions.find((mem) => mem.category === option.category);
      if (!formattedOption)
        formattedOptions.push({
          ...option,
          name: [option.name],
          label: option.category,
          selectedText: option.category + " (grouped)",
        });
      else formattedOption.name.push(option.name);
    } else if (!formattedOptions.some((opt) => opt.name === option.name))
      formattedOptions.push({
        ...option,
        label: option.category ? `${option.name} (${option.category})` : option.name,
        selectedText: option.name,
      });
  }
  return formattedOptions.sort((a, b) => a.order - b.order);
};
const averageSize = 10;
export const calculateMementoStats = (mementosGroups, mementoOptions) => {
  const stats = {};
  for (const option of mementoOptions) {
    //handle grouped mementos
    const type = option.group ? option.category : option.name;
    if (stats[type]) continue;
    let mementos = [];
    if (option.group) {
      option.name.forEach((subType) => {
        if (mementosGroups[subType]) mementos.push(...mementosGroups[subType]);
      });
      mementos = sortMementos(mementos);
    } else mementos = mementosGroups[type];

    //no occurrences
    if (!mementos?.length) {
      stats[type] = { name: type, averageDuration: "n/a", averageInterval: "n/a", total: 0 };
      continue;
    }
    //last [averageSize] elements
    const fullLength = mementos.length;
    mementos = mementos.map((memento) => {
      if (!memento.end || memento.duration >= 0) return memento;
      return { ...memento, duration: datesInterval(memento.start, memento.end) + 1 };
    });
    mementos = mementos.filter(({ end, duration }) => end && duration >= 0);
    if (mementos.length > averageSize) mementos = mementos.slice(-1 * averageSize);
    //averages
    let length = mementos.length;
    let durations = mementos.reduce((total, mem) => total + mem.duration, 0);
    let intervals = 0;
    for (let i = 1; i < length; i++) {
      const interval = option?.intervalFromStart
        ? datesInterval(mementos[i - 1].start, mementos[i].start)
        : datesInterval(mementos[i - 1].end, mementos[i].start);
      intervals += interval;
    }
    stats[type] = {
      name: type,
      averageDuration: Math.round(durations / length),
      averageInterval: Math.round(intervals / (length - 1)),
      total: fullLength || 0,
    };
  }
  return stats;
};
export const datesLabel = (memento, estimateEnd, estimateStart) => {
  const start = formatDate(memento.start);
  const end = memento.end || estimateEnd ? formatDate(memento.end) : "ongoing";
  if (estimateStart && estimateEnd) return { dates: "Estimated next: " + start + " - " + end };
  const plural = memento.duration > 1 ? "s" : "";
  const dates = start + " - " + (!memento.end || estimateEnd ? "ongoing" : end);
  const days = `(${memento.duration} day${plural})`;
  return { dates, days };
};
export const predictMementoEnd = (start, stats) => {
  if (!stats || !stats.averageDuration) return "";
  let predictEnd = isDate(start) ? new Date(start.getTime()) : new Date(start);
  predictEnd.setDate(predictEnd.getDate() + stats.averageDuration - 1);
  return predictEnd.toISOString().split("T")[0];
};
export const predictMementoStartEnd = (last, option, stats) => {
  if (!stats || !stats.averageInterval || !stats.averageDuration) return null;
  let start = option.intervalFromStart ? last.start : last.end;
  start.setDate(start.getDate() + stats.averageInterval);
  let end = new Date(start.getTime());
  end.setDate(start.getDate() + stats.averageDuration - 1);
  let startString = start.toISOString().split("T")[0];
  let endString = end.toISOString().split("T")[0];
  return { start, end, startString, endString };
};
const modalOptions = {
  downlight: { textColor: "var(--ion-custom-gray5)", backgroundColor: "var(--ion-custom-gray1)" },
  midlight: { textColor: "var(--ion-custom-gray7)", backgroundColor: "var(--ion-custom-gray4)" },
  highlight: { textColor: "var(--ion-custom-gray1)", backgroundColor: "var(--ion-custom-gray6)" },
};
export const highlightedMemModal = (date, start, end) => {
  if (!start) return modalOptions.downlight;
  //range ends
  if (date === start || date === end) return modalOptions.highlight;
  //outside range
  if (date < start || (end && date > end)) return modalOptions.downlight;
  //inside range
  if (date >= start && (!end || date <= end)) return modalOptions.midlight;
  //default
  return modalOptions.downlight;
};
const mainOptions = {
  downlight: { textColor: "var(--ion-custom-gray7)", backgroundColor: "var(--ion-custom-gray1)" },
  midlight: { textColor: "var(--ion-custom-gray7)", backgroundColor: "var(--ion-custom-gray3)" },
  highlight: { textColor: "var(--ion-custom-gray7)", backgroundColor: "var(--ion-custom-gray4)" },
};
export const highlightMemList = (date, mementos) => {
  if (!mementos?.length) return mainOptions.downlight;
  const timestamp = new Date(date).getTime();
  const currentTime = Date.now();
  if (
    mementos.some(
      (memento) =>
        (memento.end && dateInRange(date, memento.start, memento.end)) ||
        (!memento.end && dateInRange(date, memento.start, currentTime, timestamp))
    )
  ) {
    //highlight past mementos
    if (timestamp < currentTime) return mainOptions.highlight;
    //highlight prediction
    return mainOptions.midlight;
  }

  //default
  return mainOptions.downlight;
};
