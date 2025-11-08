//[Imports]
import React, { useContext, useRef } from "react";
import { IonCard, IonCardContent, IonDatetime } from "@ionic/react";
import useCalendar from "../calendar/useCalendar"; //import custom hook
//[Import data]
import { AppContext } from "../../context/Context";
import { getToday } from "../../context/utils";

interface ContainerProps {}

export const Calendar: React.FC<ContainerProps> = () => {
  const { date, mementoHistory } = useContext<any | undefined>(AppContext);
  const calendarRef = useRef<null | HTMLIonDatetimeElement>(null);
  const { resetMonth, ResetButton } = useCalendar(calendarRef, date?.selected); //reset button
  let today = getToday();

  //[Update date]
  const select = (e: any) => date?.set(e.target.value);

  //[Reset to today]
  const reset = () => {
    today = getToday(); //in case midnight passed
    resetMonth(today); //flip to today's month
    date?.set(today); //select today's date
  };

  //[Calendar Card]
  return (
    <IonCard color="primary" className="container wide">
      {/* Calendar */}
      <IonCardContent className="calendar">
        <IonDatetime
          size="cover"
          color="medium"
          presentation="date"
          ref={calendarRef}
          value={date?.selected || today}
          highlightedDates={mementoHistory?.colorsMain}
          onIonChange={select}
        />
        {/* Optional Reset Button */}
        <ResetButton resetFunc={reset} />
      </IonCardContent>
    </IonCard>
  );
};

export default Calendar;
