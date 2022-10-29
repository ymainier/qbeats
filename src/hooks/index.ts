import { useEffect, useRef, useState } from "react";
import { WebMidi } from "webmidi";
import type { InputChannel } from "webmidi";
import { KEYCODES_TO_NOTES, midiNoteToNote } from "../data";
import type { NoteType } from "../data";
import { useQBeatsStore } from "../store";

const inputChannelRef: { current: InputChannel | null } = {
  current: null,
};

function listenToMidi(
  onPress: (note: NoteType) => void,
  onRelease: (note: NoteType) => void
) {
  WebMidi.enable()
    .then(() => {
      if (WebMidi.inputs.length > 0 && WebMidi.inputs[0].channels.length > 1) {
        inputChannelRef.current = WebMidi.inputs[0].channels[1];
        inputChannelRef.current.addListener("noteon", ({ note: _note }) => {
          const note = midiNoteToNote(_note);
          if (note) onPress(note);
        });
        inputChannelRef.current.addListener("noteoff", ({ note: _note }) => {
          const note = midiNoteToNote(_note);
          if (note) onRelease(note);
        });
      }
    })
    .catch((err) => console.error(err));

  return () => {
    if (inputChannelRef.current) {
      inputChannelRef.current.removeListener();
    }
  };
}

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

const addNote = (note: NoteType) => (notes: Array<NoteType>) =>
  notes.includes(note) ? notes : [...notes, note];
const removeNote = (note: NoteType) => (notes: Array<NoteType>) =>
  notes.includes(note) ? notes.filter((_note) => _note !== note) : notes;

export function usePlayedNotes(): Array<NoteType> {
  const [playedNotes, setPlayedNotes] = useState<Array<NoteType>>([]);
  const notesRef = useRef(playedNotes);
  const trigger = useQBeatsStore((state) => state.trigger);
  const release = useQBeatsStore((state) => state.release);
  useEffect(() => {
    const cleanupMidi = listenToMidi(
      (note) => setPlayedNotes(addNote(note)),
      (note) => setPlayedNotes(removeNote(note))
    );
    const cleanup = listen(
      (note) => {
        if (!notesRef.current.includes(note)) {
          trigger(note);
        }
        setPlayedNotes((notes) => {
          const newNotes = addNote(note)(notes);
          notesRef.current = newNotes;
          return newNotes;
        });
      },
      (note) => {
        release(note);
        setPlayedNotes((notes) => {
          const newNotes = removeNote(note)(notes);
          notesRef.current = newNotes;
          return newNotes;
        });
      }
    );
    return () => {
      cleanupMidi();
      cleanup();
    };
  }, [trigger, release]);
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
    const cleanupMidi = listenToMidi(
      (note) => timedNotesQueueRef.current.start(note),
      (note) => timedNotesQueueRef.current.stop(note)
    );
    const cleanup = listen(
      (note) => timedNotesQueueRef.current.start(note),
      (note) => timedNotesQueueRef.current.stop(note)
    );
    return () => {
      cleanupMidi();
      cleanup();
    }
  }, []);
  return timedNotesQueueRef;
}
