//[Imports]
import React, { useContext } from "react";
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCheckbox, IonIcon, IonItem, IonList } from "@ionic/react";
//[Import visuals]
import { IonSpinner } from "@ionic/react";
import { timerOutline } from "ionicons/icons";
//[Import data]
import { AppContext } from "../../context/Context";

interface ContainerProps {}

const Moments: React.FC<ContainerProps> = () => {
  const { moments, defaults } = useContext<any | undefined>(AppContext);
  const doneLoading = moments?.list && defaults?.momentOptions;
  const mockSize = 14; //adjust for mock list length

  //[Update checkmarks]
  const select = (e: any) => moments?.set(e.target.innerText, e.detail.checked);

  //[Set highlighting]
  const highlightClass = (due: string) => {
    //prettier-ignore
    switch (due) {
      case "due": return "checkbox-highlighted";
      case "could_do": return "checkbox-midlighted";
      case "not_due": return "checkbox-downlighted";
      default: return "";
    }
  };

  //[Moments Card]
  return (
    <IonCard color="primary" className="container wide">
      {/* Title */}
      <IonCardHeader>
        <IonCardTitle>
          Moments <IonIcon className="icon" icon={timerOutline} />
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        {/* Moments List */}
        <IonList lines="none" inset={true}>
          {!doneLoading
            ? /* Mock List (database not done loading) */
              [...Array(mockSize)].map((_, index) => (
                <IonItem key={index} color="primary" className={index < mockSize - 1 ? "underline" : ""}>
                  <IonSpinner name="crescent" className="wide" />
                </IonItem>
              ))
            : /* Moments List */
              moments?.data?.map((moment: any, index: number) => (
                <IonItem
                  key={moment.order}
                  color="primary"
                  className={index < defaults?.momentOptions.length - 1 ? " underline" : ""}
                >
                  <IonCheckbox
                    className={highlightClass(moment.due)}
                    checked={moments?.list?.includes(moment.name)}
                    onIonChange={select}
                  >
                    {moment.name}
                  </IonCheckbox>
                </IonItem>
              ))}
        </IonList>
      </IonCardContent>
    </IonCard>
  );
};

export default Moments;
