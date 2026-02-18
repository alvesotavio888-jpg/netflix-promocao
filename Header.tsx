interface HeaderProps {
  onSair?: () => void;
}

export function Header({ onSair }: HeaderProps) {
  return (
    <header className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
      <div className="text-[#E50914] text-3xl font-black tracking-tight select-none">
        NETFLIX
      </div>
      <button
        onClick={onSair}
        className="text-gray-700 font-bold text-sm hover:underline"
      >
        Sair
      </button>
    </header>
  );
}
