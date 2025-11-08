//[Imports]
import React, { useContext } from "react";
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonGrid, IonIcon, IonLabel, IonRow } from "@ionic/react";
//[Import visuals]
import { pieChart } from "ionicons/icons";
//[Import data]
import { AppContext } from "../../../context/Context";

interface ContainerProps {}

export const Info: React.FC<ContainerProps> = () => {
  const { mementoHistory } = useContext<any | undefined>(AppContext);

  //[Calculate visuals]
  const averagesLabel = (average: any) => (average ? average + " days" : "n/a");

  //[Memento Info Card]
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
          {mementoHistory?.type ? (
            /* Memento Info */
            <>
              <IonRow className="top">
                {/* Category */}
                <IonCol className="left">
                  <IonLabel className="center">
                    <span className="big-text">Category</span>
                    <br />
                    <span className="text">{mementoHistory.type.category}</span>
                  </IonLabel>
                </IonCol>
                {/* Predict Enabled? */}
                <IonCol>
                  <IonLabel className="center">
                    <span className="big-text">Predict</span>
                    <br />
                    <span className="text">{mementoHistory.type.predict ? "Yes" : "No"}</span>
                  </IonLabel>
                </IonCol>
                {/* Total Logged */}
                <IonCol className="right">
                  <IonLabel className="center">
                    <span className="big-text">Total</span>
                    <br />
                    <span className="text">{(mementoHistory.stats?.total || "0") + " times"}</span>
                  </IonLabel>
                </IonCol>
              </IonRow>
              {/* Averages */}
              <IonRow className="center">
                <IonLabel className="text">
                  <span className="big-text">Average</span>
                  <br />
                  <span className="text">Duration: {averagesLabel(mementoHistory.stats?.averageDuration)}</span>
                  <span className="text">Interval: {averagesLabel(mementoHistory.stats?.averageInterval)}</span> <br />
                  {mementoHistory.type.intervalFromStart && <span className="text">(Interval from start)</span>}
                </IonLabel>
              </IonRow>
            </>
          ) : (
            /* None Selected */
            <IonRow className="center">
              <IonLabel className="text">No memento selected.</IonLabel>
            </IonRow>
          )}
        </IonGrid>
      </IonCardContent>
    </IonCard>
  );
};

export default Info;
