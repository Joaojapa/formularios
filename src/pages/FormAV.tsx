import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const FormAV = () => {
  const [formData, setFormData] = useState({
    secao: "",
    numero: "",
    ano: "",
    nome: "",
    cpf: "",
    cargo: "",
    banco: "",
    agencia: "",
    cc: "",
    cidadeEstado: "",
    roteiro: "",
    objetivo: "",
    observacoes: "",
    saidaDiasC: "",
    valorDiariasC: "",
    adiantCapital: "",
    retornoDiasI: "",
    valorDiariasI: "",
    adiantInterior: "",
    outrosValor: "",
    totalAdiantamento: "",
    valorTotal: "",
    valorExtenso: "",
  });

  const formRef = useRef(null);

    // ✅ Carrega dados do localStorage ao abrir a página
  useEffect(() => {
    const savedData = localStorage.getItem("formAVData");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  // ✅ Salva automaticamente no localStorage sempre que o formData mudar
  useEffect(() => {
    localStorage.setItem("formAVData", JSON.stringify(formData));
  }, [formData]);


  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Igual ao PCSForm – Gera PDF com texto visível no lugar dos inputs
  const generatePDF = async () => {
        const element = document.querySelector("#form-av");
    if (!formRef.current) return;


    // 🔹 Substitui inputs e textarea por spans visíveis
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

    // 🔹 Restaura inputs originais
    tempElements.forEach(({ input, span }) => {
      input.style.display = "";
      span.remove();
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <style>{`
        .nobreak { white-space: nowrap; }
        .nowrap-input { display: inline-flex; align-items: center; gap: 4px; flex-wrap: nowrap; }
      `}</style>

      <div className="container mx-auto px-4">
        <form
          ref={formRef}
          id="form-av"
          className="bg-white border border-green-700 p-4 rounded-md max-w-5xl mx-auto text-sm"
        >
          {/* Cabeçalho */}
          <div className="grid grid-cols-12 border border-green-700 mb-1">
            {/* Logo */}
            <div className="col-span-3 flex flex-col items-center justify-center border-r border-green-700 p-2">
              <img src="/SINPAF.png" alt="SINPAF" className="w-20 mb-1" />
            </div>

            {/* Título e seção */}
            <div className="col-span-6 border-r border-green-7 p-2 text-center">
              <div className="text-green-700 font-semibold text-xs leading-tight mx-auto max-w-[240px] text-center break-words">
                Sindicato Nacional dos Trabalhadores de Pesquisa e Desenvolvimento Agropecuário
              </div>
              <div className="text-green-700 font-semibold text-sm mt-1">
                SEÇÃO:{" "}
                <Input
                  name="secao"
                  value={formData.secao}
                  onChange={handleInputChange}
                  className="inline w-2/3 h-6 border border-green-700 ml-2 text-sm"
                />
              </div>
            </div>

            {/* Número e ano */}
            <div className="col-span-3 p-2 text-center">
              <div className="text-red-600 font-bold text-sm">
                AV - AUTORIZAÇÃO DE VIAGEM
              </div>
              <div className="flex justify-between text-green-700 text-sm mt-1">
                <div>
                  Nº{" "}
                  <Input
                    name="numero"
                    value={formData.numero}
                    onChange={handleInputChange}
                    className="inline w-16 h-6 border border-green-700 ml-1 text-sm"
                  />
                </div>
                <div>
                  ANO:{" "}
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

          {/* Linha SINPAF / CONVIDADO */}
          <div className="border border-green-700 p-1 text-green-700 font-semibold text-sm">
            SEÇÃO: SINPAF ( ) CONVIDADO ( )
          </div>

          {/* Favorecido */}
          <div className="border border-green-700 mt-1">
            <div className="bg-green-700 text-white text-center py-1 font-semibold">
              FAVORECIDO
            </div>

            {/* Campos */}
            <div className="grid grid-cols-2 border-t border-green-700">
              <div className="border-r border-green-700 p-1">
                Nome:
                <Input
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  className="inline w-5/6 h-6 border border-green-700 ml-2"
                />
              </div>
              <div className="p-1 nowrap-input">
                CPF:
                <Input
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleInputChange}
                  className="inline w-1/3 h-6 border border-green-700 ml-2"
                />
                Cargo:
                <Input
                  name="cargo"
                  value={formData.cargo}
                  onChange={handleInputChange}
                  className="inline w-1/3 h-6 border border-green-700 ml-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 border-t border-green-700">
              <div className="border-r border-green-700 p-1 nowrap-input">
                Banco:
                <Input
                  name="banco"
                  value={formData.banco}
                  onChange={handleInputChange}
                  className="inline w-5/6 h-6 border border-green-700 ml-2"
                />
              </div>
              <div className="p-1 nowrap-input">
                Agência:
                <Input
                  name="agencia"
                  value={formData.agencia}
                  onChange={handleInputChange}
                  className="inline w-1/4 h-6 border border-green-700 ml-2"
                />
                C/C:
                <Input
                  name="cc"
                  value={formData.cc}
                  onChange={handleInputChange}
                  className="inline w-1/3 h-6 border border-green-700 ml-2"
                />
              </div>
            </div>

            <div className="border-t border-green-700 p-1 nowrap-input">
              Cidade/Estado:
              <Input
                name="cidadeEstado"
                value={formData.cidadeEstado}
                onChange={handleInputChange}
                className="inline w-2/3 h-6 border border-green-700 ml-2"
              />
            </div>

            <div className="border-t border-green-700 p-1 nowrap-input">
              Roteiro:
              <Input
                name="roteiro"
                value={formData.roteiro}
                onChange={handleInputChange}
                className="inline w-5/6 h-6 border border-green-700 ml-2"
              />
            </div>

            <div className="border-t border-green-700 p-1 nowrap-input">
              Objetivo:
              <Input
                name="objetivo"
                value={formData.objetivo}
                onChange={handleInputChange}
                className="inline w-5/6 h-6 border border-green-700 ml-2"
              />
            </div>

            <div className="border-t border-green-700 p-1">
              Observações:
              <Textarea
                name="observacoes"
                value={formData.observacoes}
                onChange={handleInputChange}
                className="w-full h-20 border border-green-700 resize-none mt-1"
              />
            </div>

            {/* Saída / Adiantamentos / Retorno */}
            <div className="grid grid-cols-3 border-t border-green-700 text-sm">
              <div className="border-r border-green-700 p-1 nowrap-input">
                <span>Saída: Nº dias (C):</span>
                <Input
                  name="saidaDiasC"
                  value={formData.saidaDiasC}
                  onChange={handleInputChange}
                  className="inline w-1/3 h-6 border border-green-700 ml-2"
                />
                <span>Valor das Diárias (C):</span>
                <Input
                  name="valorDiariasC"
                  value={formData.valorDiariasC}
                  onChange={handleInputChange}
                  className="inline w-1/3 h-6 border border-green-700 ml-2"
                />
              </div>

              <div className="col-span-2 p-1 flex flex-col gap-1">
                <div className="nowrap-input">
                  <span>Adiant. Total Diária de Capital:</span>
                  <Input
                    name="adiantCapital"
                    value={formData.adiantCapital}
                    onChange={handleInputChange}
                    className="inline w-1/2 h-6 border border-green-700 ml-2"
                  />
                </div>
                <div className="nowrap-input">
                  <span>Adiant. Total Diária de Interior:</span>
                  <Input
                    name="adiantInterior"
                    value={formData.adiantInterior}
                    onChange={handleInputChange}
                    className="inline w-1/2 h-6 border border-green-700 ml-2"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 border-t border-green-700 text-sm">
              <div className="border-r border-green-700 p-1 nowrap-input">
                <span>Retorno: Nº dias (I):</span>
                <Input
                  name="retornoDiasI"
                  value={formData.retornoDiasI}
                  onChange={handleInputChange}
                  className="inline w-1/3 h-6 border border-green-700 ml-2"
                />
                <span>Valor das Diárias (I):</span>
                <Input
                  name="valorDiariasI"
                  value={formData.valorDiariasI}
                  onChange={handleInputChange}
                  className="inline w-1/3 h-6 border border-green-700 ml-2"
                />
              </div>
            </div>
          </div>

          {/* Rodapé */}
          <div className="grid grid-cols-2 border border-green-700 mt-2">
            <div className="border-r border-green-700 text-center p-1">
              <div className="font-semibold text-green-700">AUTORIZO</div>
              <div className="mt-2">____/____/____ Data</div>
              <div className="border-t border-dotted border-green-700 mt-2"></div>
              <div className="text-green-700 mt-1">Assinatura</div>
            </div>
            <div className="text-center p-1 text-[12px] leading-tight">
              <div className="font-semibold text-green-700">RECIBO</div>
              <p className="mt-2">
                Recebi a importância acima e Autorizo o Débito dos valores sob minha responsabilidade
                (adiantamento e passagem) em minha Folha de Pagamento nos casos previstos nas normas internas.
              </p>
              <div className="mt-2 flex justify-evenly text-center">
                <div>
                  <div className="border-t border-dotted border-green-700 mt-4 w-40 mx-auto"></div>
                  <div className="text-green-700 text-xs mt-1">Local</div>
                </div>
                <div>
                  <div className="border-t border-dotted border-green-700 mt-4 w-40 mx-auto"></div>
                  <div className="text-green-700 text-xs mt-1">Data</div>
                </div>
                <div>
                  <div className="border-t border-dotted border-green-700 mt-4 w-40 mx-auto"></div>
                  <div className="text-green-700 text-xs mt-1">Assinatura</div>
                </div>
              </div>
            </div>
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

export default FormAV;
