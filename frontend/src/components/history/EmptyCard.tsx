//[Imports]
import React from "react";
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, IonLabel, IonRow } from "@ionic/react";
//[Import visuals]
import { calendar } from "ionicons/icons";

interface ContainerProps {
  text: string;
  title?: string;
}

export const EmptyCard: React.FC<ContainerProps> = ({ text, title }) => {
  //[Empty Card]
  return (
    <IonCard color="primary" className="container wide">
      {/* Title */}
      <IonCardHeader>
        <IonCardTitle>
          {title ?? "Past occurrences"} <IonIcon className="icon" icon={calendar} />
        </IonCardTitle>
      </IonCardHeader>
      {/* Card Text */}
      <IonCardContent>
        <IonRow className="center">
          <IonLabel className="text">{text}</IonLabel>
        </IonRow>
      </IonCardContent>
    </IonCard>
  );
};

export default EmptyCard;
