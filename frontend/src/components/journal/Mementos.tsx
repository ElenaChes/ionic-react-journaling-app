//[Imports]
import React, { useContext, useState } from "react";
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonChip, IonIcon, IonLabel, IonSelect, IonSelectOption } from "@ionic/react"; //prettier-ignore
//[Import visuals]
import { helpCircleOutline, paperPlaneOutline } from "ionicons/icons";
import { playCircleOutline, playForwardCircleOutline, pauseCircleOutline, alertCircleOutline } from "ionicons/icons";
//[Import components]
import MemModal from "./MemModal";
//[Import data]
import { AppContext } from "../../context/Context";
import { formatDate } from "../../context/utils";

interface ContainerProps {}

const Mementos: React.FC<ContainerProps> = () => {
  const { mementos, date, defaults } = useContext<any | undefined>(AppContext);
  const [memento, setMemento] = useState<any | undefined>();

  //[Modal contents]
  let mementoOptions = defaults?.mementoOptions?.filter((o: any) => !mementos?.list?.some((mem: any) => mem.name === o.name));
  const [modalOpen, setModalOpen] = useState(false); //modal open?
  const [actionNew, setActionNew] = useState(true); //new memento?
  const modalProps = { memento, setMemento, modalOpen, setModalOpen, actionNew }; //props for MemModal
  const modalOptions = {
    header: "Adding Memento",
    breakpoints: [0, 0.3, 0.6, 1],
    initialBreakpoint: 0.3,
    expandToScroll: false,
    cssClass: "options-modal",
  };

  //[Calculate visuals]
  const checkToday = (d: any) => d && d?.split("T")[0] === date?.selected.split("T")[0];
  const chipIcon = (start: string, end: string) => {
    if (start.split("T")[0] === end?.split("T")[0]) return alertCircleOutline; //single day -> ! icon
    if (checkToday(end)) return pauseCircleOutline; //ends today -> ⏸ icon
    if (checkToday(start)) return playCircleOutline; //starts today -> ▶ icon
    return playForwardCircleOutline; //default -> ▶▶ icon
  };
  //[Add memento]
  const selectNew = (mem: any) => {
    if (!mem) return;
    setActionNew(true);
    setMemento({ name: mem.name, start: date?.selected.split("T")[0], end: null, category: mem.category });
    setModalOpen(true);
  };
  //[Edit memento]
  const selectUpdate = (mem: any) => {
    if (!mem) return;
    setActionNew(false);
    setMemento({ name: mem.name, start: mem.start, end: mem.end || null, category: mem.category, _id: mem.id || mem._id });
    setModalOpen(true);
  };

  //[Mementos Card]
  return (
    <IonCard color="primary" className="container">
      {/* Title */}
      <IonCardHeader>
        <IonCardTitle>
          Mementos <IonIcon className="icon" icon={paperPlaneOutline} />
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        {/* Mementos List */}
        {mementos?.list?.map((memento: any, index: number) => (
          <IonChip
            color="secondary"
            className={memento.estimated && "chip-predict"}
            key={memento.id || memento._id || index}
            title={formatDate(memento.start) + " - " + (memento.end ? formatDate(memento.end) : "ongoing")}
            onClick={() => (!memento.estimated ? selectUpdate(memento) : selectNew(memento))}
          >
            <IonLabel>{memento.name}</IonLabel>
            <IonIcon icon={memento.estimated ? helpCircleOutline : chipIcon(memento.start, memento.end)} />
          </IonChip>
        ))}
        {/* New Memento Options */}
        <IonSelect
          value={memento}
          interfaceOptions={modalOptions}
          color="secondary"
          interface="modal"
          fill="outline"
          className="top-line"
          toggleIcon={playCircleOutline}
          label="Add started"
          onIonChange={(e: any) => selectNew(e.detail?.value)}
        >
          <IonSelectOption key={-1}></IonSelectOption>
          {mementoOptions?.map((memento: any) => (
            <IonSelectOption value={memento} key={memento.order}>
              {memento.name}
              {memento.category ? " (" + memento.category + ")" : ""}
            </IonSelectOption>
          ))}
        </IonSelect>
      </IonCardContent>
      {/* Adding/Editing Modal */}
      {memento && <MemModal {...modalProps} />}
    </IonCard>
  );
};

export default Mementos;
