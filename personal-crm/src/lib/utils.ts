// Deterministic avatar color from name initial
const PALETTE = [
  { bg: "rgba(124,106,247,0.15)", text: "#b0a5ff" }, // indigo
  { bg: "rgba(74,171,121,0.15)",  text: "#6cd49e" }, // green
  { bg: "rgba(212,137,44,0.15)",  text: "#e8a84a" }, // amber
  { bg: "rgba(208,85,85,0.15)",   text: "#e88a8a" }, // red
  { bg: "rgba(82,162,219,0.15)",  text: "#7dbde8" }, // blue
];

export function avatarColor(name: string) {
  return PALETTE[name.charCodeAt(0) % PALETTE.length];
}
