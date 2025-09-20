export const SakuraIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2C12 2 8.5 4.5 8.5 8.5C8.5 9.88 9.12 11.12 10.12 12C9.12 12.88 8.5 14.12 8.5 15.5C8.5 19.5 12 22 12 22C12 22 15.5 19.5 15.5 15.5C15.5 14.12 14.88 12.88 13.88 12C14.88 11.12 15.5 9.88 15.5 8.5C15.5 4.5 12 2 12 2Z"
      fill="currentColor"
      opacity="0.7"
    />
    <path
      d="M2 12C2 12 4.5 8.5 8.5 8.5C9.88 8.5 11.12 9.12 12 10.12C12.88 9.12 14.12 8.5 15.5 8.5C19.5 8.5 22 12 22 12C22 12 19.5 15.5 15.5 15.5C14.12 15.5 12.88 14.88 12 13.88C11.12 14.88 9.88 15.5 8.5 15.5C4.5 15.5 2 12 2 12Z"
      fill="currentColor"
      opacity="0.5"
    />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
);

export const ToriiIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="6" width="20" height="2" fill="currentColor" opacity="0.8" />
    <rect x="1" y="8" width="22" height="1.5" fill="currentColor" opacity="0.6" />
    <rect x="5" y="9" width="2" height="12" fill="currentColor" opacity="0.7" />
    <rect x="17" y="9" width="2" height="12" fill="currentColor" opacity="0.7" />
    <rect x="4" y="14" width="4" height="1" fill="currentColor" opacity="0.5" />
    <rect x="16" y="14" width="4" height="1" fill="currentColor" opacity="0.5" />
  </svg>
);

export const SushiIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="12" cy="16" rx="10" ry="4" fill="currentColor" opacity="0.3" />
    <ellipse cx="12" cy="12" rx="8" ry="6" fill="currentColor" opacity="0.6" />
    <ellipse cx="12" cy="10" rx="6" ry="3" fill="currentColor" opacity="0.8" />
    <ellipse cx="12" cy="8" rx="4" ry="2" fill="currentColor" opacity="0.9" />
    <circle cx="9" cy="8" r="1" fill="currentColor" opacity="0.4" />
    <circle cx="15" cy="8" r="1" fill="currentColor" opacity="0.4" />
  </svg>
);

export const KoiIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M20 12C20 12 18 8 14 8C10 8 6 10 4 12C6 14 10 16 14 16C18 16 20 12 20 12Z"
      fill="currentColor"
      opacity="0.7"
    />
    <path
      d="M14 8C14 8 16 6 18 7C20 8 20 10 18 11C16 12 14 10 14 8Z"
      fill="currentColor"
      opacity="0.5"
    />
    <path
      d="M14 16C14 16 16 18 18 17C20 16 20 14 18 13C16 12 14 14 14 16Z"
      fill="currentColor"
      opacity="0.5"
    />
    <circle cx="16" cy="10" r="1" fill="currentColor" opacity="0.9" />
    <path
      d="M8 10C8 10 6 8 4 9C2 10 2 12 4 13C6 14 8 12 8 10Z"
      fill="currentColor"
      opacity="0.4"
    />
  </svg>
);

export const KimonoIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 3C10 3 8 4 8 6V8L6 10V20C6 21 7 22 8 22H16C17 22 18 21 18 20V10L16 8V6C16 4 14 3 12 3Z"
      fill="currentColor"
      opacity="0.6"
    />
    <path
      d="M8 8L10 6V4C10 3 11 2 12 2C13 2 14 3 14 4V6L16 8"
      fill="currentColor"
      opacity="0.8"
    />
    <rect x="10" y="10" width="4" height="2" fill="currentColor" opacity="0.4" />
    <rect x="9" y="14" width="6" height="1" fill="currentColor" opacity="0.3" />
    <rect x="8" y="17" width="8" height="1" fill="currentColor" opacity="0.3" />
  </svg>
);

export const DoraemonIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Head - blue circle */}
    <circle cx="12" cy="11" r="9" fill="currentColor" opacity="0.7" />

    {/* White face area */}
    <ellipse cx="12" cy="13" rx="6" ry="7" fill="currentColor" opacity="0.9" />

    {/* Eyes */}
    <circle cx="9.5" cy="9" r="1.8" fill="currentColor" opacity="0.95" />
    <circle cx="14.5" cy="9" r="1.8" fill="currentColor" opacity="0.95" />
    <circle cx="9.5" cy="8.5" r="0.8" fill="currentColor" opacity="0.3" />
    <circle cx="14.5" cy="8.5" r="0.8" fill="currentColor" opacity="0.3" />

    {/* Nose - red dot */}
    <circle cx="12" cy="11" r="0.8" fill="currentColor" opacity="0.8" />

    {/* Mouth */}
    <path
      d="M12 12 Q9 15 9 16 Q12 17 15 16 Q15 15 12 12"
      fill="currentColor"
      opacity="0.4"
    />

    {/* Whiskers */}
    <line x1="6" y1="11" x2="8.5" y2="11" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
    <line x1="6" y1="13" x2="8.5" y2="13" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
    <line x1="15.5" y1="11" x2="18" y2="11" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
    <line x1="15.5" y1="13" x2="18" y2="13" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />

    {/* Bell */}
    <ellipse cx="12" cy="17.5" rx="1.5" ry="1" fill="currentColor" opacity="0.8" />
    <circle cx="12" cy="17" r="0.3" fill="currentColor" opacity="0.9" />

    {/* Collar */}
    <rect x="8" y="19" width="8" height="1.5" rx="0.75" fill="currentColor" opacity="0.6" />

    {/* Body hint */}
    <ellipse cx="12" cy="22" rx="7" ry="2" fill="currentColor" opacity="0.4" />
  </svg>
);

