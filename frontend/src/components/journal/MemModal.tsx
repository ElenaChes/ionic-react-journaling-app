//[Imports]
import React, { useContext, useState, useRef, useEffect } from "react";
import { IonAlert, IonButton, IonButtons, IonCol, IonContent, IonDatetime, IonIcon, IonLabel, IonModal, IonRow, IonTitle, IonToolbar } from "@ionic/react"; //prettier-ignore
import useCalendar from "../calendar/useCalendar"; //import the custom hook
//[Import visuals]
import { calendar } from "ionicons/icons";
//[Import data]
import { AppContext } from "../../context/Context";
import { formatDate, datesInterval, highlightedMemModal } from "../../context/utils";

interface ContainerProps {
  //passed memento, modalOpen - modal open?, actionNew - new memento?
  memento: any;
  setMemento: any;
  modalOpen: boolean;
  setModalOpen: any;
  actionNew: boolean;
}

const MemModal: React.FC<ContainerProps> = ({ memento, setMemento, modalOpen, setModalOpen, actionNew }) => {
  const { mementos } = useContext<any | undefined>(AppContext);

  //[Selected memento]
  const originalMemento = useRef<any | undefined>(JSON.parse(JSON.stringify(memento)));
  const [duration, setDuration] = useState<number | null>(null); //memento duration
  const { start, end } = memento || {};

  //[Modal]
  const [alertOpen, setAlertOpen] = useState(false);
  let actionTitle = actionNew ? "Adding Memento" : "Updating Memento";
  let actionButton = actionNew ? "Add" : "Save";
  const alertButtons = [
    { text: "Cancel", role: "cancel" },
    { text: "Delete", role: "confirm" },
  ];

  //[Calendar]
  const calendarRef = useRef<null | HTMLIonDatetimeElement>(null);
  const { ResetButton } = useCalendar(calendarRef); //reset button
  const [modeStart, setModeStart] = useState(true); //editing start or end?
  const [selectedDate, setSelectedDate] = useState<any | undefined>(null);

  //[Start/end mode changes]
  useEffect(() => {
    if (modeStart) setSelectedDate(start);
    else setSelectedDate(end || start); //fallback to start
    setDuration(end ? datesInterval(start, end) + 1 : null); //update duration
  }, [modeStart, start, end]);

  //[Update date]
  const select = (e: any) => {
    const date = e.detail.value?.split("T")[0];
    if (!date) return;

    //new start
    if (modeStart) {
      setMemento((prev: {}) => ({ ...prev, start: date }));
      return setSelectedDate(date);
    }
    //new end
    if (date !== end) {
      setMemento((prev: {}) => ({ ...prev, end: date }));
      return setSelectedDate(date);
    }
    //deselect end
    setMemento((prev: {}) => ({ ...prev, end: null }));
    setSelectedDate(start);
  };

  //[Confirm changes]
  const confirm = () => {
    mementos?.set(memento);
    close();
  };
  //[Delete memento]
  const remove = (e: any) => {
    if (!actionNew && e.detail.role === "confirm") mementos?.set({ name: memento.name, _id: memento.id || memento._id });
    close();
  };
  //[Close modal]
  const close = () => {
    setMemento(null);
    if (modalOpen) setModalOpen(false);
    if (alertOpen) setAlertOpen(false);
  };

  //[Mementos Card]
  return (
    <IonModal isOpen={modalOpen} className="dates-modal" expandToScroll={false} keepContentsMounted={true} onWillDismiss={close}>
      {/* 1st Block - Cancel Button  & Title*/}
      <IonToolbar color="primary">
        <IonButtons slot="end">
          <IonButton onClick={close}>Cancel</IonButton>
        </IonButtons>
        <IonTitle className="align-left">
          {actionTitle}
          {duration ? <span className="small-text"> ({duration + " days"}) </span> : ""}
        </IonTitle>
      </IonToolbar>
      <IonContent>
        {/* 2nd Block - Memento Name & Category */}
        <IonRow className="top">
          <IonLabel className="container big-text">
            {memento?.name}
            {memento?.category ? <span className="small-text"> ({memento.category}) </span> : ""}
          </IonLabel>
        </IonRow>
        {/* 3rd Block - Date Mode Buttons */}
        <IonRow className="container top">
          <IonCol className="right">
            <IonButton className={"dates-buttons" + (modeStart ? " button-selected" : "")} onClick={() => setModeStart(true)}>
              {start ? formatDate(start) : <IonIcon icon={calendar} />}
            </IonButton>
          </IonCol>
          <IonCol>
            <IonLabel className="big-text center">-</IonLabel>
          </IonCol>
          <IonCol className="left">
            <IonButton className={"dates-buttons" + (!modeStart ? " button-selected" : "")} onClick={() => setModeStart(false)}>
              {end ? formatDate(end) : <IonIcon icon={calendar} />}
            </IonButton>
          </IonCol>
        </IonRow>
        {/* 4th Block - Calendar */}
        <IonRow className="container modal-calendar">
          <IonDatetime
            size="cover"
            color="medium"
            presentation="date"
            ref={calendarRef}
            value={selectedDate}
            highlightedDates={(date: any) => highlightedMemModal(date, start, end)}
            {...(!modeStart && start ? { min: start } : {})}
            {...(modeStart && end ? { max: end } : {})}
            onIonChange={select}
          />
          {/* Optional Reset Button */}
          <ResetButton className={"modal-cal-reset"} />
        </IonRow>
        {/* 5th Block - Add/Save & Delete Buttons */}
        <IonRow className="modal-buttons">
          {!actionNew && (
            <IonButton className="modal-button" onClick={() => setAlertOpen(true)}>
              Delete
            </IonButton>
          )}
          <IonButton
            className="modal-button"
            strong={true}
            disabled={!actionNew && originalMemento?.current?.start === start && originalMemento?.current?.end === end}
            onClick={confirm}
          >
            {actionButton}
          </IonButton>
          {/* Delete Confirmation */}
          <IonAlert header="Delete this memento?" isOpen={alertOpen} buttons={alertButtons} onDidDismiss={remove}></IonAlert>
        </IonRow>
      </IonContent>
    </IonModal>
  );
};

export default MemModal;
