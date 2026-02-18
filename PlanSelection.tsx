import { useState } from "react";
import { plans } from "../data/plans";
import { CarnavalBanner } from "../components/CarnavalBanner";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

interface Props {
  onNext: (planId: string) => void;
}

export function PlanSelection({ onNext }: Props) {
  const [selected, setSelected] = useState("premium");
  const plan = plans.find((p) => p.id === selected)!;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <CarnavalBanner />
      <Header />

      <div className="flex-1">
        <div className="max-w-[600px] mx-auto px-5 py-6">
          <p className="text-[13px] uppercase tracking-wide text-gray-700">
            Passo <strong>2</strong> de <strong>3</strong>
          </p>
          <h1 className="text-2xl font-bold mt-2 mb-5">
            Escolha o melhor plano para você
          </h1>

          {/* Plan Cards */}
          <div className="flex gap-2.5 mb-6">
            {plans.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelected(p.id)}
                className={`flex-1 rounded-lg p-3 text-left relative border transition-all duration-200 min-h-[80px] text-[12px] cursor-pointer ${
                  selected === p.id
                    ? "border-[#E50914] border-2 text-white"
                    : "border-gray-300 border text-gray-800"
                }`}
                style={
                  selected === p.id
                    ? { background: "linear-gradient(135deg, #1e3a8a 0%, #7e22ce 100%)" }
                    : {}
                }
              >
                <span className="font-bold text-[14px] block mb-1">{p.name}</span>
                {p.resolution}
                {selected === p.id && (
                  <div className="absolute bottom-2 right-2 bg-white text-blue-900 rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                    ✔
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Price Table */}
          <table className="w-full text-[14px] border-collapse">
            <tbody>
              {[
                {
                  label: "Preço mensal",
                  value: (
                    <span>
                      <span className="line-through text-gray-400 text-[12px] font-normal">
                        R$ {plan.originalPrice.toFixed(2).replace(".", ",")}
                      </span>
                      <br />
                      <span className="text-[#E50914] font-bold">
                        R$ {plan.price.toFixed(2).replace(".", ",")}
                      </span>
                    </span>
                  ),
                },
                { label: "Qualidade de vídeo e áudio", value: plan.quality },
                { label: "Resolução", value: plan.resolutionFull },
                {
                  label: "Áudio espacial (som imersivo)",
                  value: plan.audio,
                },
                { label: "Aparelhos compatíveis", value: plan.devices },
                {
                  label: "Aparelhos para assistir ao mesmo tempo",
                  value: String(plan.streams),
                },
                {
                  label: "Aparelhos de download",
                  value: String(plan.downloads),
                },
              ].map((row, i) => (
                <tr key={i} className="border-b border-gray-200">
                  <td className="py-4 text-gray-500 w-[60%]">{row.label}</td>
                  <td className="py-4 text-right font-bold text-gray-800">
                    {row.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="text-[11px] text-gray-500 mt-5 leading-relaxed">
            A disponibilidade das opções Full HD (1080p), Ultra HD (4K) e HDR está sujeita ao
            serviço de internet e à funcionalidade do aparelho. Nem todo conteúdo está disponível em
            todas as resoluções. Consulte os{" "}
            <a href="#" className="text-blue-600">
              Termos de Uso
            </a>{" "}
            para mais detalhes.
            <br />
            <br />
            Somente as pessoas que moram com você podem usar sua conta. A promoção de Carnaval é
            válida apenas para o primeiro mês de assinatura.
          </p>

          <button
            onClick={() => onNext(selected)}
            className="bg-[#E50914] text-white w-full py-4 text-lg font-bold rounded mt-6 hover:bg-red-700 transition-colors"
          >
            Próximo
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
