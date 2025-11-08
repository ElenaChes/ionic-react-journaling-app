//[Imports]
import React, { useContext, useState, useEffect } from "react";
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonTextarea } from "@ionic/react";
//[Import visuals]
import { IonSpinner } from "@ionic/react";
//[Import data]
import { AppContext } from "../../context/Context";
import { parseMarkdown, unparseMarkdown } from "../../context/utils";

interface ContainerProps {
  index: number; //memory index
}

const Memory: React.FC<ContainerProps> = ({ index }) => {
  const { memories, defaults } = useContext<any | undefined>(AppContext);
  const doneLoading = memories?.list && defaults?.memoryTitles;
  const title = memories?.list?.[index]?.title || defaults?.memoryTitles?.[index]?.name || "Couldn't fetch title";
  const [modeParsed, setModeParsed] = useState(true);
  const [parsedContent, setParsedContent] = useState("");
  const [unparsedContent, setUnparsedContent] = useState("");

  //[Parse raw text to markdown-like]
  useEffect(() => {
    const content = memories?.list?.[index]?.content;
    if (content === unparsedContent) return;
    setParsedContent(parseMarkdown(content));
    setUnparsedContent(content);
  }, [memories?.list?.[index]]);

  //[Update text]
  const save = (e: any) => {
    const value = e.target.value;
    if (value === unparsedContent) return;
    setParsedContent(parseMarkdown(value)); //update parsed
    setUnparsedContent(value); //update raw
    memories?.set(title, unparseMarkdown(value)); //update in database
  };

  //[Memory Card]
  return (
    <IonCard color="primary" className="container">
      {/* Title */}
      <IonCardHeader>
        <IonCardTitle>{!doneLoading ? <IonSpinner name="crescent" className="wide" /> : title}</IonCardTitle>
      </IonCardHeader>
      {/* Text Box */}
      <IonCardContent>
        <IonTextarea
          className="text"
          value={modeParsed ? parsedContent : unparsedContent} //display parsed (on blur) or raw (on focus)
          placeholder={!doneLoading ? "" : "..."}
          spellcheck={true}
          autocapitalize="sentences"
          autoGrow={true}
          onIonFocus={() => setModeParsed(false)} //raw on focus
          onIonBlur={() => setModeParsed(true)} //markdown-like on blur
          onIonChange={save}
        />
      </IonCardContent>
    </IonCard>
  );
};

export default Memory;
