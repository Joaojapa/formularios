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
    dataRecebimento: "",
  });

  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    const savedData = localStorage.getItem("formData_AP");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("formData_AP", JSON.stringify(formData));
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const generatePDF = async () => {
    const element = formRef.current;
    if (!element) return;

    const pdfButton = element.querySelector("button") as HTMLElement | null;
    if (pdfButton) pdfButton.style.display = "none";

    toast({
      title: "Gerando PDF...",
      description: "Aguarde enquanto o formulário é processado.",
    });

    const inputs = element.querySelectorAll("input, textarea");
    const tempElements: { input: HTMLElement; span: HTMLElement }[] = [];

    inputs.forEach((input) => {
      const span = document.createElement("span");
      let value = (input as HTMLInputElement | HTMLTextAreaElement).value;

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

    if (pdfButton) pdfButton.style.display = "";

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
          className="bg-white border border-green-700 p-6 rounded-md max-w-5xl mx-auto"
        >
          {/* Cabeçalho */}
          <div className="grid grid-cols-12 border border-green-700 mb-4">
            <div className="col-span-3 flex flex-col items-center justify-center border-r border-green-700 p-3">
              <img
                src="/SINPAF.png"
                alt="Logo SINPAF"
                className="w-20 h-20 object-contain mb-1"
              />
            </div>

            <div className="col-span-6 text-center p-3 border-r border-green-700">
              <div className="text-green-700 font-semibold text-sm">
                Sindicato Nacional dos Trabalhadores de Pesquisa e Desenvolvimento Agropecuário
              </div>
              <div className="text-left mt-2 text-green-700 font-semibold text-sm">
                SEÇÃO:
                <Input
                  name="secao"
                  value={formData.secao}
                  onChange={handleInputChange}
                  className="inline w-2/3 h-7 border border-green-700 ml-2 text-sm"
                />
              </div>
            </div>

            <div className="col-span-3 text-center p-3">
              <div className="text-red-600 font-bold text-sm">
                AUTORIZAÇÃO DE PAGAMENTO - AP
              </div>
              <div className="flex justify-between text-green-700 text-sm mt-2">
                <div>
                  Nº
                  <Input
                    name="numero"
                    value={formData.numero}
                    onChange={handleInputChange}
                    className="inline w-20 h-7 border border-green-700 ml-1 text-sm"
                  />
                </div>
                <div>
                  ANO:
                  <Input
                    name="ano"
                    value={formData.ano}
                    onChange={handleInputChange}
                    className="inline w-20 h-7 border border-green-700 ml-1 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Favorecido */}
          <div className="border border-green-700 mb-6">
            <div className="bg-green-700 text-white text-sm px-3 py-2 font-semibold">
              FAVORECIDO
            </div>
            <div className="grid grid-cols-2 border-t border-green-700 text-sm">
              <div className="border-r border-green-700 p-2">
                Nome:
                <Input
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  className="inline w-5/6 h-7 border border-green-700 ml-2 text-sm"
                />
              </div>
              <div className="p-2">
                CPF/CNPJ:
                <Input
                  name="cpfCnpj"
                  value={formData.cpfCnpj}
                  onChange={handleInputChange}
                  className="inline w-4/6 h-7 border border-green-700 ml-2 text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 border-t border-green-700 text-sm">
              <div className="border-r border-green-700 p-2">
                Endereço:
                <Input
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleInputChange}
                  className="inline w-5/6 h-7 border border-green-700 ml-2 text-sm"
                />
              </div>
              <div className="p-2">
                Cidade/UF:
                <Input
                  name="cidadeUf"
                  value={formData.cidadeUf}
                  onChange={handleInputChange}
                  className="inline w-4/6 h-7 border border-green-700 ml-2 text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 border-t border-green-700 text-sm">
              <div className="border-r border-green-700 p-2">
                Banco/C.C.:
                <Input
                  name="banco"
                  value={formData.banco}
                  onChange={handleInputChange}
                  className="inline w-3/4 h-7 border border-green-700 ml-2 text-sm"
                />
              </div>
              <div className="border-r border-green-700 p-2">
                Agência:
                <Input
                  name="agencia"
                  value={formData.agencia}
                  onChange={handleInputChange}
                  className="inline w-3/4 h-7 border border-green-700 ml-2 text-sm"
                />
              </div>
              <div className="p-2">
                Cidade/UF:
                <Input
                  name="cidadeUfBanco"
                  value={formData.cidadeUfBanco}
                  onChange={handleInputChange}
                  className="inline w-3/4 h-7 border border-green-700 ml-2 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Histórico e Valor */}
          <div className="border border-green-700 mb-8">
            <div className="grid grid-cols-6 bg-green-50 border-b border-green-700 text-green-700 text-sm font-semibold">
              <div className="col-span-5 border-r border-green-700 p-2">Histórico</div>
              <div className="col-span-1 p-2 text-center">Valor</div>
            </div>
            <div className="grid grid-cols-6 text-sm">
              <div className="col-span-5 border-r border-green-700">
                <Textarea
                  name="historico"
                  value={formData.historico}
                  onChange={handleInputChange}
                  className="w-full h-60 border-none resize-none text-sm"
                />
              </div>
              <div className="col-span-1">
                <Textarea
                  name="valor"
                  value={formData.valor}
                  onChange={handleInputChange}
                  className="w-full h-60 border-none resize-none text-sm text-right"
                />
              </div>
            </div>
            <div className="grid grid-cols-6 border-t border-green-700 text-sm">
              <div className="col-span-5 border-r border-green-700 text-right p-2 font-semibold text-green-700">
                TOTAL
              </div>
              <div className="col-span-1 text-right p-2">
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
          <div className="grid grid-cols-4 border border-green-700 mt-10 text-sm">
            <div className="border-r border-green-700 text-center font-semibold text-green-700 p-2">
              EMITENTE
            </div>
            <div className="border-r border-green-700 text-center p-2 text-[11px]">
              ATESTO QUE OS SERVIÇOS FORAM PRESTADOS EM FAVOR DO SINPAF
            </div>
            <div className="border-r border-green-700 text-center font-semibold text-green-700 p-2">
              APROVAÇÃO
            </div>

            <div className="text-center p-2 text-[11px]">
              Recebi o valor líquido constante acima
              <div className="flex items-center justify-center mt-2 gap-2">
                <Input
                  type="date"
                  name="dataRecebimento"
                  value={formData.dataRecebimento}
                  onChange={handleInputChange}
                  className="h-7 w-38 text-xs border border-green-700 text-center"
                />
                <span></span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 border-x border-b border-green-700 text-sm">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="text-center p-6 border-r border-green-700 last:border-r-0"
              >
                <div className="border-t border-dotted border-green-700 mt-6" />
                <div className="text-green-700 mt-2">Assinatura</div>
              </div>
            ))}
          </div>

          {/* Botão PDF */}
          <div className="mt-10 flex justify-center mb-12">
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
