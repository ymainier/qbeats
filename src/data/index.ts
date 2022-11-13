export const OBJECT_SIZE = 1;

const ALL_COLORS = [
  "#120a1a", "#2a2a41", "#404863", "#59607a", "#787d8b",
  "#9da5ae", "#c8d6ac", "#feffe5", "#e4cd5a", "#d49733",
  "#d68552", "#be5a1e", "#894835", "#602631", "#4b0c30",
  "#81173f", "#cc1825", "#dc4926", "#f1934c", "#fad5af",
  "#ed9d7c", "#d16363", "#b7ab76", "#b59857", "#926d3c",
  "#8b5b37", "#ff82a0", "#ff26a8", "#422490", "#2749d0",
  "#4477ff", "#4cc5e4", "#8bf5c6", "#85c448", "#439d40",
  "#29694e",
];

export const GROUND_COLOR = "#439d40";
export const SEGMENT_COLOR = "#29694e";
export const SKY_COLOR = "#4cc5e4";
export const SUCCESS_COLOR = "#85c448";
export const FAILURE_COLOR = "#dc4926";
export const NOTE_COLORS = ALL_COLORS.slice(8, 33);

export function shuffle<T>(array: Array<T>): Array<T> {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}


export const ALL_NOTES = [
  1, 1.5, 2, 2.5, 3, 4, 4.5, 5, 5.5, 6, 6.5, 7, 8,
] as const;

export type NoteType = typeof ALL_NOTES[number];
export type SongType = Array<Array<{ note: NoteType; duration: number }>>;

// prettier-ignore
export const KEYCODES_TO_NOTES: Record<string, NoteType> = {
  KeyA: 1, KeyW: 1.5, KeyS: 2, KeyE: 2.5, KeyD: 3,
  KeyF: 4, KeyT: 4.5, KeyG: 5, KeyY: 5.5, KeyH: 6, KeyU: 6.5, KeyJ: 7,
  KeyK: 8,
};

// prettier-ignore
export const NOTE_TO_TONE: Record<NoteType, string> = {
  1: "C4", 1.5: "C#4",
  2: "D4",
  2.5: "D#4", 3: "E4",
  4: "F4", 4.5: "F#4",
  5: "G4", 5.5: "G#4",
  6: "A4", 6.5: "A#4",
  7: "B4",
  8: "C5",
};

const TONE_TO_NOTE = (Object.entries(NOTE_TO_TONE) as any)
  // @ts-ignore
  .reduce((soFar, [note, tone]) => {
    soFar[tone] = Number(note);
    return soFar;
  }, {});

export function midiNoteToNote({
  name,
  accidental,
  octave,
}: {
  name: string;
  accidental: string;
  octave: number;
}): NoteType | undefined {
  const tone = `${name}${accidental ?? ""}${octave}`;
  return TONE_TO_NOTE[tone];
}

export function isNote(element: unknown): element is NoteType {
  const all_notes: ReadonlyArray<unknown> = ALL_NOTES;
  return all_notes.includes(element);
}

export function minMax(song: SongType): [NoteType, NoteType] {
  const low = Math.min(...song.flat().map(({ note }) => note));
  const high = Math.max(...song.flat().map(({ note }) => note));
  return [
    isNote(low) ? low : ALL_NOTES[0],
    isNote(high) ? high : ALL_NOTES[ALL_NOTES.length - 1],
  ];
}

const EVERY_WHITE_NOTES: SongType = [
  [], [], [], [],
  [{note: 1, duration: 1}], [{note: 2, duration: 1}], [{note: 3, duration: 1}], [{note: 4, duration: 1}],
  [{note: 5, duration: 1}], [{note: 6, duration: 1}], [{note: 7, duration: 1}], [{note: 8, duration: 1}],
  [{note: 7, duration: 1}], [{note: 6, duration: 1}], [{note: 5, duration: 1}], [{note: 4, duration: 1}],
  [{note: 3, duration: 1}], [{note: 2, duration: 1}], [{note: 1, duration: 1}], [],
  [], [], [], [],
];

// prettier-ignore
const HAPPY_BIRTHDAY: SongType = [
  [], [], [], [], [{note: 1, duration: 1}], [{note: 1, duration: 1}],
  [{note: 2, duration: 2}], [], [{note: 1, duration: 2}], [], [{note: 4, duration: 2}], [],
  [{note: 3, duration: 4}], [], [], [], [{note: 1, duration: 1}], [{note: 1, duration: 1}],
  [{note: 2, duration: 2}], [], [{note: 1, duration: 2}], [], [{note: 5, duration: 2}], [],
  [{note: 4, duration: 4}], [], [], [], [{note: 1, duration: 1}], [{note: 1, duration: 1}],
  [{note: 8, duration: 2}], [], [{note: 6, duration: 2}], [], [{note: 4, duration: 2}], [],
  [{note: 3, duration: 2}], [], [{note: 2, duration: 2}], [], [{note: 6.5, duration: 1}], [{note: 6.5, duration: 1}],
  [{note: 6, duration: 2}], [], [{note: 4, duration: 2}], [], [{note: 5, duration: 2}], [],
  [{note: 4, duration: 4}], [], [], [], [], [],
];

// prettier-ignore
const ONE_NOTE: SongType = [
  [], [], [{note: 1, duration: 1}], [], []
];

export const SONGS: Array<SongType> = [EVERY_WHITE_NOTES, ONE_NOTE, HAPPY_BIRTHDAY];
