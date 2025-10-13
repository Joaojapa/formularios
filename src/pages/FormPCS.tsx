import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Componente PCS - PRESTAÇÃO DE CONTAS DE SUPRIMENTO
// Arquivo pronto para colar no seu projeto React + Tailwind + shadcn/ui

export default function PCSForm() {
  const [formData, setFormData] = useState({
    secao: "",
    numero: "",
    ano: "",
    nome: "",
    cpfCnpj: "",
    cargo: "",
    cidadeEstado: "",
    agenciaCodigo: "",
    bancoNomeCodigo: "",
    contaCorrente: "",
    objetivo: "",
    valorEmRs: "",
    porExtenso: "",
    docHistorico: Array.from({ length: 8 }).map(() => ({ historico: "", valor: "" })),
    totalDespesas: "",
    observacao: "",
    valorSuprimento: "",
    despesasRealizadas: "",
    saldoReceber: false,
    saldoDevolver: false,
  });

  const formRef = useRef(null);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  }

  function handleDocChange(index, field, value) {
    setFormData((s) => {
      const arr = [...s.docHistorico];
      arr[index] = { ...arr[index], [field]: value };
      return { ...s, docHistorico: arr };
    });
  }

  // Gera PDF usando html2canvas + jsPDF
  const generatePDF = async () => {
    if (!formRef.current) return;
    const element = formRef.current;
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("PCS_Prestacao_Contas_Suprimento.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div
          ref={formRef}
          className="bg-white border-2 border-green-700 rounded-md max-w-6xl mx-auto p-2 text-[12px] text-green-800"
        >
          {/* Header */}
          <div className="grid grid-cols-12 border border-green-700">
            <div className="col-span-3 flex items-center justify-center border-r border-green-700 p-3">
              {/* Logo area similar to imagem */}
              <div className="text-center text-green-700 font-bold">
                <div className="text-2xl">SINPAF</div>
                <div className="text-xs">Filiação à CUT</div>
              </div>
            </div>

            <div className="col-span-6 p-2 border-r border-green-700">
              <div className="text-center font-bold text-sm text-green-700">
                Sindicato Nacional dos Trabalhadores de Pesquisa e Desenvolvimento
                Agropecuário
              </div>
              <div className="mt-1 text-sm text-green-700 font-semibold flex items-center">
                <span className="mr-2">PCS - PRESTAÇÃO DE CONTAS DE SUPRIMENTO</span>
              </div>
              <div className="mt-2 text-sm">
                <span className="font-semibold text-green-700">SEÇÃO:</span>
                <Input
                  name="secao"
                  value={formData.secao}
                  onChange={handleInputChange}
                  className="inline ml-2 h-6 w-1/2 text-sm border-green-700"
                />
              </div>
            </div>

            <div className="col-span-3 p-2">
              <div className="text-red-700 font-bold text-sm text-center">
                PCS - PRESTAÇÃO DE CONTAS DE SUPRIMENTO
              </div>
              <div className="flex justify-between text-green-700 text-sm mt-2">
                <div className="flex items-center">
                  <span className="mr-1">Número</span>
                  <Input
                    name="numero"
                    value={formData.numero}
                    onChange={handleInputChange}
                    className="h-6 w-20 text-sm border-green-700"
                  />
                </div>
                <div className="flex items-center">
                  <span className="mr-1">Ano</span>
                  <Input
                    name="ano"
                    value={formData.ano}
                    onChange={handleInputChange}
                    className="h-6 w-20 text-sm border-green-700"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main body with left vertical labels */}
          <div className="flex">
            {/* Left vertical labels column */}
            <div className="w-8 flex flex-col items-center mr-2">
              <div className=" mt-20 transform -rotate-90 text-xs font-bold text-green-700 tracking-widest">
                FAVORECIDO
              </div>
              <div className="mt-20 transform -rotate-90 text-xs font-bold text-green-700 tracking-widest">
                OBJETIVO
              </div>
            </div>

            <div className="flex-1">
              {/* Favorecido box */}
              <div className="border border-green-700 mb-1">
                <div className="bg-green-700 text-white px-2 py-1 font-semibold text-sm">FAVORECIDO</div>
                <div className="grid grid-cols-12 text-sm">
                  <div className="col-span-8 border-r border-green-700 p-2">
                    <div className="mb-1 font-semibold">Nome:</div>
                    <Input
                      name="nome"
                      value={formData.nome}
                      onChange={handleInputChange}
                      className="w-full h-8 text-sm border-green-700"
                    />
                  </div>
                  <div className="col-span-4 p-2">
                    <div className="mb-1 font-semibold">CPF/CNPJ:</div>
                    <Input
                      name="cpfCnpj"
                      value={formData.cpfCnpj}
                      onChange={handleInputChange}
                      className="w-full h-8 text-sm border-green-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-12 text-sm border-t border-green-700">
                  <div className="col-span-6 border-r border-green-700 p-2">
                    <div className="mb-1 font-semibold">Cargo:</div>
                    <Input
                      name="cargo"
                      value={formData.cargo}
                      onChange={handleInputChange}
                      className="w-full h-8 text-sm border-green-700"
                    />
                  </div>
                  <div className="col-span-6 p-2">
                    <div className="mb-1 font-semibold">Cidade/Estado</div>
                    <Input
                      name="cidadeEstado"
                      value={formData.cidadeEstado}
                      onChange={handleInputChange}
                      className="w-full h-8 text-sm border-green-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-12 text-sm border-t border-green-700">
                  <div className="col-span-4 border-r border-green-700 p-2">
                    <div className="mb-1 font-semibold">Agência (nome/código)</div>
                    <Input
                      name="agenciaCodigo"
                      value={formData.agenciaCodigo}
                      onChange={handleInputChange}
                      className="w-full h-8 text-sm border-green-700"
                    />
                  </div>
                  <div className="col-span-4 border-r border-green-700 p-2">
                    <div className="mb-1 font-semibold">Banco (nome/código)</div>
                    <Input
                      name="bancoNomeCodigo"
                      value={formData.bancoNomeCodigo}
                      onChange={handleInputChange}
                      className="w-full h-8 text-sm border-green-700"
                    />
                  </div>
                  <div className="col-span-4 p-2">
                    <div className="mb-1 font-semibold">Conta Corrente</div>
                    <Input
                      name="contaCorrente"
                      value={formData.contaCorrente}
                      onChange={handleInputChange}
                      className="w-full h-8 text-sm border-green-700"
                    />
                  </div>
                </div>
              </div>

              {/* Objetivo box */}
              <div className="border border-green-700 mb-1 p-2 min-h-[52px]">
                <div className="font-semibold text-sm text-green-700 mb-1">OBJETIVO</div>
                <Textarea
                  name="objetivo"
                  value={formData.objetivo}
                  onChange={handleInputChange}
                  className="w-full h-20 resize-none border-green-700 text-sm"
                />
              </div>

              {/* Valor em R$ / Por Extenso */}
              <div className="grid grid-cols-12 gap-2 mb-1">
                <div className="col-span-6 border border-green-700 p-2">
                  <div className="font-semibold text-green-700 text-sm">Valor em R$</div>
                  <Input
                    name="valorEmRs"
                    value={formData.valorEmRs}
                    onChange={handleInputChange}
                    className="w-1/2 h-8 text-sm border-green-700 mt-1"
                  />
                </div>
                <div className="col-span-6 border border-green-700 p-2">
                  <div className="font-semibold text-green-700 text-sm">Por extenso:</div>
                  <Input
                    name="porExtenso"
                    value={formData.porExtenso}
                    onChange={handleInputChange}
                    className="w-full h-8 text-sm border-green-700 mt-1"
                  />
                </div>
              </div>

              {/* Demonstrativo das Despesas table */}
              <div className="border border-green-700">
                <div className="bg-green-50 text-center font-semibold text-green-700 py-1">Demonstrativo das Despesas</div>
                <div className="grid grid-cols-12 border-t border-green-700 text-sm font-semibold bg-green-50">
                  <div className="col-span-2 border-r border-green-700 p-2">Doc. Nº</div>
                  <div className="col-span-8 border-r border-green-700 p-2">Histórico</div>
                  <div className="col-span-2 p-2 text-right">Valor em R$</div>
                </div>
                {/* rows 01..08 */}
                {formData.docHistorico.map((row, idx) => (
                  <div key={idx} className="grid grid-cols-12 border-t border-green-100 text-sm">
                    <div className="col-span-2 border-r border-green-700 p-2">{String(idx + 1).padStart(2, '0')}</div>
                    <div className="col-span-8 border-r border-green-700 p-2">
                      <Textarea
                        value={row.historico}
                        onChange={(e) => handleDocChange(idx, 'historico', e.target.value)}
                        className="w-full h-10 resize-none border-none text-sm"
                      />
                    </div>
                    <div className="col-span-2 p-2 text-right">
                      <Input
                        value={row.valor}
                        onChange={(e) => handleDocChange(idx, 'valor', e.target.value)}
                        className="w-full h-8 text-sm text-right border-green-700"
                      />
                    </div>
                  </div>
                ))}

                <div className="grid grid-cols-12 border-t border-green-700 text-sm font-semibold">
                  <div className="col-span-10 p-2 text-right">Total de Despesas Realizadas:</div>
                  <div className="col-span-2 p-2 text-right">{formData.totalDespesas}</div>
                </div>
              </div>

              {/* Observação / Valores de Suprimento */}
              <div className="grid grid-cols-12 gap-2 mt-1">
                <div className="col-span-8 border border-green-700 p-2">
                  <div className="font-semibold text-green-700 text-sm">Observação:</div>
                  <Textarea
                    name="observacao"
                    value={formData.observacao}
                    onChange={handleInputChange}
                    className="w-full h-20 resize-none text-sm border-none"
                  />
                </div>
                <div className="col-span-4 border border-green-700 p-2">
                  <div className="font-semibold text-green-700 text-sm">Valor do Suprimento</div>
                  <Input
                    name="valorSuprimento"
                    value={formData.valorSuprimento}
                    onChange={handleInputChange}
                    className="w-full h-8 text-sm mt-1 border-green-700"
                  />
                  <div className="mt-2 font-semibold text-green-700 text-sm">Despesas Realizadas</div>
                  <Input
                    name="despesasRealizadas"
                    value={formData.despesasRealizadas}
                    onChange={handleInputChange}
                    className="w-full h-8 text-sm mt-1 border-green-700"
                  />
                  <div className="mt-2 text-sm">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.saldoReceber}
                        onChange={(e) => setFormData(s => ({ ...s, saldoReceber: e.target.checked }))}
                      />
                      <span>- Receber</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="checkbox"
                        checked={formData.saldoDevolver}
                        onChange={(e) => setFormData(s => ({ ...s, saldoDevolver: e.target.checked }))}
                      />
                      <span>- Devolver</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer approvals / recibo */}
              <div className="grid grid-cols-4 border border-green-700 mt-2 text-sm">
                <div className="border-r border-green-700 p-3 text-center font-semibold text-green-700">Emitente</div>
                <div className="border-r border-green-700 p-3 text-center">Atesto que os serviços foram prestados em favor do SINPAF</div>
                <div className="border-r border-green-700 p-3 text-center font-semibold text-green-700">Conferência / Aprovação</div>
                <div className="p-3 text-center">Recebi a importância acima<br/>____/____/____ Data</div>
              </div>

              <div className="grid grid-cols-4 border-x border-b border-green-700 text-sm">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="text-center p-6 border-r border-green-700 last:border-r-0">
                    <div className="border-t border-dotted border-green-700 mt-5" />
                    <div className="text-green-700 mt-2">Assinatura</div>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* PDF Button */}
          <div className="mt-4 flex justify-center">
            <Button size="lg" onClick={generatePDF} className="gap-2">
              <Download className="w-4 h-4" /> Salvar como PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
