//[Imports]
import React, { useContext } from "react";
import { IonCol, IonGrid, IonLabel, IonRow, IonSearchbar, IonSegment, IonSegmentButton } from "@ionic/react";
//[Import visuals]
import { IonSpinner } from "@ionic/react";
//[Import components]
import Info from "./memory/Info";
//[Import data]
import { AppContext } from "../../context/Context";

const MemoryHistory: React.FC = () => {
  const { memoryHistory } = useContext<any | undefined>(AppContext);
  const doneLoading = !!memoryHistory;

  //[Update search]
  const search = (e: any) => {
    const target = e.target as HTMLIonSearchbarElement;
    if (!target) return;
    memoryHistory?.set(target.value);
  };
  const updateMode = (e: any) => memoryHistory?.setMode(e.detail.value);

  //[Memory History Page]
  return (
    <>
      <IonRow className="container no-padding top bottom">
        {/* Mode Select */}
        <IonSegment value={memoryHistory?.mode} className="underline-soft" onIonChange={updateMode}>
          {/* Search By Content */}
          <IonSegmentButton value="content" className="right-line">
            <IonLabel>Content</IonLabel>
          </IonSegmentButton>
          {/* Search By Title */}
          <IonSegmentButton value="title" className="right-line">
            <IonLabel>Title</IonLabel>
          </IonSegmentButton>
          {/* Search By Both */}
          <IonSegmentButton value="both">
            <IonLabel>Both</IonLabel>
          </IonSegmentButton>
        </IonSegment>
        {/* Memory Search */}
        {!doneLoading ? (
          /* Mock Search (database not done loading) */
          <IonSpinner name="crescent" className="select-history wide" />
        ) : (
          /* Memory Search */
          <IonSearchbar
            value={memoryHistory?.term}
            placeholder="Search memories..."
            className="search-history"
            spellcheck={true}
            debounce={1000}
            showClearButton="always"
            onIonChange={search}
            onIonClear={() => memoryHistory?.set("")}
          />
        )}
      </IonRow>
      {/* Memory Results List */}
      {memoryHistory?.list?.length > 0 && (
        <IonGrid>
          {memoryHistory.list.map((_: any, index: number) => {
            if (index % 2 !== 0) return null;
            return (
              <IonRow className="top" key={index}>
                {index === memoryHistory.list.length - 1 && !(index + 1 < memoryHistory.list.length) ? (
                  /* last index & odd length */
                  <Info index={index} />
                ) : (
                  /* has pair/not last */
                  <>
                    <IonCol className="left">
                      <Info index={index} />
                    </IonCol>
                    <IonCol className="right">
                      <Info index={index + 1} />
                    </IonCol>
                  </>
                )}
              </IonRow>
            );
          })}
        </IonGrid>
      )}
    </>
  );
};

export default MemoryHistory;
