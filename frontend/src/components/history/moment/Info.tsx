//[Imports]
import React, { useContext } from "react";
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonGrid, IonIcon, IonLabel, IonRow } from "@ionic/react";
//[Import visuals]
import { pieChart } from "ionicons/icons";
//[Import data]
import { AppContext } from "../../../context/Context";

interface ContainerProps {}

export const Info: React.FC<ContainerProps> = () => {
  const { momentHistory } = useContext<any | undefined>(AppContext);

  //[Calculate visuals]
  const frequencyLabel = () => {
    const type = momentHistory?.type;
    /*
    Quota: "[frequency] times per [span]"
    Interval: "every [frequency] [span]s"
    */
    const plural = type.frequency > 1 ? "s" : "";
    let text = type.quota
      ? `${type.frequency} time${plural} per ${type.span}`
      : `Every ${type.frequency} ${type.span}${plural}`;
    text = text
      .replaceAll("Every 1 day", "Daily")
      .replaceAll("Every 1 week", "Every week")
      .replaceAll("Once a month", "Every month");
    return text;
  };

  //[Moment Info Card]
  return (
    <IonCard color="primary" className="container">
      {/* Title */}
      <IonCardHeader className="mid-card">
        <IonCardTitle>
          Info <IonIcon className="icon" icon={pieChart} />
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        {/* Info */}
        <IonGrid>
          {momentHistory?.type ? (
            /* Moment Info */
            <>
              <IonRow className="top">
                {/* Last Done */}
                <IonCol className="left">
                  <IonLabel className="center">
                    <span className="big-text">Last done</span>
                    <br />
                    <span className="text">{momentHistory.stats?.lastDate}</span>
                  </IonLabel>
                </IonCol>
                {/* Completion Percent */}
                <IonCol className="right">
                  <IonLabel className="center">
                    <span className="big-text">Completion</span>
                    <br />
                    <span className="text">{momentHistory.stats?.completePercentage}%</span>
                  </IonLabel>
                </IonCol>
              </IonRow>
              {/* Frequency */}
              <IonRow className="center">
                <IonLabel className="text">
                  <span className="big-text">Frequency</span>
                  <br />
                  <span className="text">{frequencyLabel()}</span>
                </IonLabel>
              </IonRow>
            </>
          ) : (
            /* None Selected */
            <IonRow className="center">
              <IonLabel className="text">No moment selected.</IonLabel>
            </IonRow>
          )}
        </IonGrid>
      </IonCardContent>
    </IonCard>
  );
};

export default Info;
