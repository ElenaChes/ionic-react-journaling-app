//[Imports]
import React, { useContext, useState, useEffect } from "react";
import { IonCard, IonButton, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, IonItem, IonLabel, IonList, IonRow } from "@ionic/react"; //prettier-ignore
import { LocalNotifications, PendingLocalNotificationSchema } from "@capacitor/local-notifications";
//[Import visuals]
import { chatbubblesOutline } from "ionicons/icons";
//[Import data]
import { AppContext } from "../../../context/Context";
import { makeDate } from "../../../context/utils";

interface ContainerProps {}

//[Debug notifs page]
export const NotifsDebug: React.FC<ContainerProps> = () => {
  const { alerts } = useContext<any | undefined>(AppContext);
  const [notifs, setNotifs] = useState<PendingLocalNotificationSchema[]>([]);

  //[Refresh list]
  const getList = async () => {
    let pendingNotifs = await LocalNotifications.getPending();
    if (!pendingNotifs?.notifications) return [];
    let pending = pendingNotifs?.notifications?.sort((a: any, b: any) => {
      const timeA = new Date(a?.schedule?.at).getTime();
      const timeB = new Date(b?.schedule?.at).getTime();
      return timeA - timeB;
    });
    setNotifs(pending || []);
    return pending;
  };
  //[Initial]
  useEffect(() => {
    getList();
  }, []);

  //[Reload notifications]
  const refreshList = async () => {
    setNotifs([]);
    let pending = await getList();
    if (!pending?.length) return;
    for (const [index, pen] of pending.entries()) {
      if (!pen?.schedule?.at) continue;
      pending[index].schedule = { at: new Date(pen.schedule.at) };
    }
    console.log("Refreshing notifications", pending);
    await LocalNotifications.cancel({ notifications: pending });
    await LocalNotifications.schedule({ notifications: pending });

    alerts?.set(true, `Refreshed ${pending.length} notifications.`);
    setNotifs(pending || []);
  };

  //[Notifs Debug Card]
  return (
    <IonCard color="primary" className="container top bottom">
      {/* Title */}
      <IonCardHeader>
        <IonCardTitle>
          Notifs Debug <IonIcon className="icon" icon={chatbubblesOutline} />
        </IonCardTitle>
      </IonCardHeader>
      {/* Buttons */}
      <IonCardContent>
        {/* Refresh Notifications */}
        <IonRow>
          <IonButton size="small" className="center" onClick={() => refreshList()}>
            Refresh {notifs?.length || 0}
          </IonButton>
          {/* Current Time */}
          <IonLabel className="small-text center">{makeDate(new Date())}</IonLabel>
        </IonRow>
        {/* Loaded Notifications List */}
        <IonList lines="none" className="wide">
          {notifs?.map((notif: any, index: number) => (
            <IonItem key={notif.id} color="primary" className={index < notifs?.length - 1 ? "underline" : ""}>
              <IonLabel>
                <>
                  <span className="small-text">{makeDate(notif.schedule?.at)}</span>
                  <br />
                  <span className="big-text">{notif.title}</span>
                  <br />
                  {notif.body}
                </>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonCardContent>
    </IonCard>
  );
};

export default NotifsDebug;
