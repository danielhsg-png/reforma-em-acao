interface AppLogoProps {
  className?: string;
}

export default function AppLogo({ className = "" }: AppLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 450 72"
      aria-label="INTEGRIDADE DIGITAL"
      role="img"
      className={className}
      style={{ display: "block" }}
    >
      {/* Modern Shield Icon */}
      <g transform="translate(0, 4)">
        <path
          d="M26 4 L48 12 L48 30 C48 44 38 56 26 62 C14 56 4 44 4 30 L4 12 Z"
          fill="none"
          stroke="#F59E0B"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path 
          d="M18 32 L24 38 L34 26" 
          fill="none" 
          stroke="#F59E0B" 
          strokeWidth="3.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </g>

      {/* Main Text — OLED White & Gold Accent */}
      <text
        x="68"
        y="42"
        fontFamily="'IBM Plex Sans', system-ui, sans-serif"
        fontWeight="800"
        fontSize="32"
        letterSpacing="-0.04em"
        fill="currentColor"
      >
        INTEGRIDADE{" "}
        <tspan fill="#F59E0B" className="italic font-bold">DIGITAL</tspan>
      </text>

      {/* Tagline */}
      <text
        x="69"
        y="64"
        fontFamily="'IBM Plex Sans', system-ui, sans-serif"
        fontWeight="600"
        fontSize="11"
        letterSpacing="0.2em"
        fill="#94a3b8"
      >
        REFORMA EM AÇÃO · {new Date().getFullYear()}
      </text>
    </svg>
  );
}
