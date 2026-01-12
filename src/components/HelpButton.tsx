interface HelpButtonProps {
  onClick: () => void;
}

export function HelpButton({ onClick }: HelpButtonProps) {
  return (
    <button
      className="help-button"
      onClick={onClick}
      title="What's new & Roadmap"
    >
      ?
    </button>
  );
}
