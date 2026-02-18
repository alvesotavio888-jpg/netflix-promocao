export function Footer() {
  return (
    <footer className="bg-[#f3f3f3] py-8 px-5 mt-12 text-[13px] text-gray-500">
      <p>Dúvidas? Ligue para 0800 591 8943 (ligação grátis)</p>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
        {["Perguntas frequentes", "Central de Ajuda", "Termos de Uso", "Privacidade"].map((l) => (
          <a key={l} href="#" className="text-gray-500 hover:underline">
            {l}
          </a>
        ))}
      </div>
    </footer>
  );
}
