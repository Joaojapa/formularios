import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useToast } from "@/components/ui/use-toast"; // ✅ se estiver usando Shadcn Toast

const STORAGE_KEY = "formCCData"; // 🔹 chave única para este formulário

const FormCC = () => {
  const [formData, setFormData] = useState({
    secaoSindical: "",
    valor: "",
    valorExtenso: "",
    banco: "",
    agencia: "",
    conta: "",
    cheque: "",
    favorecido: "",
    dataEmitente: "",
    dataConferente: "",
    dataDirAdm: "",
    dataPresidente: "",
  });

  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  // 🔹 Carrega dados salvos ao abrir
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  // 🔹 Salva automaticamente quando algo muda
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const generatePDF = async () => {
    const element = formRef.current;
    if (!element) return;

    toast({
      title: "Gerando PDF...",
      description: "Aguarde enquanto o formulário é processado.",
    });

    // 🔹 Substitui inputs por spans temporários (melhor renderização)
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

    // 🔹 Captura o formulário como imagem
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("Copia_de_Cheque.pdf");

    // 🔹 Restaura inputs originais
    tempElements.forEach(({ input, span }) => {
      input.style.display = "";
      span.remove();
    });

    toast({
      title: "Download concluído!",
      description: "O PDF foi gerado com sucesso.",
    });

    // 🔹 (Opcional) limpar após salvar PDF:
    // localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <form
          ref={formRef}
          className="bg-white border border-green-700 p-4 rounded-md max-w-5xl mx-auto relative"
        >
          {/* Coluna lateral SINPAF + CÓPIA DE CHEQUE */}
          <div className="absolute left-0 top-0 bottom-0 w-24 border-r border-green-700 flex flex-col items-center py-4">
            <div className="flex flex-col items-center text-green-700 font-bold text-center">
              <div className="text-2xl leading-none">SINPAF</div>
              <div className="text-xs text-red-600 mt-1">Filiação à CUT</div>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="text-green-700 font-extrabold text-[20px] rotate-[-90deg] whitespace-nowrap tracking-wider">
                CÓPIA DE CHEQUE
              </div>
            </div>
          </div>

          {/* Conteúdo principal */}
          <div className="ml-28">
            {/* Nome e Valor */}
            <div className="grid grid-cols-12 border border-green-700 text-sm font-semibold">
              <div className="col-span-8 border-r border-green-700 p-1 flex items-center">
                <span className="whitespace-nowrap">Nome da Seção Sindical:</span>
                <Input
                  name="secaoSindical"
                  value={formData.secaoSindical}
                  onChange={handleInputChange}
                  className="ml-2 flex-1 h-6 border border-green-700 text-sm"
                />
              </div>

              <div className="col-span-4 p-1 flex items-center">
                <span className="whitespace-nowrap">Valor (R$):</span>
                <Input
                  name="valor"
                  value={formData.valor}
                  onChange={handleInputChange}
                  className="ml-2 flex-1 h-6 border border-green-700 text-sm"
                />
              </div>
            </div>

            {/* Banco / Agência / Conta / Cheque */}
            <div className="grid grid-cols-12 border-x border-b border-green-700 text-sm font-semibold">
              <div className="col-span-3 border-r border-green-700 p-1 flex items-center">
                <span className="whitespace-nowrap">Banco:</span>
                <Input
                  name="banco"
                  value={formData.banco}
                  onChange={handleInputChange}
                  className="ml-2 flex-1 h-6 border border-green-700 text-sm"
                />
              </div>

              <div className="col-span-3 border-r border-green-700 p-1 flex items-center">
                <span className="whitespace-nowrap">Agência:</span>
                <Input
                  name="agencia"
                  value={formData.agencia}
                  onChange={handleInputChange}
                  className="ml-2 flex-1 h-6 border border-green-700 text-sm"
                />
              </div>

              <div className="col-span-3 border-r border-green-700 p-1 flex items-center">
                <span className="whitespace-nowrap">C/Corrente:</span>
                <Input
                  name="conta"
                  value={formData.conta}
                  onChange={handleInputChange}
                  className="ml-2 flex-1 h-6 border border-green-700 text-sm"
                />
              </div>

              <div className="col-span-3 p-1 flex items-center">
                <span className="whitespace-nowrap">Nº Cheque:</span>
                <Input
                  name="cheque"
                  value={formData.cheque}
                  onChange={handleInputChange}
                  className="ml-2 flex-1 h-6 border border-green-700 text-sm"
                />
              </div>
            </div>

            {/* Favorecido */}
            <div className="border-x border-b border-green-700 p-1 text-sm font-semibold">
              Favorecido:
              <Input
                name="favorecido"
                value={formData.favorecido}
                onChange={handleInputChange}
                className="inline w-5/6 h-6 border border-green-700 ml-2 text-sm"
              />
            </div>

            {/* Linhas de assinatura */}
            <div className="grid grid-cols-4 border-x border-t border-green-700 mt-2 text-sm font-semibold text-green-700 text-center">
              <div className="border-r border-green-700 p-1">Emitente</div>
              <div className="border-r border-green-700 p-1">Conferente</div>
              <div className="border-r border-green-700 p-1">Dir Adm Fin</div>
              <div className="p-1">Presidente</div>
            </div>

            {/* Datas e linhas */}
            <div className="grid grid-cols-4 border-x border-b border-green-700 text-xs text-center">
              {[
                "dataEmitente",
                "dataConferente",
                "dataDirAdm",
                "dataPresidente",
              ].map((field, i) => (
                <div
                  key={field}
                  className={`p-2 ${
                    i < 3 ? "border-r border-green-700" : ""
                  }`}
                >
                  Data:
                  <Input
                    name={field}
                    value={formData[field]}
                    onChange={handleInputChange}
                    className="inline w-24 h-5 border border-green-700 ml-2 text-xs"
                  />
                  <div className="border-t border-dotted border-green-700 mt-4" />
                  <div className="text-green-700 mt-1 text-xs">00/00/20</div>
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
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormCC;
