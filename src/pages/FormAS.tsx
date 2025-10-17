import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const FormAS = () => {
  const [formData, setFormData] = useState({
    secao: "",
    numero: "",
    ano: "",
    nome: "",
    cargo: "",
    cpf: "",
    banco: "",
    agencia: "",
    conta: "",
    cidadeEstadoBanco: "",
    dataPrestacao: "",
    objetivo: "",
    valor: "",
    valorExtenso: "",
    observacoes: "",
  });

  useEffect(() => {
    const savedData = localStorage.getItem("formASData");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("formASData", JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const generatePDF = async () => {
    const element = document.querySelector("#form-as");
    if (!element) return;

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
    pdf.save("Autorizacao_de_Suprimento.pdf");

    tempElements.forEach(({ input, span }) => {
      input.style.display = "";
      span.remove();
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <form
          id="form-as"
          className="bg-white border border-green-700 p-2 rounded-md max-w-5xl mx-auto text-green-800"
        >
          {/* Cabeçalho */}
          <div className="grid grid-cols-12 border border-green-700 mb-1">
            <div className="col-span-3 flex flex-col items-center justify-center border-r border-green-700 p-2">
              <img src="/SINPAF.png" alt="SINPAF" className="w-20 mb-1" />
            </div>

            <div className="col-span-6 text-center p-2 border-r border-green-700">
              <div className="text-green-800 font-semibold text-sm leading-tight">
                Sindicato Nacional dos Trabalhadores de Pesquisa e
                Desenvolvimento Agropecuário
              </div>
              <div className="text-red-600 font-bold mt-1">
                AS - AUTORIZAÇÃO DE SUPRIMENTO
              </div>
              <div className="text-left mt-1 text-green-800 font-semibold text-sm">
                SEÇÃO:
                <Input
                  name="secao"
                  value={formData.secao}
                  onChange={handleChange}
                  className="inline w-3/4 h-6 border border-green-700 ml-2 text-sm"
                />
              </div>
            </div>

            <div className="col-span-3 text-center p-2">
              <div className="flex flex-col items-center justify-center h-full">
                <div className="flex justify-between w-full text-green-800 text-sm mb-1">
                  <span>Número</span>
                  <Input
                    name="numero"
                    value={formData.numero}
                    onChange={handleChange}
                    className="inline w-16 h-6 border border-green-700 text-sm"
                  />
                </div>
                <div className="flex justify-between w-full text-green-800 text-sm">
                  <span>Ano</span>
                  <Input
                    name="ano"
                    value={formData.ano}
                    onChange={handleChange}
                    className="inline w-16 h-6 border border-green-700 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Favorecido */}
          <div className="border border-green-700 text-sm">
            <div className="bg-green-700 text-white font-semibold px-2 py-1">
              FAVORECIDO
            </div>

            {/* Nome */}
            <div className="grid grid-cols-2 border-t border-green-700">
              <div className="border-r border-green-700 p-1">
                Nome:
                <Input
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className="inline w-5/6 h-6 border border-green-700 ml-2"
                />
              </div>
              <div className="p-1">
                CPF:
                <Input
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  className="inline w-4/6 h-6 border border-green-700 ml-2"
                />
              </div>
            </div>

            {/* Cargo e Banco */}
            <div className="grid grid-cols-2 border-t border-green-700">
              <div className="border-r border-green-700 p-1">
                Cargo:
                <Input
                  name="cargo"
                  value={formData.cargo}
                  onChange={handleChange}
                  className="inline w-5/6 h-6 border border-green-700 ml-2"
                />
              </div>
              <div className="p-1">
                Banco (nome/código):
                <Input
                  name="banco"
                  value={formData.banco}
                  onChange={handleChange}
                  className="inline w-4/6 h-6 border border-green-700 ml-2"
                />
              </div>
            </div>

            {/* Agência e Conta */}
            <div className="grid grid-cols-2 border-t border-green-700">
              <div className="border-r border-green-700 p-1">
                Agência:
                <Input
                  name="agencia"
                  value={formData.agencia}
                  onChange={handleChange}
                  className="inline w-5/6 h-6 border border-green-700 ml-2"
                />
              </div>
              <div className="p-1">
                Conta Corrente:
                <Input
                  name="conta"
                  value={formData.conta}
                  onChange={handleChange}
                  className="inline w-4/6 h-6 border border-green-700 ml-2"
                />
              </div>
            </div>

            {/* Cidade e Data */}
            <div className="grid grid-cols-2 border-t border-green-700">
              <div className="border-r border-green-700 p-1">
                Cidade/Estado:
                <Input
                  name="cidadeEstadoBanco"
                  value={formData.cidadeEstadoBanco}
                  onChange={handleChange}
                  className="inline w-5/6 h-6 border border-green-700 ml-2"
                />
              </div>
              <div className="p-1">
                Data limite prestação:
                <Input
                  name="dataPrestacao"
                  value={formData.dataPrestacao}
                  onChange={handleChange}
                  className="inline w-4/6 h-6 border border-green-700 ml-2"
                />
              </div>
            </div>
          </div>

          {/* Objetivo */}
          <div className="grid grid-cols-12 border-x border-b border-green-700 text-sm mt-1">
            <div className="col-span-1 flex items-center justify-center bg-green-50 font-semibold border-r border-green-700">
              OBJETIVO
            </div>
            <div className="col-span-11">
              <Textarea
                name="objetivo"
                value={formData.objetivo}
                onChange={handleChange}
                className="w-full h-24 border-none resize-none text-sm"
              />
            </div>
          </div>

          {/* Valor */}
          <div className="grid grid-cols-12 border-x border-b border-green-700 text-sm">
            <div className="col-span-2 flex items-center justify-center bg-green-50 font-semibold border-r border-green-700">
              VALOR EM R$
            </div>
            <div className="col-span-10 p-1">
              <Input
                name="valor"
                value={formData.valor}
                onChange={handleChange}
                className="w-1/3 h-6 border border-green-700"
              />
              <span className="ml-4">Por extenso:</span>
              <Input
                name="valorExtenso"
                value={formData.valorExtenso}
                onChange={handleChange}
                className="inline w-2/3 h-6 border border-green-700 ml-2"
              />
            </div>
          </div>

            {/* Autorizo + Recibo */}
          <div className="grid grid-cols-12 border border-green-700 text-sm mt-2">
            <div className="col-span-3 border-r border-green-700 text-center">
              <div className="font-semibold text-green-700 border-b border-green-700 p-1">
                AUTORIZO
              </div>
              <div className="p-2">
                <div className="border-b border-green-700 w-3/4 mx-auto mt-6" />
                <div className="mt-2">Data</div>
                <div className="border-b border-green-700 w-3/4 mx-auto mt-6" />
                <div className="mt-2">Assinatura</div>
              </div>
            </div>
            <div className="col-span-9 p-2">
              <div className="text-justify leading-tight">
                Recebi a importância acima e autorizo o débito dos valores sob
                minha responsabilidade no presente suprimento, em minha folha de
                pagamento, no caso de inadimplência do prazo de prestação de
                contas.
              </div>
              <div className="flex justify-between mt-6 px-4">
                <div>
                  Local{" "}
                  <div className="border-b border-green-700 w-24 inline-block ml-2" />
                </div>
                <div>
                  Data{" "}
                  <div className="border-b border-green-700 w-24 inline-block ml-2" />
                </div>
              <div className="border-b border-green-700 w-40 text-center">
               
                </div>
              </div>
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
        </form>
      </div>
    </div>
  );
};

export default FormAS;
