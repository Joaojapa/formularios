import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function AutorizacaoRecebimento() {
  const { toast } = useToast();

  // 🔹 Estado que armazena todos os campos
  const [formData, setFormData] = useState<{ [key: string]: string }>({});

  // 🔹 Atualiza o estado ao digitar
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // 🔹 Carrega dados do localStorage ao abrir a página
  useEffect(() => {
    const savedData = localStorage.getItem("formRecebimentoData");
    if (savedData) setFormData(JSON.parse(savedData));
  }, []);

  // 🔹 Salva dados no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem("formRecebimentoData", JSON.stringify(formData));
  }, [formData]);

  // ✅ Gera PDF com campos visíveis (mantendo valores)
  const generatePDF = async () => {
  const element = document.querySelector("#form-recebimento");
  if (!element) return;

  // 🔹 Esconde temporariamente o botão de gerar PDF
  const pdfButton = element.querySelector("button");
  if (pdfButton) pdfButton.style.display = "none";

  toast({
    title: "Gerando PDF...",
    description: "Aguarde enquanto o formulário é processado.",
  });

  // 🔹 Substitui inputs/textarea por spans para renderização correta
  const inputs = element.querySelectorAll("input, textarea");
  const tempElements: { input: HTMLElement; span: HTMLElement }[] = [];

  inputs.forEach((input) => {
    const span = document.createElement("span");
    span.textContent = (input as HTMLInputElement | HTMLTextAreaElement).value;
    span.style.whiteSpace = "pre-wrap";
    span.style.wordBreak = "break-word";
    span.style.fontSize = window.getComputedStyle(input).fontSize;
    span.style.fontFamily = window.getComputedStyle(input).fontFamily;
    span.style.color = window.getComputedStyle(input).color;
    span.style.padding = "2px";
    span.style.display = "inline-block";
    span.style.border = "1px solid transparent";
    span.style.width = `${(input as HTMLElement).offsetWidth}px`;
    span.style.height = `${(input as HTMLElement).offsetHeight}px`;

    input.parentNode?.insertBefore(span, input);
    tempElements.push({ input: input as HTMLElement, span });
    (input as HTMLElement).style.display = "none";
  });

  // 🔹 Captura o conteúdo como imagem
  const canvas = await html2canvas(element as HTMLElement, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save("Autorizacao_Recebimento.pdf");

  // 🔹 Restaura inputs e botão
  tempElements.forEach(({ input, span }) => {
    input.style.display = "";
    span.remove();
  });

  if (pdfButton) pdfButton.style.display = "";

  toast({
    title: "Download concluído",
    description: "O PDF foi gerado com sucesso!",
  });

  // (Opcional) limpar storage depois do PDF:
  // localStorage.removeItem("formRecebimentoData");
};

  return (
    <div className="w-full p-4 flex justify-center">
      <div
        id="form-recebimento"
        className="border border-green-700 w-[900px] text-sm bg-white relative"
      >
        {/* Cabeçalho */}
        <div className="grid grid-cols-12 border border-green-700 mb-1">
          <div className="col-span-3 flex flex-col items-center justify-center border-r border-green-700 p-2">
            <img src="/SINPAF.png" alt="Logo SINPAF" className="w-16 h-16 object-contain mb-1" />
          </div>

          <div className="col-span-6 text-center p-2 border-r border-green-700">
            <div className="text-green-700 font-semibold text-sm">
              Sindicato Nacional dos Trabalhadores de Pesquisa e Desenvolvimento Agropecuário
            </div>
            <div className="text-left mt-1 text-green-700 font-semibold text-sm">
              SEÇÃO:
              <Input
                name="secao"
                value={formData.secao || ""}
                onChange={handleChange}
                className="inline w-10/12 h-6 border border-green-700 ml-2 text-sm rounded-none focus:outline-none focus:ring-0"
              />
            </div>
          </div>

          <div className="col-span-3 text-center p-2">
            <div className="text-red-600 font-bold text-sm">AUTORIZAÇÃO DE RECEBIMENTO - AR</div>
            <div className="flex justify-between text-green-700 text-sm mt-1">
              <div>
                Nº
                <Input
                  name="numero"
                  value={formData.numero || ""}
                  onChange={handleChange}
                  className="inline w-16 h-6 border border-green-700 ml-1 text-sm rounded-none focus:outline-none focus:ring-0"
                />
              </div>
              <div>
                ANO:
                <Input
                  name="ano"
                  value={formData.ano || ""}
                  onChange={handleChange}
                  className="inline w-16 h-6 border border-green-700 ml-1 text-sm rounded-none focus:outline-none focus:ring-0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Favorecido */}
        <div className="border border-green-700">
          <div className="bg-green-700 text-white text-sm px-2 py-1 font-semibold">DEPOSITANTE</div>

          <div className="grid grid-cols-2 border-t border-green-700 text-sm">
            <div className="border-r border-green-700 p-1">
              Nome:
              <Input
                name="nome"
                value={formData.nome || ""}
                onChange={handleChange}
                className="inline w-5/6 h-6 border border-green-700 ml-2 text-sm rounded-none focus:outline-none focus:ring-0"
              />
            </div>
            <div className="p-1">
              CPF/CNPJ:
              <Input
                name="cpf"
                value={formData.cpf || ""}
                onChange={handleChange}
                className="inline w-4/6 h-6 border border-green-700 ml-2 text-sm rounded-none focus:outline-none focus:ring-0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 border-t border-green-700 text-sm">
            <div className="border-r border-green-700 p-1">
              Endereço:
              <Input
                name="endereco"
                value={formData.endereco || ""}
                onChange={handleChange}
                className="inline w-5/6 h-6 border border-green-700 ml-2 text-sm rounded-none focus:outline-none focus:ring-0"
              />
            </div>
            <div className="p-1">
              Conta de recebimento
              <Input
                name="cidadeUF"
                value={formData.cidadeUF || ""}
                onChange={handleChange}
                className="inline w-4/6 h-6 border border-green-700 ml-2 text-sm rounded-none focus:outline-none focus:ring-0"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 border-t border-green-700 text-sm font-semibold">
            <div className="border-r border-green-700 p-1 flex items-center">
              <span className="whitespace-nowrap text-green-700">R$:</span>
              <Input
                name="banco"
                value={formData.banco || ""}
                onChange={handleChange}
                className="ml-2 flex-1 h-6 border border-green-700 text-sm rounded-none focus:outline-none focus:ring-0"
              />
            </div>
            <div className="border-r border-green-700 p-1 flex items-center">
              <span className="whitespace-nowrap text-green-700">Agência:</span>
              <Input
                name="agencia"
                value={formData.agencia || ""}
                onChange={handleChange}
                className="ml-2 flex-1 h-6 border border-green-700 text-sm rounded-none focus:outline-none focus:ring-0"
              />
            </div>
            <div className="p-1 flex items-center">
              <span className="whitespace-nowrap text-green-700">Por Extensão:</span>
              <Input
                name="bancoCidadeUF"
                value={formData.bancoCidadeUF || ""}
                onChange={handleChange}
                className="ml-2 flex-1 h-6 border border-green-700 text-sm rounded-none focus:outline-none focus:ring-0"
              />
            </div>
          </div>
        </div>

        {/* Histórico e Valor */}
        <div className="border border-green-700 mt-1">
          <div className="grid grid-cols-6 bg-green-50 border-b border-green-700 text-green-700 text-sm font-semibold">
            <div className="col-span-5 border-r border-green-700 p-1">Histórico</div>
            <div className="col-span-1 p-1 text-center">Valor</div>
          </div>
          <div className="grid grid-cols-6 text-sm">
            <div className="col-span-5 border-r border-green-700">
              <Textarea
                name="historico"
                value={formData.historico || ""}
                onChange={handleChange}
                className="w-full h-40 border-none resize-none text-sm rounded-none focus:outline-none focus:ring-0"
              />
            </div>
            <div className="col-span-1">
              <Textarea
                name="valor"
                value={formData.valor || ""}
                onChange={handleChange}
                className="w-full h-40 border-none resize-none text-sm text-right rounded-none focus:outline-none focus:ring-0"
              />
            </div>
          </div>
          <div className="grid grid-cols-6 border-t border-green-700 text-sm">
            <div className="col-span-5 border-r border-green-700 text-right p-1 font-semibold text-green-700">
              TOTAL
            </div>
            <div className="col-span-1 text-right p-1">
              <Input
                name="total"
                value={formData.total || ""}
                onChange={handleChange}
                className="w-full text-right border-none font-semibold text-sm rounded-none focus:outline-none focus:ring-0"
              />
            </div>
          </div>
        </div>

{/* Rodapé */}
<div className="grid grid-cols-4 border border-green-700 mt-2 text-sm">
  <div className="border-r border-green-700 text-center font-semibold text-green-700 p-1">
    AUTORIZO
  </div>
  <div className="border-r border-green-700 text-center p-1 text-[11px]"></div>
  <div className="border-r border-green-700 text-center font-semibold text-green-700 p-1"></div>
  <div className="text-center p-1 text-[11px]">
    Recebi a importância acima.
  </div>
</div>

<div className="grid grid-cols-4 border-x border-b border-green-700 text-sm">
  {/* Coluna 1 */}
  <div className="text-center p-4 border-r border-green-700">
    {/* Campo de data com calendário nativo */}
    <Input
      type="date"
      name="autorizoData"
      value={formData.autorizoData}
      onChange={handleChange}
      className="w-39 h-6 border border-green-700 text-xs text-center mx-auto"
    />
    <div className="text-green-700 mt-1 text-xs">Data</div>

    <div className="border-t border-green-700 mt-4 w-32 mx-auto" />
    <div className="text-green-700 mt-1 text-xs">Assinatura</div>
  </div>

  {/* Coluna 2 */}
  <div className="text-center p-4 border-r border-green-700">
    <div className="border-t border-green-700 mt-12 w-32 mx-auto" />
    <div className="text-green-700 mt-1 text-xs">Assinatura</div>
  </div>

  {/* Coluna 3 */}
  <div className="text-center p-4 border-r border-green-700">
    <Input
      name="rodapeLocal"
      value={formData.rodapeLocal}
      onChange={handleChange}
      placeholder="Cidade / Estado"
      className="w-39 h-6 border border-green-700 text-xs text-center mx-auto"
    />
    <div className="text-green-700 mt-1 text-xs">Local</div>
  </div>

  {/* Coluna 4 */}
  <div className="text-center p-4">
    <div className="border-t border-green-700 mt-4 w-32 mx-auto" />
    <div className="text-green-700 mt-1 text-xs">Assinatura</div>

    {/* Campo de data com calendário nativo */}
    <Input
      type="date"
      name="reciboData"
      value={formData.reciboData}
      onChange={handleChange}
      className="w-39 h-6 border border-green-700 text-xs text-center mx-auto mt-4"
    />
    <div className="text-green-700 mt-1 text-xs">Data</div>
  </div>
</div>


        {/* Botão download */}
        <div className="flex justify-end p-2 bg-white">
          <Button onClick={generatePDF}>
            <Download className="mr-2 h-4 w-4" /> Baixar PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
