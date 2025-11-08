//[Imports]
import React, { useContext, useEffect } from "react";
import { IonCol, IonContent, IonGrid, IonHeader, IonPage, IonRow } from "@ionic/react";
import { useIonToast } from "@ionic/react";
//[Import components]
import Calendar from "../components/journal/Calendar";
import Moments from "../components/journal/Moments";
import Memory from "../components/journal/Memory";
import Mementos from "../components/journal/Mementos";
//[Import data]
import { AppContext } from "../context/Context";
import { formatDate } from "../context/utils";

const Journal: React.FC = () => {
  const { date, memories, alerts } = useContext<any | undefined>(AppContext);
  const [present] = useIonToast();
  let dateLabel = formatDate(date?.selected?.split("T")[0]);

  //[Display alerts]
  useEffect(() => {
    if (!alerts) return;
    const { display, text } = alerts || {};
    if (!display || !text?.current) return;
    present({ message: text?.current, duration: 1500, position: "middle", swipeGesture: "vertical" });
    alerts?.set(false, "");
  }, [alerts]);

  //[Journal Page]
  return (
    <IonPage>
      {/* Header - Date */}
      <IonHeader className="page-header">{dateLabel}</IonHeader>
      <IonContent force-overscroll={false}>
        <IonGrid>
          {/* 1st Block - Calendar */}
          <IonRow className="top bottom">
            <Calendar />
          </IonRow>
          {/* 2nd Block - Moments & 3 Memories */}
          <IonRow className="top">
            <IonCol className="left">
              <Moments />
            </IonCol>
            <IonCol className="right">
              <IonRow className="top">
                <Memory index={0} />
              </IonRow>
              <IonRow className="top">
                <Memory index={1} />
              </IonRow>
              <IonRow>
                <Memory index={2} />
              </IonRow>
            </IonCol>
          </IonRow>
          {/* Optional Block - extra Memories */}
          {memories?.list?.length > 3 &&
            memories?.list?.slice(3).map((_: any, index: number) => (
              <IonRow className="top" key={index}>
                <Memory index={3 + index} />
              </IonRow>
            ))}
          {/* 3rd Block - Mementos */}
          <IonRow>
            <IonCol>
              <Mementos />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Journal;
