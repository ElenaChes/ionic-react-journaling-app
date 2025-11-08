//[Imports]
import React, { useContext, useEffect } from "react";
import { IonRow, useIonToast } from "@ionic/react";
//[Import components]
import CopyDay from "./debug/CopyDay";
import NotifsDebug from "./debug/NotifsDebug";
//[Import data]
import { AppContext } from "../../context/Context";

interface ContainerProps {}

export const DebugPage: React.FC<ContainerProps> = () => {
  const { alerts } = useContext<any | undefined>(AppContext);
  const [present] = useIonToast();

  //[Display alerts]
  useEffect(() => {
    if (!alerts) return;
    const { display, text } = alerts || {};
    if (!display || !text?.current) return;
    present({ message: text?.current, duration: 1500, position: "middle", swipeGesture: "vertical" });
    alerts?.set(false, "");
  }, [alerts]);

  //[Debug page]
  return (
    <>
      <IonRow className="bottom">
        <CopyDay />
      </IonRow>
      <IonRow className="bottom">
        <NotifsDebug />
      </IonRow>
    </>
  );
};

export default DebugPage;
