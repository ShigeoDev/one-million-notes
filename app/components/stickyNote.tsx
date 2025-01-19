import { Inter } from "next/font/google";

type StickyNotesProp = {

  message: string;
  noteId: string;
  onClick: () => void;
  style?: React.CSSProperties;
};

const inter = Inter({ weight: "400", subsets: ['latin'] })

const StickyNote = ({ message, noteId, onClick, style }: StickyNotesProp) => {
  return (
    <div
      className="my-hand-element shadow-[5px_5px_0_rgba(0,0,0,0.5)] bg-yellow-100 w-48 h-48 border-2 border-black rounded-lg text-black 
                   flex items-center justify-center cursor-pointer text-center"
            onClick={onClick}
            style={style}   
    >
      <p className={`${inter.className} px-2 py-2`} style={{ fontFamily: style?.fontFamily }}>
        {message}
      </p>
    </div>
  );

};

export default StickyNote;

