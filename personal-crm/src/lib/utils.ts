const PALETTE = [
  { bg: "rgba(124,106,247,0.15)", text: "#b0a5ff" }, // indigo
  { bg: "rgba(74,171,121,0.15)",  text: "#6cd49e" }, // green
  { bg: "rgba(212,137,44,0.15)",  text: "#e8a84a" }, // amber
  { bg: "rgba(208,85,85,0.15)",   text: "#e88a8a" }, // red
  { bg: "rgba(82,162,219,0.15)",  text: "#7dbde8" }, // blue
];

// djb2-style hash over full name — distributes across adjacent initials
function hash(name: string) {
  let h = 5381;
  for (let i = 0; i < name.length; i++) {
    h = ((h << 5) + h) ^ name.charCodeAt(i);
  }
  return Math.abs(h);
}

export function avatarColor(name: string) {
  return PALETTE[hash(name) % PALETTE.length];
}
