//[Imports]
import React, { useContext } from "react";
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonChip, IonLabel, IonTextarea } from "@ionic/react";
import { useIonRouter } from "@ionic/react";
//[Import data]
import { AppContext } from "../../../context/Context";
import { formatDate, parseMarkdown } from "../../../context/utils";

interface ContainerProps {
  index: number; //memory index
}

export const Info: React.FC<ContainerProps> = ({ index }) => {
  const { date, memoryHistory } = useContext<any | undefined>(AppContext);
  const { title, content, date: memDate } = memoryHistory?.list?.[index] || {};
  const router = useIonRouter();

  //[Navigate to date]
  const viewDate = () => {
    date?.set(memDate);
    router.push("/journal", "back");
  };

  //[Memory Info Card]
  return (
    <IonCard color="primary" className="container">
      {/* Title */}
      <IonCardHeader>
        <IonCardTitle>{title}</IonCardTitle>
      </IonCardHeader>
      {/* Memory Text */}
      <IonCardContent>
        <IonTextarea className="text has-card-footer" value={parseMarkdown(content)} autoGrow={true} readonly={true} />
      </IonCardContent>
      {/* Memory Date */}
      <IonChip color="secondary" className="center card-footer" onClick={viewDate}>
        <IonLabel>{formatDate(memDate)}</IonLabel>
      </IonChip>
    </IonCard>
  );
};

export default Info;
