import { useEffect, useState} from "react"
import { KEYCODES_TO_NOTES } from "../data";
import type { NoteType } from "../data";

export function useNotes(): Array<NoteType> {
  const [playedNotes, setPlayedNotes] = useState<Array<NoteType>>([]);
  useEffect(() => {
    const onKeyDown = ({ code }: KeyboardEvent) => {
      const maybeNote = KEYCODES_TO_NOTES[code];
      if (!maybeNote) return;
      setPlayedNotes((notes) =>
        notes.includes(maybeNote) ? notes : [...notes, maybeNote]
      );
    };
    window.addEventListener("keydown", onKeyDown, false);

    const onKeyUp = ({ code }: KeyboardEvent) => {
      const maybeNote = KEYCODES_TO_NOTES[code];
      if (!maybeNote) return;
      setPlayedNotes((notes) =>
        notes.includes(maybeNote)
          ? notes.filter((note) => note !== maybeNote)
          : notes
      );
    };
    window.addEventListener("keyup", onKeyUp, false);

    return () => {
      window.removeEventListener("keydown", onKeyDown, false);
      window.removeEventListener("keyup", onKeyUp, false);
    };
  }, []);
  return playedNotes;
}
