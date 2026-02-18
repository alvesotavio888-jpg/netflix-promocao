import { plans } from "../data/plans";
import { CarnavalBanner } from "../components/CarnavalBanner";
import { Footer } from "../components/Footer";
import type { CheckoutData } from "./Checkout";

interface Props {
  planId: string;
  checkoutData: CheckoutData;
  onRestart: () => void;
}

export function Confirmation({ planId, checkoutData, onRestart }: Props) {
  const plan = plans.find((p) => p.id === planId)!;

  const methodLabel = {
    card: "Cartão de Crédito",
    pix: "PIX",
    boleto: "Boleto Bancário",
  }[checkoutData.paymentMethod];

  const maskedCard = checkoutData.cardNumber
    ? "**** **** **** " + checkoutData.cardNumber.replace(/\s/g, "").slice(-4)
    : null;

  const fullName = [checkoutData.firstName, checkoutData.lastName].filter(Boolean).join(" ");

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <CarnavalBanner />

      {/* Header */}
      <header className="flex justify-between items-center px-6 py-3 border-b border-gray-200">
        <div className="text-[#E50914] text-[28px] font-black tracking-tight select-none">
          NETFLIX
        </div>
        <button onClick={onRestart} className="text-[#333] font-semibold text-[14px] hover:underline">
          Sair
        </button>
      </header>

      <div className="flex-1">
        <div className="max-w-[440px] mx-auto px-4 py-10">
          {/* Success Icon */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-[#E50914] flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-[23px] font-bold text-[#333] mb-2">
              Bem-vindo à Netflix!
            </h1>
            <p className="text-[14px] text-[#737373] max-w-sm">
              Tudo pronto. Sua assinatura foi ativada com sucesso. Agora é só curtir.
            </p>
          </div>

          {/* Order Summary */}
          <div className="bg-white border border-[#ccc] rounded-[4px] overflow-hidden mb-5">
            <div className="p-4 border-b border-gray-200 bg-[#f3f3f3]">
              <p className="text-[14px] font-bold text-[#333]">Resumo da assinatura</p>
            </div>
            <div className="p-4">
              <table className="w-full text-[14px]">
                <tbody>
                  {[
                    { label: "Plano", value: plan.name },
                    { label: "Resolução", value: plan.resolutionFull },
                    {
                      label: "Valor mensal",
                      value: (
                        <span className="text-[#333] font-bold">
                          R$ {plan.price.toFixed(2).replace(".", ",")}
                        </span>
                      ),
                    },
                    { label: "Pagamento", value: methodLabel },
                    ...(maskedCard ? [{ label: "Cartão", value: maskedCard }] : []),
                    ...(fullName ? [{ label: "Titular", value: fullName }] : []),
                    {
                      label: "E-mail",
                      value: checkoutData.email || "—",
                    },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-gray-100 last:border-0">
                      <td className="py-3 text-[#737373]">{row.label}</td>
                      <td className="py-3 text-right font-semibold text-[#333]">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Discount reminder */}
          <div className="bg-[#fff8f0] border border-[#f0d0a0] rounded-[4px] p-4 mb-5">
            <div className="flex items-start gap-2">
              <span className="text-lg">🎉</span>
              <div>
                <p className="text-[13px] font-semibold text-[#333]">Promoção de Carnaval aplicada!</p>
                <p className="text-[12px] text-[#737373] mt-0.5">
                  Você está pagando R$ {plan.price.toFixed(2).replace(".", ",")} no primeiro mês.
                  Após esse período, o valor volta a ser R$ {plan.originalPrice.toFixed(2).replace(".", ",")}/mês.
                </p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white border border-[#ccc] rounded-[4px] p-4 mb-6">
            <h3 className="font-bold text-[14px] text-[#333] mb-3">Próximos passos</h3>
            <ul className="space-y-3">
              {[
                "Você receberá um e-mail de confirmação com os detalhes da sua assinatura.",
                "Acesse netflix.com e entre com seu e-mail para começar a assistir.",
                "Baixe o app da Netflix na sua smart TV, celular ou tablet.",
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[13px] text-[#333]">
                  <div className="w-5 h-5 rounded-full bg-[#E50914] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-[11px] font-bold">{i + 1}</span>
                  </div>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={onRestart}
            className="bg-[#E50914] text-white w-full py-[14px] text-[16px] font-semibold rounded-[4px] hover:bg-[#c11119] transition-colors"
          >
            Começar a assistir
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
