"use client";


import { createPortal } from "react-dom";
import { SyntheticEvent, useRef, useState } from "react";

import { db } from "./Firebase";
import { addDoc, collection } from "firebase/firestore";
import Popup from "./popup";

type StickyDetailsProps = {
  noteId: string;
  onClose: () => void;
  color: string;
  font: string;
  data: string;
  length: number
};

const StickyDetails = ({ noteId, onClose, color, font, data, length }: StickyDetailsProps) => {

  const textRef = useRef<HTMLTextAreaElement>(null);

  const [popUp, setPopup] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const badText = (message: string) => {
    setMessage(message);
    setPopup(true);

    setTimeout(() => {
      setPopup(false);
    }, 3000)
  }

  const moderateMessage = async (message: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/moderateMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: message })
      });
      const result = await response.json();
      return result.output.trim() === "true";
    } catch (error) {
      console.error("Error moderating message:", error);
      return false;
    }
  };

  const addNote = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      if (textRef.current && textRef.current.value) {
        if (textRef.current.value.length < 50 || textRef.current.value.length > 300) {
          badText("Text must be at least 50 characters and at most 300 characters.")
        }
        else {
          const isSafe = await moderateMessage(textRef.current.value);

          if (!isSafe) {
            badText("Message contains inappropriate content.");
          } else {
            onClose();
            await addDoc(collection(db, "StickyNotes"), {
              note: textRef.current.value,
              order: length + 1
            });
          }
        }
      }
    }
    catch (e) {
      console.log("Error adding Note", e);
    }
  }

  return createPortal(
    <div
      className="z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                 w-[min(80vw,80vh)] h-[min(80vw,80vh)] border-2 border-black rounded-lg 
                 shadow-[10px_10px_0_rgba(0,0,0,0.5)] text-black p-6"
      style={{ backgroundColor: color, fontFamily: font }}
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-black font-bold text-4xl"
      >
        X
      </button>

      <h2 className="text-xl font-bold mb-2">Note ID: {noteId}</h2>
      {data != "" ?

        <p className="overflow-y-auto h-5/6 leading-relaxed text-xl text-wrap break-words">
          {data}
        </p>
        :
        <div className="w-full h-[85%] flex flex-col items-center">
          <textarea ref={textRef} style={{ backgroundColor: color }} className="text-wrap w-full h-4/6 md:h-5/6 align-text-top focus:outline-none placeholder-gray-800 text-2xl" placeholder={"Enter Text"} />
          <button onClick={addNote} style={{ backgroundColor: color }} className="text-center my-auto px-2 py-2 lg:h-20 border-2 border-black rounded-lg text-lg lg:text-3xl">
            Submit
          </ button>
        </ div>
      }

      {
        popUp &&
        <Popup message={message} />
      }


    </div>,
    document.body
  );
};

export default StickyDetails;
