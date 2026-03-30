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
        <path
          d="M22 2 L40 9 L40 26 C40 37 32 46 22 50 C12 46 4 37 4 26 L4 9 Z"
          fill="none"
          stroke="#F57C00"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <line x1="22" y1="34" x2="22" y2="18" stroke="#F57C00" strokeWidth="2.5" strokeLinecap="round" />
        <polyline points="15,24 22,17 29,24" fill="none" stroke="#F57C00" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      </g>

      {/* REFORMA — navy blue */}
      <text
        x="52"
        y="36"
        fontFamily="'Plus Jakarta Sans', 'Inter', system-ui, sans-serif"
        fontWeight="800"
        fontSize="30"
        letterSpacing="2"
        fill="#0F1E35"
      >
        REFORMA{" "}
        {/* EM — orange */}
        <tspan fill="#F57C00">EM</tspan>
        {/* AÇÃO — navy blue */}
        <tspan fill="#0F1E35"> AÇÃO</tspan>
      </text>

      {/* Tagline */}
      <text
        x="53"
        y="56"
        fontFamily="'Inter', system-ui, sans-serif"
        fontWeight="400"
        fontSize="12"
        letterSpacing="0.5"
        fill="#64748b"
      >
        Preparação para IBS · CBS · IS
      </text>
    </svg>
  );
}
