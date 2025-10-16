import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useToast } from "@/components/ui/use-toast";

const FormAP = () => {
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    secao: "",
    numero: "",
    ano: "",
    nome: "",
    cpfCnpj: "",
    endereco: "",
    cidadeUf: "",
    banco: "",
    agencia: "",
    cidadeUfBanco: "",
    historico: "",
    valor: "",
    total: "",
    dataRecebimento: "", // ✅ Novo campo de data
  });

  const formRef = useRef<HTMLFormElement | null>(null);

  // ✅ Carrega dados salvos do localStorage ao montar o componente
  useEffect(() => {
    const savedData = localStorage.getItem("formData_AP");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  // ✅ Salva automaticamente no localStorage quando o formData muda
  useEffect(() => {
    localStorage.setItem("formData_AP", JSON.stringify(formData));
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Gera o PDF (com substituição e restauração dos inputs)
  const generatePDF = async () => {
    const element = formRef.current;
    if (!element) return;

    toast({
      title: "Gerando PDF...",
      description: "Aguarde enquanto o formulário é processado.",
    });

    const inputs = element.querySelectorAll("input, textarea");
    const tempElements: { input: HTMLElement; span: HTMLElement }[] = [];

    inputs.forEach((input) => {
      const span = document.createElement("span");
      let value = (input as HTMLInputElement | HTMLTextAreaElement).value;

      // ✅ Formata a data para DD/MM/AAAA no PDF
      if ((input as HTMLInputElement).type === "date" && value) {
        const [yyyy, mm, dd] = value.split("-");
        value = `${dd}/${mm}/${yyyy}`;
      }

      span.textContent = value;
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
    pdf.save("Autorizacao_Pagamento.pdf");

    tempElements.forEach(({ input, span }) => {
      input.style.display = "";
      span.remove();
    });

    toast({
      title: "Download concluído!",
      description: "O PDF foi gerado com sucesso.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <form
          ref={formRef}
          id="form-recebimento"
          className="bg-white border border-green-700 p-4 rounded-md max-w-5xl mx-auto"
        >
          {/* Cabeçalho */}
          <div className="grid grid-cols-12 border border-green-700 mb-1">
            <div className="col-span-3 flex flex-col items-center justify-center border-r border-green-700 p-2">
              <img
                src="/SINPAF.png"
                alt="Logo SINPAF"
                className="w-16 h-16 object-contain mb-1"
              />
            </div>

            <div className="col-span-6 text-center p-2 border-r border-green-700">
              <div className="text-green-700 font-semibold text-sm">
                Sindicato Nacional dos Trabalhadores de Pesquisa e Desenvolvimento Agropecuário
              </div>
              <div className="text-left mt-1 text-green-700 font-semibold text-sm">
                SEÇÃO:
                <Input
                  name="secao"
                  value={formData.secao}
                  onChange={handleInputChange}
                  className="inline w-2/3 h-6 border border-green-700 ml-2 text-sm"
                />
              </div>
            </div>

            <div className="col-span-3 text-center p-2">
              <div className="text-red-600 font-bold text-sm">
                AUTORIZAÇÃO DE PAGAMENTO - AP
              </div>
              <div className="flex justify-between text-green-700 text-sm mt-1">
                <div>
                  Nº
                  <Input
                    name="numero"
                    value={formData.numero}
                    onChange={handleInputChange}
                    className="inline w-16 h-6 border border-green-700 ml-1 text-sm"
                  />
                </div>
                <div>
                  ANO:
                  <Input
                    name="ano"
                    value={formData.ano}
                    onChange={handleInputChange}
                    className="inline w-16 h-6 border border-green-700 ml-1 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Favorecido */}
          <div className="border border-green-700">
            <div className="bg-green-700 text-white text-sm px-2 py-1 font-semibold">
              FAVORECIDO
            </div>
            <div className="grid grid-cols-2 border-t border-green-700 text-sm">
              <div className="border-r border-green-700 p-1">
                Nome:
                <Input
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  className="inline w-5/6 h-6 border border-green-700 ml-2 text-sm"
                />
              </div>
              <div className="p-1">
                CPF/CNPJ:
                <Input
                  name="cpfCnpj"
                  value={formData.cpfCnpj}
                  onChange={handleInputChange}
                  className="inline w-4/6 h-6 border border-green-700 ml-2 text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 border-t border-green-700 text-sm">
              <div className="border-r border-green-700 p-1">
                Endereço:
                <Input
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleInputChange}
                  className="inline w-5/6 h-6 border border-green-700 ml-2 text-sm"
                />
              </div>
              <div className="p-1">
                Cidade/UF:
                <Input
                  name="cidadeUf"
                  value={formData.cidadeUf}
                  onChange={handleInputChange}
                  className="inline w-4/6 h-6 border border-green-700 ml-2 text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 border-t border-green-700 text-sm">
              <div className="border-r border-green-700 p-1">
                Banco/C.C.:
                <Input
                  name="banco"
                  value={formData.banco}
                  onChange={handleInputChange}
                  className="inline w-3/4 h-6 border border-green-700 ml-2 text-sm"
                />
              </div>
              <div className="border-r border-green-700 p-1">
                Agência:
                <Input
                  name="agencia"
                  value={formData.agencia}
                  onChange={handleInputChange}
                  className="inline w-3/4 h-6 border border-green-700 ml-2 text-sm"
                />
              </div>
              <div className="p-1">
                Cidade/UF:
                <Input
                  name="cidadeUfBanco"
                  value={formData.cidadeUfBanco}
                  onChange={handleInputChange}
                  className="inline w-3/4 h-6 border border-green-700 ml-2 text-sm"
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
                  value={formData.historico}
                  onChange={handleInputChange}
                  className="w-full h-40 border-none resize-none text-sm"
                />
              </div>
              <div className="col-span-1">
                <Textarea
                  name="valor"
                  value={formData.valor}
                  onChange={handleInputChange}
                  className="w-full h-40 border-none resize-none text-sm text-right"
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
                  value={formData.total}
                  onChange={handleInputChange}
                  className="w-full text-right border-none font-semibold text-sm"
                />
              </div>
            </div>
          </div>

          {/* Rodapé */}
          <div className="grid grid-cols-4 border border-green-700 mt-2 text-sm">
            <div className="border-r border-green-700 text-center font-semibold text-green-700 p-1">
              EMITENTE
            </div>
            <div className="border-r border-green-700 text-center p-1 text-[11px]">
              ATESTO QUE OS SERVIÇOS FORAM PRESTADOS EM FAVOR DO SINPAF
            </div>
            <div className="border-r border-green-700 text-center font-semibold text-green-700 p-1">
              APROVAÇÃO
            </div>

            {/* ✅ Campo de data com seletor */}
            <div className="text-center p-1 text-[11px]">
              Recebi o valor líquido constante acima
              <div className="flex items-center justify-center mt-1 gap-2">
                <Input
                  type="date"
                  name="dataRecebimento"
                  value={formData.dataRecebimento}
                  onChange={handleInputChange}
                  className="h-6 w-38 text-xs border border-green-700 text-center"
                />
                <span></span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 border-x border-b border-green-700 text-sm">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="text-center p-4 border-r border-green-700 last:border-r-0"
              >
                <div className="border-t border-dotted border-green-700 mt-4" />
                <div className="text-green-700 mt-1">Assinatura</div>
              </div>
            ))}
          </div>

          {/* Botão PDF */}
          <div className="mt-6 flex justify-center">
            <Button type="button" size="lg" className="gap-2" onClick={generatePDF}>
              <Download className="w-4 h-4" />
              Salvar como PDF
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormAP;
