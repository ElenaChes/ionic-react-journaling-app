//[Imports]
import React, { useContext, useState } from "react";
import { IonContent, IonFab, IonFabButton, IonFabList, IonHeader, IonIcon, IonPage } from "@ionic/react";
//[Import visuals]
import { paperPlaneOutline, timerOutline, documentOutline, constructOutline } from "ionicons/icons";
//[Import components]
import MementoHistory from "../components/history/MementoHistory";
import MomentHistory from "../components/history/MomentHistory";
import MemoryHistory from "../components/history/MemoryHistory";
import DebugPage from "../components/history/DebugPage";
//[Import data]
import { AppContext } from "../context/Context";

const History: React.FC = () => {
  //[Page options]
  const options = {
    moment: { title: "Moments History", page: MomentHistory, icon: timerOutline },
    memento: { title: "Mementos History", page: MementoHistory, icon: paperPlaneOutline },
    memory: { title: "Memories History", page: MemoryHistory, icon: documentOutline },
    debug: { title: "Debug Page", page: DebugPage, icon: constructOutline },
  };
  //[Current page]
  const { navigation } = useContext<any | undefined>(AppContext);
  const history = (navigation?.history ?? "moment") as keyof typeof options;
  const [title, setTitle] = useState<string | undefined>(options[history].title);
  const [SubPage, setSubPage] = useState<React.FC>(() => options[history].page);
  const [fabIcon, setFabIcon] = useState<any | undefined>(options[history].icon);

  //[Update page]
  const select = (option: keyof typeof options) => {
    navigation?.setHistory(option); //save page in history
    setTitle(options[option].title);
    setSubPage(() => options[option].page);
    setFabIcon(options[option].icon);
  };

  //[History Page]
  return (
    <IonPage>
      {/* Header - Sub Page Title & Floating Button */}
      <IonHeader className="page-header">{title}</IonHeader>
      <IonFab slot="fixed">
        <IonFabButton className="fab-title">
          <IonIcon className="fab-icon" icon={fabIcon} />
        </IonFabButton>
        <IonFabList side="bottom">
          <IonFabButton onClick={() => select("moment")}>
            <IonIcon icon={timerOutline} />
          </IonFabButton>
          <IonFabButton onClick={() => select("memento")}>
            <IonIcon icon={paperPlaneOutline} />
          </IonFabButton>
          <IonFabButton onClick={() => select("memory")}>
            <IonIcon icon={documentOutline} />
          </IonFabButton>
          <IonFabButton onClick={() => select("debug")}>
            <IonIcon icon={constructOutline} />
          </IonFabButton>
        </IonFabList>
      </IonFab>
      {/* Block - Sub Page Content */}
      <IonContent force-overscroll={false} ref={navigation?.content}>
        <SubPage />
      </IonContent>
    </IonPage>
  );
};

export default History;
