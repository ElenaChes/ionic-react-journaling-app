//[Imports]
import React, { useContext, useState, useRef, useEffect } from "react";
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonDatetime, IonIcon } from "@ionic/react";
import { useIonRouter } from "@ionic/react";
import useCalendar from "../../calendar/useCalendar"; //import custom hook
//[Import visuals]
import { calendar } from "ionicons/icons";
//[Import data]
import { AppContext } from "../../../context/Context";

interface ContainerProps {}

export const CalInfo: React.FC<ContainerProps> = () => {
  const { date, mementoHistory } = useContext<any | undefined>(AppContext);
  const calendarRef = useRef<null | HTMLIonDatetimeElement>(null);
  const { resetMonth, ResetButton } = useCalendar(calendarRef);
  const [hideSelected, setHideSelected] = useState(true);
  let selectedDate = useRef("");
  const router = useIonRouter();

  //[Reset access]
  useEffect(() => {
    if (!mementoHistory) return;
    mementoHistory.resetMonth = resetMonth; //give access to reset
  }, [mementoHistory]);

  //[Navigate to date]
  const viewDate = (e: any) => {
    selectedDate.current = mementoHistory?.date;
    mementoHistory?.setDate(e.target.value);
    setHideSelected(false); //temporarily show selection
  };
  //trick to show selected and navigate after
  useEffect(() => {
    if (hideSelected) return;
    date?.set(mementoHistory?.date);
    router.push("/journal", "back");
    mementoHistory?.setDate(selectedDate.current);
    setHideSelected(true); //hide selection
  }, [hideSelected]);

  //[Memento Calendar Card]
  return (
    <IonCard color="primary" className="container wide">
      {/* Title */}
      <IonCardHeader className="small-card">
        <IonCardTitle>
          Past occurrences <IonIcon className="icon" icon={calendar} />
        </IonCardTitle>
      </IonCardHeader>
      {/* Calendar */}
      <IonCardContent className="calendar">
        <IonDatetime
          size="cover"
          color="medium"
          className={hideSelected ? "calendar-hide" : "calendar-show"}
          presentation="date"
          ref={calendarRef}
          value={mementoHistory?.date}
          highlightedDates={mementoHistory?.colors}
          onIonChange={viewDate}
        />
        {/* Optional Reset Button */}
        <ResetButton resetDate={mementoHistory?.date} />
      </IonCardContent>
    </IonCard>
  );
};

export default CalInfo;
