//[Imports]
import React from "react";
import { IonIcon, IonButton } from "@ionic/react";
//[Import visuals]
import { calendarNumber } from "ionicons/icons";

interface ContainerProps {
  //passed hideReset - hide button?, onReset - reset function, resetDate - optional date for resetMonth
  hideReset?: boolean;
  onReset: (resetDate?: string) => void;
  className?: string;
  resetDate?: string;
}

export const ResetButton: React.FC<ContainerProps> = ({ hideReset = false, onReset, className = "", resetDate }) => {
  if (hideReset) return null;

  //[Optional reset button]
  return (
    <IonButton color="primary" className={`reset-button ${className}`} onClick={() => onReset(resetDate)}>
      <IonIcon slot="icon-only" icon={calendarNumber} />
    </IonButton>
  );
};

export default ResetButton;