export const PikachuIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Head */}
    <circle cx="12" cy="12" r="7" fill="currentColor" opacity="0.8" />

    {/* Ears */}
    <path d="M8 7 L6 3 L9 5 Z" fill="currentColor" opacity="0.7" />
    <path d="M16 7 L18 3 L15 5 Z" fill="currentColor" opacity="0.7" />
    <path d="M7 5 L5.5 3.5 L6.5 4.5 Z" fill="currentColor" opacity="0.9" />
    <path d="M17 5 L18.5 3.5 L17.5 4.5 Z" fill="currentColor" opacity="0.9" />

    {/* Eyes */}
    <circle cx="9.5" cy="10" r="1.2" fill="currentColor" opacity="0.9" />
    <circle cx="14.5" cy="10" r="1.2" fill="currentColor" opacity="0.9" />

    {/* Cheeks */}
    <circle cx="7" cy="12" r="1.5" fill="currentColor" opacity="0.6" />
    <circle cx="17" cy="12" r="1.5" fill="currentColor" opacity="0.6" />

    {/* Nose */}
    <circle cx="12" cy="12" r="0.3" fill="currentColor" opacity="0.9" />

    {/* Mouth */}
    <path d="M10 14 Q12 16 14 14" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.7" />

    {/* Tail hint */}
    <path d="M19 15 Q21 12 20 18 Q18 20 19 15" fill="currentColor" opacity="0.5" />
  </svg>
);

export const HelloKittyIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Head */}
    <ellipse cx="12" cy="12" rx="8" ry="7" fill="currentColor" opacity="0.8" />

    {/* Ears */}
    <circle cx="7" cy="7" r="2.5" fill="currentColor" opacity="0.7" />
    <circle cx="17" cy="7" r="2.5" fill="currentColor" opacity="0.7" />
    <circle cx="7" cy="7" r="1.2" fill="currentColor" opacity="0.9" />
    <circle cx="17" cy="7" r="1.2" fill="currentColor" opacity="0.9" />

    {/* Eyes */}
    <circle cx="9" cy="10" r="1" fill="currentColor" opacity="0.9" />
    <circle cx="15" cy="10" r="1" fill="currentColor" opacity="0.9" />

    {/* Nose */}
    <ellipse cx="12" cy="12" rx="0.8" ry="0.5" fill="currentColor" opacity="0.8" />

    {/* Bow */}
    <path d="M16 6 Q18 4 20 6 Q18 8 16 6" fill="currentColor" opacity="0.6" />
    <path d="M20 6 Q22 4 24 6 Q22 8 20 6" fill="currentColor" opacity="0.6" />
    <circle cx="20" cy="6" r="0.8" fill="currentColor" opacity="0.8" />

    {/* Whiskers */}
    <line x1="5" y1="11" x2="8" y2="11" stroke="currentColor" strokeWidth="0.4" opacity="0.7" />
    <line x1="5" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="0.4" opacity="0.7" />
    <line x1="16" y1="11" x2="19" y2="11" stroke="currentColor" strokeWidth="0.4" opacity="0.7" />
    <line x1="16" y1="13" x2="19" y2="13" stroke="currentColor" strokeWidth="0.4" opacity="0.7" />
  </svg>
);

export const DetectiveConanIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Head */}
    <circle cx="12" cy="12" r="8" fill="currentColor" opacity="0.7" />

    {/* Hair */}
    <path d="M6 8 Q8 4 12 5 Q16 4 18 8 Q16 6 12 6 Q8 6 6 8" fill="currentColor" opacity="0.8" />

    {/* Glasses frame */}
    <circle cx="9" cy="10" r="2.5" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.9" />
    <circle cx="15" cy="10" r="2.5" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.9" />
    <line x1="11.5" y1="10" x2="12.5" y2="10" stroke="currentColor" strokeWidth="0.8" opacity="0.9" />

    {/* Glasses lenses */}
    <circle cx="9" cy="10" r="2" fill="currentColor" opacity="0.3" />
    <circle cx="15" cy="10" r="2" fill="currentColor" opacity="0.3" />

    {/* Eyes behind glasses */}
    <circle cx="9" cy="10" r="0.8" fill="currentColor" opacity="0.9" />
    <circle cx="15" cy="10" r="0.8" fill="currentColor" opacity="0.9" />

    {/* Nose */}
    <circle cx="12" cy="12" r="0.4" fill="currentColor" opacity="0.8" />

    {/* Mouth */}
    <path d="M10 14 Q12 15 14 14" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.7" />

    {/* Bow tie */}
    <path d="M10 17 L12 16 L14 17 L12 18 Z" fill="currentColor" opacity="0.8" />
    <rect x="11.5" y="16.5" width="1" height="2" fill="currentColor" opacity="0.9" />
  </svg>
);