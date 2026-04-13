interface AppLogoProps {
  className?: string;
}

export default function AppLogo({ className = "" }: AppLogoProps) {
  return (
    <>
      <img src="/logo-png-color.png" alt="Reforma em Ação" className={`block dark:hidden object-contain ${className}`} />
      <img src="/logo-png-branca.png" alt="Reforma em Ação" className={`hidden dark:block object-contain ${className}`} />
    </>
  );
}
