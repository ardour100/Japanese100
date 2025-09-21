export interface ProgressLevel {
  level: number;
  label: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
}

export const PROGRESS_LEVELS: ProgressLevel[] = [
  {
    level: 0,
    label: "Locked",
    description: "Word not learned yet",
    color: "bg-gray-100",
    bgColor: "bg-gray-100",
    borderColor: "border-gray-300",
    textColor: "text-gray-600"
  },
  {
    level: 20,
    label: "Discovered",
    description: "You've seen it, but can't really use it",
    color: "bg-red-100",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-700"
  },
  {
    level: 60,
    label: "Equipped",
    description: "You can recognize and sometimes use it",
    color: "bg-yellow-100",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    textColor: "text-yellow-700"
  },
  {
    level: 80,
    label: "Skilled",
    description: "You can actively use it, though not flawlessly",
    color: "bg-blue-100",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700"
  },
  {
    level: 100,
    label: "Mastered",
    description: "Word fully part of your arsenal",
    color: "bg-green-100",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-700"
  }
];

export interface KanjiProgress {
  [kanjiId: number]: number; // kanji ID -> progress level (0, 20, 60, 80, 100)
}

export const getProgressLevel = (progress: number): ProgressLevel => {
  return PROGRESS_LEVELS.find(level => level.level === progress) || PROGRESS_LEVELS[0];
};

export const getProgressColors = (progress: number) => {
  const level = getProgressLevel(progress);
  return {
    background: level.bgColor,
    border: level.borderColor,
    text: level.textColor,
    badge: level.color
  };
};