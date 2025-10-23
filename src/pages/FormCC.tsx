import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useToast } from "@/components/ui/use-toast";

const STORAGE_KEY = "formCCData";

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

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setFormData(JSON.parse(saved));
  }, []);

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

    const pdfButton = element.querySelector("button");
    if (pdfButton) pdfButton.style.display = "none";

    toast({
      title: "Gerando PDF...",
      description: "Aguarde enquanto o formulário é processado.",
    });

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
              <div className="col-span-8 border-r border-green-700 p-2 flex items-center">
                <span className="whitespace-nowrap">Nome da Seção Sindical:</span>
                <Input
                  name="secaoSindical"
                  value={formData.secaoSindical}
                  onChange={handleInputChange}
                  className="ml-2 flex-1 h-7 border border-green-700 text-sm"
                />
              </div>

              <div className="col-span-4 p-2 flex items-center">
                <span className="whitespace-nowrap">Valor (R$):</span>
                <Input
                  name="valor"
                  value={formData.valor}
                  onChange={handleInputChange}
                  className="ml-2 flex-1 h-7 border border-green-700 text-sm"
                />
              </div>
            </div>

            {/* 🟩 LINHA VERDE ENTRE BLOCOS */}
            <div className="border-t border-green-700" />

            {/* Valor por extenso */}
            <div className="border-x border-b border-green-700 p-2 text-sm font-semibold">
              Valor por extenso:
              <Input
                name="valorExtenso"
                value={formData.valorExtenso}
                onChange={handleInputChange}
                className="inline w-5/6 h-10 border border-green-700 ml-2 text-sm"
              />
            </div>

            {/* 🟩 LINHA VERDE ENTRE BLOCOS */}
            <div className="border-t border-green-700" />

            {/* Banco / Agência / Conta / Cheque */}
            <div className="grid grid-cols-12 border-x border-b border-green-700 text-sm font-semibold">
              <div className="col-span-3 border-r border-green-700 p-2 flex items-center">
                <span className="whitespace-nowrap">Banco:</span>
                <Input
                  name="banco"
                  value={formData.banco}
                  onChange={handleInputChange}
                  className="ml-2 flex-1 h-7 border border-green-700 text-sm"
                />
              </div>

              <div className="col-span-3 border-r border-green-700 p-2 flex items-center">
                <span className="whitespace-nowrap">Agência:</span>
                <Input
                  name="agencia"
                  value={formData.agencia}
                  onChange={handleInputChange}
                  className="ml-2 flex-1 h-7 border border-green-700 text-sm"
                />
              </div>

              <div className="col-span-3 border-r border-green-700 p-2 flex items-center">
                <span className="whitespace-nowrap">C/Corrente:</span>
                <Input
                  name="conta"
                  value={formData.conta}
                  onChange={handleInputChange}
                  className="ml-2 flex-1 h-7 border border-green-700 text-sm"
                />
              </div>

              <div className="col-span-3 p-2 flex items-center">
                <span className="whitespace-nowrap">Nº Cheque:</span>
                <Input
                  name="cheque"
                  value={formData.cheque}
                  onChange={handleInputChange}
                  className="ml-2 flex-1 h-7 border border-green-700 text-sm"
                />
              </div>
            </div>

            {/* 🟩 LINHA VERDE ENTRE BLOCOS */}
            <div className="border-t border-green-700" />

            {/* Favorecido */}
            <div className="border-x border-b border-green-700 p-2 text-sm font-semibold">
              Favorecido:
              <Input
                name="favorecido"
                value={formData.favorecido}
                onChange={handleInputChange}
                className="inline w-5/6 h-7 border border-green-700 ml-2 text-sm"
              />
            </div>

            {/* 🟩 LINHA VERDE ENTRE BLOCOS */}
            <div className="border-t border-green-700" />

           {/* Linhas de assinatura */}
<div className="grid grid-cols-4 border-x border-t border-green-700 mt-8 text-sm font-semibold text-green-700 text-center">
  <div className="border-r border-green-700 p-2">Emitente</div>
  <div className="border-r border-green-700 p-2">Conferente</div>
  <div className="border-r border-green-700 p-2">Dir Adm Fin</div>
  <div className="p-2">Presidente</div>
</div>

<div className="grid grid-cols-4 border-x border-b border-green-700 text-xs text-center">
  {["dataEmitente", "dataConferente", "dataDirAdm", "dataPresidente"].map(
    (field, i) => (
      <div
        key={field}
        className={`p-4 ${i < 3 ? "border-r border-green-700" : ""}`}
      >
        Data:
        <Input
          type="date"
          name={field}
          value={formData[field]}
          onChange={handleInputChange}
          className="inline w-32 h-6 border border-green-700 ml-2 text-xs text-center"
        />
        <div className="border-t border-dotted border-green-700 mt-[65px]" /> {/* espaçamento aumentado */}
        <div className="text-green-700 mt-2 text-xs">assinatura</div>
      </div>
    )
  )}
</div>


            {/* Botão PDF */}
            <div className="mt-8 flex justify-center mb-12">
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
