//[Imports]
import React, { useContext } from "react";
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, IonItem, IonLabel, IonRow } from "@ionic/react";
//[Import visuals]
import { fileTrayFull } from "ionicons/icons";
//[Import data]
import { AppContext } from "../../../context/Context";

interface ContainerProps {}

export const Occurrences: React.FC<ContainerProps> = () => {
  const { mementoHistory, navigation } = useContext<any | undefined>(AppContext);

  //[Calculate visuals]
  const viewDate = (mem: any) => {
    mementoHistory?.resetMonth(mem.start);
    navigation?.content.current?.scrollToTop(500);
    const timer = setTimeout(() => {
      mementoHistory?.setDate(mem.start);
    }, 50);
    return () => clearTimeout(timer);
  };

  //[Memento Occurrences Card]
  return (
    <IonCard color="primary" className="container wide">
      {/* Title */}
      <IonCardHeader className="mid-card">
        <IonCardTitle>
          Occurrences list <IonIcon className="icon" icon={fileTrayFull} />
        </IonCardTitle>
      </IonCardHeader>
      {/* Memento List */}
      <IonCardContent>
        {mementoHistory?.list?.length ? (
          /* Occurrences List */
          mementoHistory?.list?.map((memento: any, index: number) =>
            memento.start ? (
              <IonItem
                key={index}
                color="primary"
                className={index < mementoHistory?.list.length - 1 ? "underline" : ""}
                onClick={() => viewDate(memento)}
              >
                <IonLabel className={"center" + (mementoHistory?.date === memento.start ? " list-selected" : "")}>
                  {mementoHistory?.type.group ? (
                    /* Grouped Mementos */
                    <>
                      <span className="align-left-tight">{memento.name}</span>
                      <span className="align-right-tight">
                        {memento.label?.dates} {memento.label?.days}
                        {memento.duration == 1 && <>&nbsp;&nbsp;</>}
                      </span>
                      <span className="align-right-tight"> | </span>
                    </>
                  ) : (
                    /* Regular Mementos */
                    <span>
                      {memento.label?.dates} {memento.label?.days}
                      {memento.duration == 1 && <>&nbsp;&nbsp;</>}
                    </span>
                  )}
                </IonLabel>
              </IonItem>
            ) : (
              ""
            )
          )
        ) : (
          /* Empty List */
          <IonRow className="center">
            <IonLabel className="text">No recorded occurrences.</IonLabel>
          </IonRow>
        )}
      </IonCardContent>
    </IonCard>
  );
};

export default Occurrences;
