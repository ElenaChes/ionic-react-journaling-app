const printLogs = false;
const testNotif = false;
const defaultTestTime = { today: "2025-11-08", time: "16:00" };
//[Imports]
import { useEffect, useRef } from "react";
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import { LocalNotifications } from "@capacitor/local-notifications";
import { formatDate, makeDate, getToday, getTomorrow } from "./utils";

export default function useNotifications(defaults, entries, momentsData, mementos, set, setToastState) {
  const today = getToday();
  const tomorrow = getTomorrow();
  const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
  const formatIsoString = (date, time) => `${date}T${time}:00`;

  //[Create notifications]
  let notifications = [];
  //[Notifications per moment/memory/memento]
  const formatNotifs = async () => {
    const mementoReminder = defaults?.notifOptions?.mementoReminder;
    //if (!mementoReminder) return;
    const todayMoments = momentsData?.find((entry) => entry.date === today)?.moments;
    const tomorrowMoments = momentsData?.find((entry) => entry.date === tomorrow)?.moments;
    if (!todayMoments || !tomorrowMoments) return;

    const todayMemories = entries?.find((entry) => entry.date === today)?.memories;
    const tomorrowMemories = entries?.find((entry) => entry.date === tomorrow)?.memories;
    const todayMementos = mementos.data.filter((memento) => today >= memento.start && !memento.end);
    const tomorrowMementos = mementos.data.filter((memento) => tomorrow >= memento.start && !memento.end);

    let notifs = [];
    const momentBody = "Took a moment to @ today?";
    const mementoTitle = "Is memento @ still ongoing?";
    const mementoBody = "(it's been @ days)";

    if (printLogs) console.log("Moments=====================================");
    const checkScheduleMoment = (day, time, option, moment, action) => {
      const date = formatIsoString(day, time);
      if (moment.due === "not_due") {
        if (printLogs) console.log("Not due:", moment.name, makeDate(date));
        return null;
      }
      if (printLogs) console.log("Reminder:", option.name, makeDate(date));
      return {
        id: strToInt((option.id || option._id || "1" + option.order) + day.slice(-2)),
        title: option.name,
        body: momentBody.replace("@", action || option.name),
        schedule: { at: new Date(date) },
        actionTypeId: "momentActions", //yes/no buttons
        extra: { type: "moment", name: option.name, date: day },
        ongoing: true,
      };
    };
    for (const option of defaults.momentOptions) {
      if (!option.reminder) {
        if (printLogs) console.log("No reminder:", option.name);
        continue;
      }
      let { time, action } = option.reminder;
      if (!time || !timeRegex.test(time)) {
        if (printLogs) console.log("Invalid reminder:", option.name, time);
        continue;
      }
      let moment = todayMoments?.find((mom) => mom.name == option.name);
      let data = checkScheduleMoment(today, time, option, moment, action);
      if (data) notifs.push(data);
      moment = tomorrowMoments?.find((mom) => mom.name == option.name);
      data = checkScheduleMoment(tomorrow, time, option, moment, action);
      if (data) notifs.push(data);
    }

    if (printLogs) console.log("Memory=====================================");
    const checkScheduleMemory = (day, time, option, memory, action) => {
      const date = formatIsoString(day, time);
      if (memory?.content) {
        if (printLogs) console.log("Done:", option.name, makeDate(date));
        return null;
      }
      if (printLogs) console.log("Reminder:", option.name, makeDate(date));
      return {
        id: strToInt((option.id || option._id || "2" + option.order) + day.slice(-2)),
        title: action || option.name,
        body: "Let's record that memory...",
        schedule: { at: new Date(date) },
        actionTypeId: "", //no buttons
        extra: { type: "memory", name: option.name, date: day },
        ongoing: true,
      };
    };
    for (const option of defaults.memoryTitles) {
      if (!option.reminder) {
        if (printLogs) console.log("No reminder:", option.name);
        continue;
      }
      let { time, action } = option.reminder;
      if (!time || !timeRegex.test(time)) {
        if (printLogs) console.log("Invalid reminder:", option.name);
        continue;
      }
      let memory = todayMemories?.find((mem) => mem.title == option.name);
      let data = checkScheduleMemory(today, time, option, memory, action);
      if (data) notifs.push(data);
      memory = tomorrowMemories?.find((mem) => mem.title == option.name);
      data = checkScheduleMemory(tomorrow, time, option, memory, action);
      if (data) notifs.push(data);
    }

    if (printLogs) console.log("Mementos=====================================");
    if (!mementoReminder || !timeRegex.test(mementoReminder)) {
      if (printLogs) console.log("Invalid mementos time:", mementoReminder);
      notifications = notifs;
      return;
    }
    const checkScheduleMemento = (day, time, memento, duration) => {
      const date = formatIsoString(day, time);
      const mementoStat = mementos.stats?.[memento.group || memento.name];
      if (duration <= mementoStat?.averageDuration) {
        if (printLogs) console.log("Not over:", memento.name, makeDate(date));
        return null;
      }
      if (printLogs) console.log("Reminder:", memento.name, makeDate(date));
      return {
        id: strToInt((memento.id || memento._id) + day.slice(-2)),
        title: mementoTitle.replace("@", `'${memento.name}'`),
        body: mementoBody.replace("@", duration),
        schedule: { at: new Date(date) },
        actionTypeId: "", //no buttons
        extra: { type: "memento", name: memento.name, date: day },
        ongoing: false, //can be swiped
      };
    };
    for (const memento of todayMementos) {
      const duration = +memento.duration.split("+")[0];
      let data = checkScheduleMemento(today, mementoReminder, memento, duration);
      if (data) notifs.push(data);
    }
    for (const memento of tomorrowMementos) {
      const duration = +memento.duration.split("+")[0] + 1;
      let data = checkScheduleMemento(tomorrow, mementoReminder, memento, duration);
      if (data) notifs.push(data);
    }

    if (testNotif) notifs = addTestNotif(notifs); //add test notif
    notifications = notifs;
    if (printLogs) {
      console.log(notifications.map((notif) => `- ${makeDate(notif.schedule?.at)} **${notif.title}** ${notif.body}`).join("\n"));
    }
    await setupNotifs();
  };
  //[Plain pereodic notifications]
  const formatNotifsSimple = async () => {
    let notifs = [];
    const times = defaults?.notifOptions?.simpleNotifs;
    if (!times?.length) return;
    const notifLen = times.length;
    const simpleTitle = "How is today going?";
    const simpleBody = "Lets record some memories...";

    const createSimple = (day, time, index) => {
      const date = formatIsoString(day, time);
      if (printLogs) console.log("Simplified notif:", makeDate(date), strToInt(index + day.slice(-2)));
      return {
        id: strToInt(index + day.slice(-2)),
        title: simpleTitle,
        body: simpleBody,
        schedule: { at: new Date(date) },
        actionTypeId: "", //no buttons
        extra: { type: "simple", name: "Simplified", date: day },
        ongoing: index >= notifLen, //can be swiped?
      };
    };

    for (const [index, time] of times.entries()) {
      if (!timeRegex.test(time)) continue;
      let data = createSimple(today, time, index + 1);
      if (data) notifs.push(data);
      data = createSimple(tomorrow, time, index + 1);
      if (data) notifs.push(data);
    }
    if (testNotif) notifs = addTestNotif(notifs);
    notifications = notifs;
    if (printLogs) {
      console.log(notifications.map((notif) => `- ${makeDate(notif.schedule?.at)} **${notif.title}** ${notif.body}`).join("\n"));
    }
    await setupNotifs();
  };
  //[Test notification]
  const addTestNotif = (notifs, today = defaultTestTime.today, time = defaultTestTime.time) => {
    const testTime = formatIsoString(today, time);
    if (printLogs) console.log("Test:", makeDate(testTime), strToInt(0 + today.slice(-2)));
    notifs.push({
      id: strToInt(0 + today.slice(-2)),
      title: "Test title",
      body: "Is this a test?",
      schedule: { at: new Date(testTime) },
      actionTypeId: "", //no buttons
      extra: { type: "simple", name: "Simplified", date: today },
      ongoing: false, //can be swiped
    });
    return notifs;
  };

  const setupNotifs = async () => {
    //[Request permissions]
    let perms = await LocalNotifications.checkPermissions();
    if (perms.display !== "granted") {
      perms = await LocalNotifications.requestPermissions();
      if (perms.display !== "granted") return console.log("Permission not granted");
      if (printLogs) console.log("Permission granted");
    }
    if (printLogs) console.log("Permission check successful");

    //[Filter notifications]
    let pendingNotifs = await LocalNotifications.getPending();
    pendingNotifs = pendingNotifs.notifications || [];
    if (printLogs) console.log("Already pending:", pendingNotifs);
    let cancelNotifs = pendingNotifs.filter((pen) => !notifications.some((notif) => pen.id === notif.id));
    let scheduleNotifs = [];
    const now = new Date();
    for (const notif of notifications) {
      const scheduleTime = notif.schedule?.at;
      if (!scheduleTime) continue;
      let pending = pendingNotifs.find((pen) => pen.id === notif.id);

      if (!pending && notif.extra?.type != "simple") {
        pending = pendingNotifs.find((pen) => {
          if (pen.title !== notif.title) return false;
          if (!pen.schedule?.at) return false;
          const pendingDate = new Date(pen.schedule.at);
          return pendingDate.toDateString() === scheduleTime.toDateString();
        });
      }
      if (pending) {
        //already scheduled
        const pendingTime = new Date(pending.schedule?.at);
        if (pendingTime.getTime() > now.getTime() && pendingTime.getTime() === scheduleTime.getTime()) {
          if (printLogs) console.log("Already scheduled:", notif.title, makeDate(scheduleTime));
          //continue;
        } else {
          //wrong time
          if (printLogs) console.log("Wrong time:", notif.title, scheduleTime, makeDate(pending.schedule.at));
        }
      }
      if (scheduleTime.getTime() > now.getTime()) scheduleNotifs.push(notif);
    }

    if (printLogs) console.log("Cancel:", cancelNotifs);
    //[Cancel wrong notifs]
    if (pendingNotifs.length)
      try {
        await LocalNotifications.cancel({ notifications: pendingNotifs });
      } catch (error) {
        console.error(error);
      }

    //[Schedule notif array]
    if (printLogs) console.log("Schedule:", scheduleNotifs);
    if (scheduleNotifs.length === 0) return;
    scheduleNotifs = scheduleNotifs.filter((value, index, self) => self.findIndex((v) => v.id === value.id) === index);
    if (printLogs) console.log("Filtered:", scheduleNotifs);
    //setToastState(false, `Scheduled ${scheduleNotifs.length} new notifs.`);
    try {
      await LocalNotifications.schedule({ notifications: scheduleNotifs });
      const newPending = await LocalNotifications.getPending();
      if (printLogs)
        console.log(
          `Pending after schedule:\n${newPending?.notifications
            .map((notif) => `- ${makeDate(notif.schedule.at)} **${notif.title}** ${notif.body} | ${notif.id}`)
            .join("\n")} `
        );
      //setToastState(true);
    } catch (error) {
      console.error(error);
    }
  };

  const dataLoaded = () => momentsData?.length && entries?.length && mementos?.data && mementos?.stats;
  useEffect(() => {
    if (!dataLoaded()) return;
    if (defaults?.notifOptions?.useSimple) formatNotifsSimple();
    else formatNotifs();
  }, [defaults, momentsData, entries, mementos?.data, mementos?.stats]);

  //[Responses]
  const notifMomentResponses = useRef([]);
  const handleResponse = async (event) => {
    const { notification, actionId } = event;
    if (printLogs) console.log("Notification tapped:", notification, actionId);
    if (!notification) return;
    const { type, name, date } = notification.extra || {};
    if (type !== "moment" || actionId !== "yes" || !name || !date) return;

    //[Moment tapped]
    set.moment(name, true, date);
    setToastState(true, `${name}: Done. ${formatDate(date)}`);

    if (set.date) set.date(date);
  };
  useEffect(() => {
    if (!entries?.length) return;
    if (!notifMomentResponses?.current?.length) return;
    const responses = notifMomentResponses?.current || [];
    notifMomentResponses.current = [];
    for (const res of responses) handleResponse(res);
  }, [entries, set]);

  //[Listeners]
  const notifListener = useRef(null);
  const appListener = useRef(null);

  //[Notification tap listener]
  const regNotifListener = async () => {
    //register Yes/No buttons
    if (Capacitor.getPlatform() !== "web") {
      await LocalNotifications.registerActionTypes({
        types: [
          {
            id: "momentActions",
            actions: [
              { id: "yes", title: "Yes" },
              { id: "no", title: "No" }, //tapping "no" does nothing => testing, maybe not needed
            ],
          },
        ],
      });
      if (printLogs) console.log("Notification action types registered.");
    }

    //already has listener
    if (notifListener.current) return;

    //add notification tap listener
    notifListener.current = await LocalNotifications.addListener("localNotificationActionPerformed", async (event) => {
      const { notification, actionId } = event;
      console.log("Notification tapped:", notification, actionId);
      if (!notification) return;
      const { type, name, date } = notification.extra || {};
      //prettier-ignore
      switch (type) {
        //[Moment tapped]
        case "moment":
          if (!name || !date) break;
          if (actionId === "yes") {
            if (!entries?.length) notifMomentResponses.current = [...notifMomentResponses.current, { notification, actionId }];
            else handleResponse({ notification, actionId });
          } else if (actionId === "no") {
            setToastState(false, `${name}: Not done. ${formatDate(date)}`);
          }
          break;
        //[Memory tapped]
        case "memory":
        //[Memento tapped]
        case "memento":
        //[Default]
        case "simple":setToastState(true, `♡`);
        default: if (set.date && date) set.date(date);
          break;
      }
    });
  };
  //[App open listener]
  const regAppListener = async () => {
    //already has listener
    if (appListener.current) return;

    //we're on web
    if (Capacitor.getPlatform() === "web") return;

    //add app open listener
    appListener.current = await App.addListener("appStateChange", ({ isActive }) => {
      if (isActive) {
        console.log("App resumed → refresh notifications");
        formatNotifs();
      }
    });
  };
  useEffect(() => {
    //[Notification tap listener]
    try {
      regNotifListener();
    } catch (error) {
      console.error(error);
    }

    //[App open listener]
    try {
      regAppListener();
    } catch (error) {
      console.error(error);
    }

    //[Remove listeners]
    const safeRemove = (listenerRef) => {
      try {
        if (!listenerRef || typeof listenerRef.remove !== "function") return;
        listenerRef.remove();
      } catch (err) {
        console.log("Error removing listener:", err);
      }
    };
    return () => {
      safeRemove(notifListener.current);
      safeRemove(appListener.current);
      notifListener.current = null;
      appListener.current = null;
    };
  }, []);

  return {};
}

const strToInt = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0; //force 32-bit signed int
  }
  return Math.abs(hash);
};
