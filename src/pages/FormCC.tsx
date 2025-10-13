import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const generatePDF = async () => {
    const formElement = document.querySelector("form");
    const canvas = await html2canvas(formElement, {
      scale: 2,
      useCORS: true,
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("Copia_de_Cheque.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <form className="bg-white border border-green-700 p-4 rounded-md max-w-5xl mx-auto relative">

{/* Coluna lateral SINPAF + CÓPIA DE CHEQUE */}
<div className="absolute left-0 top-0 bottom-0 w-24 border-r border-green-700 flex flex-col items-center py-4">
  {/* SINPAF no topo */}
  <div className="flex flex-col items-center text-green-700 font-bold text-center">
    <div className="text-2xl leading-none">SINPAF</div>
    <div className="text-xs text-red-600 mt-1">Filiação à CUT</div>
  </div>

  {/* Espaço para centralizar o texto abaixo */}
  <div className="flex-1 flex items-center justify-center">
    <div className="text-green-700 font-extrabold text-[20px] rotate-[-90deg] whitespace-nowrap tracking-wider">
      CÓPIA DE CHEQUE
    </div>
  </div>
</div>

          {/* Conteúdo principal */}
          <div className="ml-28">
            {/* Nome e Valor */}
            <div className="grid grid-cols-12 border border-green-700">
              <div className="col-span-8 border-r border-green-700 p-1 text-sm font-semibold">
                Nome da Seção Sindical:
                <Input
                  name="secaoSindical"
                  value={formData.secaoSindical}
                  onChange={handleInputChange}
                  className="inline w-3/4 h-6 border border-green-700 ml-2 text-sm"
                />
              </div>
              <div className="col-span-4 p-1 text-sm font-semibold">
                Valor (R$):
                <Input
                  name="valor"
                  value={formData.valor}
                  onChange={handleInputChange}
                  className="inline w-3/4 h-6 border border-green-700 ml-2 text-sm"
                />
              </div>
            </div>

            {/* Valor por extenso */}
            <div className="border-x border-b border-green-700 p-1 text-sm font-semibold">
              Valor por extenso:
              <Input
                name="valorExtenso"
                value={formData.valorExtenso}
                onChange={handleInputChange}
                className="inline w-5/6 h-6 border border-green-700 ml-2 text-sm"
              />
            </div>

            {/* Banco / Agência / Conta / Cheque */}
            <div className="grid grid-cols-12 border-x border-b border-green-700 text-sm font-semibold">
              <div className="col-span-3 border-r border-green-700 p-1">
                Banco:
                <Input
                  name="banco"
                  value={formData.banco}
                  onChange={handleInputChange}
                  className="inline w-2/3 h-6 border border-green-700 ml-2 text-sm"
                />
              </div>
              <div className="col-span-3 border-r border-green-700 p-1">
                Agência:
                <Input
                  name="agencia"
                  value={formData.agencia}
                  onChange={handleInputChange}
                  className="inline w-2/3 h-6 border border-green-700 ml-2 text-sm"
                />
              </div>
              <div className="col-span-3 border-r border-green-700 p-1">
                C/Corrente:
                <Input
                  name="conta"
                  value={formData.conta}
                  onChange={handleInputChange}
                  className="inline w-2/3 h-6 border border-green-700 ml-2 text-sm"
                />
              </div>
              <div className="col-span-3 p-1">
                Nº Cheque:
                <Input
                  name="cheque"
                  value={formData.cheque}
                  onChange={handleInputChange}
                  className="inline w-2/3 h-6 border border-green-700 ml-2 text-sm"
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
              <div className="border-r border-green-700 p-2">
                Data:
                <Input
                  name="dataEmitente"
                  value={formData.dataEmitente}
                  onChange={handleInputChange}
                  className="inline w-24 h-5 border border-green-700 ml-2 text-xs"
                />
                <div className="border-t border-dotted border-green-700 mt-4" />
                <div className="text-green-700 mt-1 text-xs">00/00/20</div>
              </div>

              <div className="border-r border-green-700 p-2">
                Data:
                <Input
                  name="dataConferente"
                  value={formData.dataConferente}
                  onChange={handleInputChange}
                  className="inline w-24 h-5 border border-green-700 ml-2 text-xs"
                />
                <div className="border-t border-dotted border-green-700 mt-4" />
                <div className="text-green-700 mt-1 text-xs">00/00/20</div>
              </div>

              <div className="border-r border-green-700 p-2">
                Data:
                <Input
                  name="dataDirAdm"
                  value={formData.dataDirAdm}
                  onChange={handleInputChange}
                  className="inline w-24 h-5 border border-green-700 ml-2 text-xs"
                />
                <div className="border-t border-dotted border-green-700 mt-4" />
                <div className="text-green-700 mt-1 text-xs">00/00/20</div>
              </div>

              <div className="p-2">
                Data:
                <Input
                  name="dataPresidente"
                  value={formData.dataPresidente}
                  onChange={handleInputChange}
                  className="inline w-24 h-5 border border-green-700 ml-2 text-xs"
                />
                <div className="border-t border-dotted border-green-700 mt-4" />
                <div className="text-green-700 mt-1 text-xs">00/00/20</div>
              </div>
            </div>

            {/* Botão PDF */}
            <div className="mt-6 flex justify-center">
              <Button
                type="button"
                size="lg"
                className="gap-2"
                onClick={generatePDF}
              >
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
