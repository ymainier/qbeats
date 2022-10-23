import { useEffect, useRef, useState } from "react";
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

type PendingTimedNote = { note: NoteType; start: number };
type TimedNote = PendingTimedNote & { stop: number };

const sameNoteAs =
  (note: NoteType) =>
  ({ note: _note }: PendingTimedNote | TimedNote) =>
    note === _note;

class TimedNotesQueue {
  #queued: Array<TimedNote> = [];
  #processed: Array<TimedNote> = [];
  #pending: Array<PendingTimedNote> = [];
  #getTime: () => number;

  constructor(getTime: () => number) {
    this.#getTime = getTime;
  }

  clear(): void {
    this.#queued = [];
    this.#processed = [];
    this.#pending = [];
  }

  start(note: NoteType) {
    if (this.#pending.some(sameNoteAs(note))) return;
    this.#pending.push({ note, start: this.#getTime() });
  }

  stop(note: NoteType) {
    const maybePending = this.#pending.find(sameNoteAs(note));
    if (maybePending == null) return;
    this.#queued.push({ ...maybePending, stop: this.#getTime() });
    this.#pending = this.#pending.filter(({ note: _note }) => note !== _note);
  }

  flush(): Array<TimedNote> {
    const queued = this.#queued;
    this.#queued = [];
    this.#processed = this.#processed.concat(queued);
    return queued;
  }
}

export function useTimedNotesQueue(getTime: () => number) {
  const timedNotesQueueRef = useRef(new TimedNotesQueue(getTime));
  useEffect(() => {
    return listen(
      (note) => timedNotesQueueRef.current.start(note),
      (note) => timedNotesQueueRef.current.stop(note)
    );
  }, []);
  return timedNotesQueueRef;
}
