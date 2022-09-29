import colors from "nice-color-palettes";

export const OBJECT_SIZE = 1;

export const COLORS = colors[6];

export const ALL_NOTES = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export type NoteType = typeof ALL_NOTES[number];
export type SongType = Array<Array<NoteType>>;

export const KEYCODES_TO_NOTES: Record<string, NoteType> = {
  KeyA: 1,
  KeyS: 2,
  KeyD: 3,
  KeyF: 4,
  KeyG: 5,
  KeyH: 6,
  KeyJ: 7,
  KeyK: 8,
};

export function isNote(element: unknown): element is NoteType {
  const all_notes: ReadonlyArray<unknown> = ALL_NOTES;
  return all_notes.includes(element);
}

export function minMax(song: SongType): [NoteType, NoteType] {
  const low = Math.min(...song.flat());
  const high = Math.max(...song.flat());
  return [
    isNote(low) ? low : ALL_NOTES[0],
    isNote(high) ? high : ALL_NOTES[ALL_NOTES.length - 1],
  ];
}

// prettier-ignore
const TEST: SongType = [
  [1, 2], [], [3, 4], [], [5], [6], [7], [8],
  [8], [7], [6], [5], [4], [3], [2], [1],
  [1], [2], [3], [4], [5], [6], [7], [8],
  [8], [7], [6], [5], [4], [3], [2], [1],
  [1], [2], [3], [4], [5], [6], [7], [8],
  [8], [7], [6], [5], [4], [3], [2], [1],
]

export const SONG = TEST;
