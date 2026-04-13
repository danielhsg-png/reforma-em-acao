interface AppLogoProps {
  className?: string;
  forceWhite?: boolean;
}

export default function AppLogo({ className = "", forceWhite = false }: AppLogoProps) {
  if (forceWhite) {
    return <img src="/logo-png-branca.png" alt="Reforma em Ação" className={`object-contain ${className}`} />;
  }

  return (
    <>
      <img src="/logo-png-color.png" alt="Reforma em Ação" className={`block dark:hidden object-contain ${className}`} />
      <img src="/logo-png-branca.png" alt="Reforma em Ação" className={`hidden dark:block object-contain ${className}`} />
    </>
  );
}
