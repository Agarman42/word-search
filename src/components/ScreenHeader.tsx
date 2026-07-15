interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
}

export function ScreenHeader({ title, subtitle }: ScreenHeaderProps) {
  return (
    <header className="screen-header">
      <div className="screen-header-accent" />
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </header>
  );
}