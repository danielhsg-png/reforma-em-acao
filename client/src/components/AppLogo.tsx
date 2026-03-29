interface AppLogoProps {
  className?: string;
}

export default function AppLogo({ className = "" }: AppLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 340 72"
      aria-label="REFORMA EM AÇÃO"
      role="img"
      className={className}
      style={{ display: "block" }}
    >
      {/* Shield icon */}
      <g transform="translate(0, 4)">
        {/* Shield body */}
        <path
          d="M22 2 L40 9 L40 26 C40 37 32 46 22 50 C12 46 4 37 4 26 L4 9 Z"
          fill="none"
          stroke="#f97316"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* Upward arrow inside shield */}
        <line x1="22" y1="34" x2="22" y2="18" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
        <polyline points="15,24 22,17 29,24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      </g>

      {/* Main wordmark — "REFORMA" white + "EM AÇÃO" orange */}
      <text
        x="52"
        y="36"
        fontFamily="'Plus Jakarta Sans', 'Inter', system-ui, sans-serif"
        fontWeight="800"
        fontSize="30"
        letterSpacing="2"
        fill="#ffffff"
      >
        REFORMA{" "}
        <tspan fill="#f97316">EM AÇÃO</tspan>
      </text>

      {/* Tagline */}
      <text
        x="53"
        y="56"
        fontFamily="'Inter', system-ui, sans-serif"
        fontWeight="400"
        fontSize="12"
        letterSpacing="0.5"
        fill="#94a3b8"
      >
        Preparação para IBS · CBS · IS
      </text>
    </svg>
  );
}
