//[Imports]
import { useRef, useState, useEffect, useCallback } from "react";
import ResetButton from "./ResetButton";
import { getToday } from "../../context/utils";

//[Custom hook for calendars]
export function useCalendar(ref: React.RefObject<null | HTMLIonDatetimeElement>, selectedDate?: string) {
  const handlersRef = useRef<{ prev?: () => void; next?: () => void }>({}); //remove references for later
  let defaultMonth = useRef<number>(0);
  const [currentMonth, setCurrentMonth] = useState<number>(0);
  const [hideReset, setHideReset] = useState(true);
  let today = getToday();

  //get month from string
  const getMonth = (date: string) => parseInt(date.split("-")[1], 10);
  //show reset button if current month isn't default month OR selected date isn't today
  const refreshHide = () => setHideReset(currentMonth === defaultMonth.current && (selectedDate === today || !selectedDate));

  //[Update on new selected date]
  useEffect(() => {
    const selectedMonth = selectedDate ? getMonth(selectedDate) : getMonth(today);
    defaultMonth.current = selectedMonth; //update default
    //update current month based on date
    if (selectedMonth !== currentMonth) setCurrentMonth(selectedMonth);
    else refreshHide();
  }, [selectedDate]);

  //[Update on new current month]
  useEffect(() => {
    refreshHide();
  }, [currentMonth]);

  //[Update on next/prev button click]
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    //store the handlers so we can remove them later
    const prevClick = () => setCurrentMonth((m) => (m + 11) % 12); //-1 month with wrap
    const nextClick = () => setCurrentMonth((m) => (m + 1) % 12); //+1 month with wrap

    //[Add listeners]
    const attachListeners = () => {
      const root = el.shadowRoot;
      if (!root) return false;

      const buttons = root.querySelectorAll("ion-button");
      if (buttons.length < 2) return false;

      //[Listeners]
      const prevButton = buttons[0] as HTMLElement;
      const nextButton = buttons[1] as HTMLElement;
      prevButton.addEventListener("click", prevClick);
      nextButton.addEventListener("click", nextClick);

      //[Remove references for later]
      handlersRef.current.prev = () => prevButton.removeEventListener("click", prevClick);
      handlersRef.current.next = () => nextButton.removeEventListener("click", nextClick);

      return true;
    };

    //[Try to attach]
    if (attachListeners())
      return () => {
        handlersRef.current.prev?.();
        handlersRef.current.next?.();
      };

    //[Couldn't attach]
    const root = el.shadowRoot;
    if (!root) return;
    const observer = new MutationObserver(() => {
      if (attachListeners()) observer.disconnect();
    });
    observer.observe(root, { childList: true, subtree: true });

    //[Clear listeners]
    return () => {
      observer.disconnect();
      handlersRef.current.prev?.();
      handlersRef.current.next?.();
    };
  }, [ref]);

  //[Switch back to default month]
  const resetMonth = (inputDate?: string) => {
    const date = inputDate ?? today;
    if (ref.current) ref.current.value = date + "T00:00:00";
    const month = getMonth(date);
    if (inputDate) defaultMonth.current = month; //update default
    setCurrentMonth(month);
  };

  //[Optional reset button]
  const CalendarResetButton = useCallback(
    ({ resetFunc, resetDate, className }: { resetFunc?: (date?: string) => void; resetDate?: string; className?: string }) => {
      const onReset = resetFunc ?? resetMonth; //resetF fucntion
      return <ResetButton hideReset={hideReset} onReset={onReset} resetDate={resetDate} className={className} />;
    },
    [hideReset, resetMonth]
  );

  return { hideReset, resetMonth, ResetButton: CalendarResetButton };
}

export default useCalendar;
