import colors from "nice-color-palettes";

export const OBJECT_SIZE = 1;

export const COLORS = colors[6];

export const ALL_NOTES = [
  1, 1.5, 2, 2.5, 3, 4, 4.5, 5, 5.5, 6, 6.5, 7, 8,
] as const;

export type NoteType = typeof ALL_NOTES[number];
export type SongType = Array<Array<{ note: NoteType; duration: number }>>;

export const KEYCODES_TO_NOTES: Record<string, NoteType> = {
  KeyA: 1,
  KeyW: 1.5,
  KeyS: 2,
  KeyE: 2.5,
  KeyD: 3,
  KeyF: 4,
  KeyT: 4.5,
  KeyG: 5,
  KeyY: 5.5,
  KeyH: 6,
  KeyU: 6.5,
  KeyJ: 7,
  KeyK: 8,
};

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

export const SONG = HAPPY_BIRTHDAY;
