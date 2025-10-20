import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function PCSForm() {
  const formRef = useRef(null);

  // ✅ 1. Carrega dados salvos (antes de renderizar)
  const saved = typeof window !== "undefined" ? localStorage.getItem("pcsFormData") : null;
  const savedData = saved ? JSON.parse(saved) : null;

  const [formData, setFormData] = useState(
    savedData || {
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
        dataEmitente: "",
  dataReciboDoc: "",
  dataConferencia: "",
  dataAprovacao: "",
  dataRecebimento: "",

    }
  );

  // ✅ 2. Salva automaticamente no localStorage sempre que muda
  useEffect(() => {
    localStorage.setItem("pcsFormData", JSON.stringify(formData));
  }, [formData]);

  // ✅ 3. Manipuladores de estado
  function handleInputChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((s) => ({
      ...s,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleDocChange(index, field, value) {
    setFormData((s) => {
      const arr = [...s.docHistorico];
      arr[index] = { ...arr[index], [field]: value };
      return { ...s, docHistorico: arr };
    });
  }

  // ✅ 4. Gera PDF mostrando os textos digitados
  const generatePDF = async () => {
  if (!formRef.current) return;
  const element = formRef.current;

  console.log("Gerando PDF... aguarde.");

  // 🔹 Esconde temporariamente o botão "Salvar como PDF"
  const pdfButton = element.querySelector("button");
  if (pdfButton) pdfButton.style.display = "none";

  // 🔹 Substitui inputs/textarea por spans (para capturar os textos)
  const inputs = element.querySelectorAll("input, textarea");
  const tempElements = [];

  inputs.forEach((input) => {
    const span = document.createElement("span");
    span.textContent = input.value;
    span.style.whiteSpace = "pre-wrap";
    span.style.wordBreak = "break-word";
    span.style.fontSize = window.getComputedStyle(input).fontSize;
    span.style.fontFamily = window.getComputedStyle(input).fontFamily;
    span.style.color = window.getComputedStyle(input).color;
    span.style.padding = "2px";
    span.style.display = "inline-block";
    span.style.border = "1px solid transparent";
    span.style.width = `${input.offsetWidth}px`;
    span.style.height = `${input.offsetHeight}px`;

    input.parentNode.insertBefore(span, input);
    tempElements.push({ input, span });
    input.style.display = "none";
  });

  // 🔹 Captura o formulário completo em alta resolução
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pdfWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  // Adiciona primeira página
  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pdfHeight;

  // Adiciona páginas subsequentes conforme necessário
  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
  }

  // 🔹 Salva o PDF
  pdf.save("PCS_Prestacao_Contas_Suprimento.pdf");

  // 🔹 Restaura inputs e botão
  tempElements.forEach(({ input, span }) => {
    input.style.display = "";
    span.remove();
  });

  if (pdfButton) pdfButton.style.display = "";

  console.log("✅ PDF gerado com sucesso!");
};

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div
          ref={formRef}
          className="bg-white border-2 border-green-700 rounded-md max-w-6xl mx-auto p-2 text-[12px] text-green-800"
        >
          <div className="grid grid-cols-12 border border-green-700">
            {/* Logo à esquerda */}
            <div className="col-span-3 border-r border-green-700 p-3 flex items-center justify-center">
              <div className="w-full text-center">
                <img src="/SINPAF.png" alt="logo" className="max-h-20 mx-auto mb-1" />
              </div>
            </div>

            <div className="col-span-6 p-2 border-r border-green-700">
              <div className="text-center font-bold text-sm text-green-700">
                Sindicato Nacional dos Trabalhadores de Pesquisa e Desenvolvimento Agropecuário
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
                  className="inline ml-2 h-6 w-10/12 text-sm border-green-700"
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

          {/* Corpo principal */}
          <div className="flex">
            {/* Coluna esquerda (rótulos verticais) */}
            <div className="w-8 flex flex-col items-center mr-2">
              <div className=" mt-20 transform -rotate-90 text-xs font-bold text-green-700 tracking-widest">
                FAVORECIDO
              </div>
              <div className="mt-20 transform -rotate-90 text-xs font-bold text-green-700 tracking-widest">
                OBJETIVO
              </div>
            </div>

            {/* Área principal */}
            <div className="flex-1">
              {/* Favorecido */}
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

              {/* Objetivo */}
              <div className="border border-green-700 mb-1 p-2 min-h-[52px]">
                <div className="font-semibold text-sm text-green-700 mb-1">OBJETIVO</div>
                <Textarea
                  name="objetivo"
                  value={formData.objetivo}
                  onChange={handleInputChange}
                  className="w-full h-20 resize-none border-green-700 text-sm"
                />
              </div>

              {/* Valor e por extenso */}
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

              {/* Demonstrativo das Despesas */}
              <div className="border border-green-700">
                <div className="bg-green-50 text-center font-semibold text-green-700 py-1">
                  Demonstrativo das Despesas
                </div>
                <div className="grid grid-cols-12 border-t border-green-700 text-sm font-semibold bg-green-50">
                  <div className="col-span-2 border-r border-green-700 p-2">Doc. Nº</div>
                  <div className="col-span-8 border-r border-green-700 p-2">Histórico</div>
                  <div className="col-span-2 p-2 text-right">Valor em R$</div>
                </div>
                {formData.docHistorico.map((row, idx) => (
                  <div key={idx} className="grid grid-cols-12 border-t border-green-100 text-sm">
                    <div className="col-span-2 border-r border-green-700 p-2">
                      {String(idx + 1).padStart(2, "0")}
                    </div>
                    <div className="col-span-8 border-r border-green-700 p-2">
                      <Textarea
                        value={row.historico}
                        onChange={(e) => handleDocChange(idx, "historico", e.target.value)}
                        className="w-full h-10 resize-none border-none text-sm"
                      />
                    </div>
                    <div className="col-span-2 p-2 text-right">
                      <Input
                        value={row.valor}
                        onChange={(e) => handleDocChange(idx, "valor", e.target.value)}
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

              {/* Observação / Valores */}
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

    {/* NOVO CAMPO ADICIONADO AQUI */}
    <div className="mt-2 font-semibold text-green-700 text-sm">Saldo a:</div>
    <Input
      name="saldoFinal"
      value={formData.saldoFinal}
      onChange={handleInputChange}
      className="w-full h-8 text-sm mt-1 border-green-700"
    />
    {/* FIM DO NOVO CAMPO */}

    <div className="mt-2 text-sm">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={formData.saldoReceber}
          onChange={(e) =>
            setFormData((s) => ({ ...s, saldoReceber: e.target.checked }))
          }
        />
        <span>- Receber</span>
      </div>
      <div className="flex items-center gap-2 mt-1">
        <input
          type="checkbox"
          checked={formData.saldoDevolver}
          onChange={(e) =>
            setFormData((s) => ({ ...s, saldoDevolver: e.target.checked }))
          }
        />
        <span>- Devolver</span>
      </div>
    </div>
  </div>
</div>



{/* Assinaturas */}
<div className="grid grid-cols-5 border border-green-700 mt-2 text-sm text-green-700 font-semibold">
  {/* Emitente */}
  <div className="border-r border-green-700 p-3 text-center">
    <div>Emitente</div>
    <Input
      type="date"
      name="dataEmitente"
      value={formData.dataEmitente}
      onChange={handleInputChange}
className="mt-2 w-39 h-6 border border-green-700 text-xs text-center mx-auto"
    />
    <div className="text-xs mt-1">Data</div>
  </div>

  {/* Recibo Doc. */}
  <div className="border-r border-green-700 p-3 text-center">
    <div>Recibo Doc.</div>
    <Input
      type="date"
      name="dataReciboDoc"
      value={formData.dataReciboDoc}
      onChange={handleInputChange}
      className="mt-2 w-39 h-6 border border-green-700 text-xs text-center mx-auto"
    />
    <div className="text-xs mt-1">Data</div>
  </div>

  {/* Conferência */}
  <div className="border-r border-green-700 p-3 text-center">
    <div>Conferência</div>
    <Input
      type="date"
      name="dataConferencia"
      value={formData.dataConferencia}
      onChange={handleInputChange}
className="mt-2 w-39 h-6 border border-green-700 text-xs text-center mx-auto"
    />
    <div className="text-xs mt-1">Data</div>
  </div>

  {/* Aprovação */}
  <div className="border-r border-green-700 p-3 text-center">
    <div>Aprovação</div>
    <Input
      type="date"
      name="dataAprovacao"
      value={formData.dataAprovacao}
      onChange={handleInputChange}
      className="mt-2 w-39 h-6 border border-green-700 text-xs text-center mx-auto"
    />
    <div className="text-xs mt-1">Data</div>
  </div>

  {/* Recebimento */}
  <div className="p-3 text-center">
    <div>Recebi a importância acima</div>
    <Input
      type="date"
      name="dataRecebimento"
      value={formData.dataRecebimento}
      onChange={handleInputChange}
      className="mt-2 w-39 h-6 border border-green-700 text-xs text-center mx-auto"
    />
    <div className="text-xs mt-1">Data</div>
  </div>
</div>

{/* Linhas de assinatura + local */}
<div className="grid grid-cols-5 border-x border-b border-green-700 text-sm">
  {[...Array(5)].map((_, i) => (
    <div
      key={i}
      className="text-center p-6 border-r border-green-700 last:border-r-0"
    >
      {/* Só mostra “Local” no último quadrado */}
      {i === 4 && (
        <>
          <div className="border-t border-dotted border-green-700 mt-2" />
          <div className="text-green-700 mt-1">Local</div>
        </>
      )}

      {/* Linha de Assinatura */}
      <div className="border-t border-dotted border-green-700 mt-5" />
      <div className="text-green-700 mt-2">Assinatura</div>
    </div>
  ))}
</div>



          {/* Botão PDF */}
          <div className="mt-4 flex justify-center">
            <Button size="lg" onClick={generatePDF} className="gap-2">
              <Download className="w-4 h-4" /> Salvar como PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
}
