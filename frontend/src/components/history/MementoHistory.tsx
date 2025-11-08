//[Imports]
import React, { useContext } from "react";
import { IonRow, IonSelect, IonSelectOption } from "@ionic/react";
//[Import visuals]
import { IonSpinner } from "@ionic/react";
//[Import components]
import Info from "./memento/Info";
import CalInfo from "./memento/CalInfo";
import Occurrences from "./memento/Occurrences";
import EmptyCard from "./EmptyCard";
//[Import data]
import { AppContext } from "../../context/Context";

const MementoHistory: React.FC = () => {
  const { mementoHistory, defaults } = useContext<any | undefined>(AppContext);
  const doneLoading = mementoHistory && defaults?.mementoOptions;

  //[Update type]
  const select = (e: any) => mementoHistory?.set(e.detail.value);

  //[Memento History Page]
  return (
    <>
      <IonRow className="container top bottom">
        {/* Memento Select */}
        {!doneLoading ? (
          /* Mock Select (database not done loading) */
          <IonSpinner name="crescent" className="select-history wide" />
        ) : (
          /* Memento Type Options */
          <IonSelect
            value={mementoHistory?.type}
            selectedText={mementoHistory?.type?.selectedText}
            color="secondary"
            className="select-history"
            interface="popover"
            placeholder="Select memento type..."
            onIonChange={select}
          >
            {mementoHistory?.options?.map((memento: any) => (
              <IonSelectOption value={memento} key={memento.order}>
                {memento.label}
              </IonSelectOption>
            ))}
          </IonSelect>
        )}
      </IonRow>
      {/* Memento Info */}
      <IonRow className="top">
        <Info />
      </IonRow>
      {/* Memento Calendar & List */}
      {mementoHistory?.type ? (
        mementoHistory?.list?.length ? (
          <>
            {/* Calendar */}
            <IonRow className="top">
              <CalInfo />
            </IonRow>
            {/* List */}
            <IonRow>
              <Occurrences />
            </IonRow>
          </>
        ) : (
          /* Empty List */
          <EmptyCard text={"No past occurrences."} />
        )
      ) : (
        /* None Selected */
        <EmptyCard text={"No memento selected."} />
      )}
    </>
  );
};

export default MementoHistory;
