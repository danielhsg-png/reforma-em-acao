interface AppLogoProps {
  className?: string;
}

export default function AppLogo({ className = "" }: AppLogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img 
        src="/logo.png" 
        alt="Reforma em Ação" 
        className="h-10 w-auto object-contain"
      />
    </div>
  );
}
