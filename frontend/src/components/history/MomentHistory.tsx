//[Imports]
import React, { useContext } from "react";
import { IonRow, IonSelect, IonSelectOption } from "@ionic/react";
//[Import visuals]
import { IonSpinner } from "@ionic/react";
//[Import components]
import Info from "./moment/Info";
import CalInfo from "./moment/CalInfo";
import EmptyCard from "./EmptyCard";
//[Import data]
import { AppContext } from "../../context/Context";

const MomentHistory: React.FC = () => {
  const { momentHistory, defaults } = useContext<any | undefined>(AppContext);
  const doneLoading = momentHistory && defaults?.momentOptions;

  //[Update type]
  const select = (e: any) => momentHistory?.set(e.detail.value);

  //[Moment History Page]
  return (
    <>
      <IonRow className="container top bottom">
        {/* Moments Select */}
        {!doneLoading ? (
          /* Mock Select (database not done loading) */
          <IonSpinner name="crescent" className="select-history wide" />
        ) : (
          /* Moments Type Options */
          <IonSelect
            value={momentHistory?.type}
            selectedText={momentHistory?.type?.name}
            color="secondary"
            className="select-history"
            interface="popover"
            placeholder="Select moment type..."
            onIonChange={select}
          >
            {defaults?.momentOptions?.map((moment: any) => (
              <IonSelectOption value={moment} key={moment.order}>
                {moment.name}
              </IonSelectOption>
            ))}
          </IonSelect>
        )}
      </IonRow>
      {/* Moment Info */}
      <IonRow className="top">
        <Info />
      </IonRow>
      {/* Moment Calendar / Empty Block */}
      {momentHistory?.type && momentHistory?.stats ? (
        /* Calendar */
        <IonRow className="top">
          <CalInfo />
        </IonRow>
      ) : (
        /* None Selected */
        <EmptyCard text={"No moment selected."} />
      )}
    </>
  );
};

export default MomentHistory;
