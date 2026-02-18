export function CarnavalBanner() {
  return (
    <div
      className="text-white text-center py-2.5 font-bold text-xs uppercase tracking-widest"
      style={{
        background: "linear-gradient(90deg, #ff0080, #7928ca, #ff0080)",
        backgroundSize: "200% 200%",
        animation: "gradientAnim 3s ease infinite",
      }}
    >
      <style>{`
        @keyframes gradientAnim {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      🎉 Oferta Especial de Carnaval: 50% OFF em qualquer plano! 🎊
    </div>
  );
}
