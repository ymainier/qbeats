import { useEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import { KEYCODES_TO_NOTES } from "../data";
import type { NoteType } from "../data";

function listen(
  onDown: (note: NoteType) => void,
  onUp: (note: NoteType) => void
): () => void {
  const onKeyDown = ({ code }: KeyboardEvent) => {
    const maybeNote = KEYCODES_TO_NOTES[code];
    if (!maybeNote) return;
    onDown(maybeNote);
  };
  window.addEventListener("keydown", onKeyDown, false);

  const onKeyUp = ({ code }: KeyboardEvent) => {
    const maybeNote = KEYCODES_TO_NOTES[code];
    if (!maybeNote) return;
    onUp(maybeNote);
  };
  window.addEventListener("keyup", onKeyUp, false);

  return () => {
    window.removeEventListener("keydown", onKeyDown, false);
    window.removeEventListener("keyup", onKeyUp, false);
  };
}

export function usePlayedNotes(): Array<NoteType> {
  const [playedNotes, setPlayedNotes] = useState<Array<NoteType>>([]);
  useEffect(() => {
    return listen(
      (note) =>
        setPlayedNotes((notes) =>
          notes.includes(note) ? notes : [...notes, note]
        ),
      (note) =>
        setPlayedNotes((notes) =>
          notes.includes(note) ? notes.filter((_note) => _note !== note) : notes
        )
    );
  }, []);
  return playedNotes;
}

type TimedNote = { note: NoteType; start: number; stop?: number };

export function useNotes(): Array<TimedNote> {
  const get = useThree((state) => state.get);
  const [timedNotes, setTimedNotes] = useState<Array<TimedNote>>([]);
  useEffect(() => {
    return listen(
      (note) =>
        setTimedNotes((timedNotes) => {
          // @ts-ignore
          const clock = get().qClock;

          return timedNotes.some(
            ({ note: _note, stop }) => _note === note && stop == null
          )
            ? timedNotes
            : [...timedNotes, { note, start: clock.getElapsedTime() }];
        }),
      (note) =>
        setTimedNotes((timedNotes) => {
          // @ts-ignore
          const clock = get().qClock;
          const reversed = [...timedNotes].reverse();
          const reversedIndex = reversed.findIndex(
            ({ note: _note, stop }) => note === _note && stop == null
          );
          if (reversedIndex === -1) return timedNotes;
          const { start } = reversed[reversedIndex];
          const newTimedNotes = [...timedNotes];
          newTimedNotes.splice(timedNotes.length - 1 - reversedIndex, 1, {
            note,
            start,
            stop: clock.getElapsedTime(),
          });
          return newTimedNotes;
        })
    );
  }, [get]);
  return timedNotes;
}
