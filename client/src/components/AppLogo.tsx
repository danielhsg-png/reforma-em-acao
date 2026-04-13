interface AppLogoProps {
  className?: string;
}

export default function AppLogo({ className = "" }: AppLogoProps) {
  return (
    <img 
      src="/logo.png" 
      alt="Reforma em Ação" 
      className={`object-contain ${className}`}
    />
  );
}
