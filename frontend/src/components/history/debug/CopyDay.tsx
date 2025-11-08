//[Imports]
import React, { useContext } from "react";
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon } from "@ionic/react";
import { Clipboard } from "@capacitor/clipboard";
//[Import visuals]
import { copyOutline } from "ionicons/icons";
//[Import data]
import { AppContext } from "../../../context/Context";
import { formatDate } from "../../../context/utils";

interface ContainerProps {}

//[Debug copy data]
export const CopyDay: React.FC<ContainerProps> = () => {
  const { date, fetchData, alerts } = useContext<any | undefined>(AppContext);
  let dateLabel = formatDate(date?.selected?.split("T")[0]);

  //[Copy day as formatted text]
  const copyText = async () => {
    const { date, moments = [], memories = [] } = fetchData?.entry() || {};
    const dateText = formatDate(date) || "No date";
    const momentsText = moments.length ? moments.join(", ") : "None";
    const formatMemory = (memory: any) => `**${memory.title}**\n> ${memory.content?.split("\n").join("\n> ") || "Nothing yet."}`;
    const memoriesText = memories.length ? memories.map(formatMemory).join("\n") : "**Memories:**\n- None yet.";

    const text = `**Date:** \`${dateText}\`\n**Moments done today:**\n> ${momentsText}\n${memoriesText}`;
    console.log(text);
    await Clipboard.write({ string: text });
    alerts?.set(true, "Copied formatted text to clipboard.");
  };
  //[Copy day as json]
  const copyJSON = async () => {
    const data = fetchData?.entry() || {};
    const text = JSON.stringify(data, null, 2);
    console.log(text);
    await Clipboard.write({ string: text });
    alerts?.set(true, "Copied raw json to clipboard.");
  };

  //[Copy Day Card]
  return (
    <IonCard color="primary" className="container wide top bottom">
      {/* Title */}
      <IonCardHeader>
        <IonCardTitle>
          Copy Day ( <span className="small-text">{dateLabel}</span> )
          <IonIcon className="icon" icon={copyOutline} />
        </IonCardTitle>
      </IonCardHeader>
      {/* Buttons */}
      <IonCardContent>
        <IonButton className="plain-text align-left top bottom" onClick={copyText}>
          Formatted text
        </IonButton>
        <IonButton className="plain-text align-right top bottom" onClick={copyJSON}>
          Raw JSON
        </IonButton>
      </IonCardContent>
    </IonCard>
  );
};

export default CopyDay;
