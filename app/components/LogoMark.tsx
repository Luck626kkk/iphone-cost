interface LogoMarkProps {
  size?: number
}

export function LogoMark({ size = 120 }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="60" cy="60" r="60" fill="#1C1C1E" />
      <rect x="32" y="18" width="56" height="72" rx="3" fill="#FFFFFF" />
      <path
        d="M32 82 L32 90 L38 84 L44 90 L50 84 L56 90 L62 84 L68 90 L74 84 L80 90 L86 84 L88 90 L88 82 Z"
        fill="#FFFFFF"
      />
      <ellipse cx="79" cy="23" rx="13" ry="14" fill="#1C1C1E" />
      <path
        d="M79 9 Q85 4 84 10"
        stroke="#1C1C1E"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <rect x="40" y="32" width="28" height="2.5" rx="1.25" fill="#AEAEB2" />
      <rect x="40" y="40" width="36" height="2.5" rx="1.25" fill="#AEAEB2" />
      <rect x="40" y="48" width="30" height="2.5" rx="1.25" fill="#AEAEB2" />
      <rect x="40" y="56" width="36" height="2.5" rx="1.25" fill="#AEAEB2" />
      <rect x="38" y="64" width="44" height="1" fill="#D1D1D6" />
      <rect x="38" y="69" width="44" height="5" rx="2.5" fill="#FF9F0A" />
    </svg>
  )
}
