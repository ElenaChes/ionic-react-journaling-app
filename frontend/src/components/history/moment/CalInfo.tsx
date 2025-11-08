//[Imports]
import React, { useContext, useRef } from "react";
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonDatetime, IonIcon } from "@ionic/react";
import { useIonRouter } from "@ionic/react";
import useCalendar from "../../calendar/useCalendar"; //import custom hook
//[Import visuals]
import { calendar } from "ionicons/icons";
//[Import data]
import { AppContext } from "../../../context/Context";

interface ContainerProps {}

export const CalInfo: React.FC<ContainerProps> = () => {
  const { date, momentHistory } = useContext<any | undefined>(AppContext);
  const calendarRef = useRef<null | HTMLIonDatetimeElement>(null);
  const { ResetButton } = useCalendar(calendarRef);
  const router = useIonRouter();

  //[Navigate to date]
  const viewDate = (e: any) => {
    date?.set(e.target.value);
    router.push("/journal", "back");
  };

  //[Moment Calendar Card]
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
          presentation="date"
          ref={calendarRef}
          value={undefined}
          highlightedDates={momentHistory?.colors}
          onIonChange={viewDate}
        />
        {/* Optional Reset Button */}
        <ResetButton />
      </IonCardContent>
    </IonCard>
  );
};

export default CalInfo;
