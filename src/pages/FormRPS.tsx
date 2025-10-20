import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const STORAGE_KEY = "formRPSData"; // 🔹 Chave única no localStorage

const FormRPS = () => {
  const [formData, setFormData] = useState({
    secao: "",
    numero: "",
    ano: "",
    recebiDe:
      "SINPAF - Sindicato Nacional dos Trabalhadores de Pesquisa e Desenvolvimento Agropecuário",
    quantia: "",
    valorExtenso: "",
    referente: "",
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
    irrfPercent: "",
    issPercent: "",
    inssPercent: "",
    totalDescontos: "",
    valorBruto: "",
    valorLiquido: "",
    tel: "",
    cpfN: "",
    inscrInss: "",
    local: "",
    data: "",
    obs: "",
  });

  const formRef = useRef(null);

  // 🔹 Carrega dados salvos ao iniciar
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch {
        console.warn("Erro ao ler dados salvos");
      }
    }
  }, []);

  // 🔹 Salva automaticamente sempre que o formData muda
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generatePDF = async () => {
    const element = formRef.current;
    if (!element) return;
    console.log("Gerando PDF... aguarde.");

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
    pdf.save("Recibo_Prestacao_Servicos_RPS.pdf");

    tempElements.forEach(({ input, span }) => {
      input.style.display = "";
      span.remove();
    });

    console.log("PDF gerado com sucesso!");
  };
  
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
 <form
  ref={formRef}
  className="bg-white border border-green-800 p-0 rounded-md max-w-6xl mx-auto shadow-sm">
        
          <div className="grid grid-cols-12 border border-green-800">
            {/* logo left */}
            <div className="col-span-3 border-r border-green-800 p-3 flex items-center justify-center">
              <div className="w-full text-center">
                {/* ajuste o src caso necessário */}
                <img src="/SINPAF.png" alt="logo" className="max-h-20 mx-auto mb-1" />
                <div className="text-red-600 text-xs"></div>
              </div>
            </div>

            {/* center title */}
            <div className="col-span-6 p-3 border-r border-green-800">
              <div className="text-center text-green-800 font-semibold text-base">
                Sindicato Nacional dos Trabalhadores de Pesquisa e Desenvolvimento Agropecuário
              </div>
              <div className="mt-2 text-left text-sm text-green-800 font-semibold">
                <span className="inline-block align-middle"></span>
                <span className="inline-block align-middle ml-3">{" "}</span>
                <div className="mt-2">
                  <label className="font-semibold">SEÇÃO:</label>
                  <Input
                    name="secao"
                    value={formData.secao}
                    onChange={handleInputChange}
                    className="inline ml-2 w-10/12 h-7 border border-green-800 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* right small title area */}
            <div className="col-span-3 p-3">
              <div className="text-red-600 font-bold text-sm text-center">
                RECIBO DE PRESTAÇÃO DE SERVIÇOS
              </div>
              <div className="flex justify-between items-center mt-2 text-green-800 text-sm">
                <div>
                  Nº
                  <Input
                    name="numero"
                    value={formData.numero}
                    onChange={handleInputChange}
                    className="inline ml-2 w-16 h-7 border border-green-800 text-sm"
                  />
                </div>
                <div>
                  ANO:
                  <Input
                    name="ano"
                    value={formData.ano}
                    onChange={handleInputChange}
                    className="inline ml-2 w-16 h-7 border border-green-800 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

         {/* === RECEBI(EMOS) DO... === */}
<div className="border border-green-700 mt-2 text-green-700 text-sm">
  {/* Cabeçalho */}
  <div className="bg-green-50 text-center font-semibold border-b border-green-700 py-1">
 
 Recebi(emos) do: SINPAF - Sindicato Nacional dos Trabalhadores de Pesquisa e Desenvolvimento Agropecuário
  </div>

  {/* Nome de quem recebeu */}
  <div className="grid grid-cols-6 border-b border-green-700">
    <div className="col-span-2 flex items-center justify-center border-r border-green-700 font-semibold text-center">
      Nome / Setor:
    </div>
    <div className="col-span-4 flex items-center justify-center p-1">
      <Input
        name="recebiDe"
        value={formData.recebiDe}
        onChange={handleInputChange}
        className="inline w-5/6 h-6 border border-green-700 text-sm"
      />
    </div>
  </div>

  {/* Quantia e Valor por Extenso */}
  <div className="grid grid-cols-6 border-b border-green-700">
    <div className="col-span-2 flex items-center justify-center border-r border-green-700 font-semibold text-center">
      Quantia (R$):
    </div>
    <div className="col-span-1 flex items-center justify-center border-r border-green-700 p-1">
      <Input
        name="quantia"
        value={formData.quantia}
        onChange={handleInputChange}
        className="inline w-5/6 h-6 border border-green-700 text-right text-sm"
      />
    </div>
    <div className="col-span-3 flex flex-col justify-center items-center p-1">
      <div className="font-semibold text-center">Valor por Extenso:</div>
      <Input
        name="valorExtenso"
        value={formData.valorExtenso}
        onChange={handleInputChange}
        className="inline w-5/6 h-6 border border-green-700 text-sm text-center mt-1"
      />
    </div>
  </div>

  {/* Referente a */}
  <div className="grid grid-cols-6">
    <div className="col-span-2 flex items-center justify-center border-r border-green-700 font-semibold text-center">
      Referente a:
    </div>
    <div className="col-span-4 p-1">
      <Textarea
        name="referente"
        value={formData.referente}
        onChange={handleInputChange}
        className="w-full h-16 border border-green-700 resize-none text-sm p-1"
      />
    </div>
  </div>
</div>

{/* === VALOR BRUTO / DESCONTOS (layout tipo RECEBI(EMOS) DO) === */}
<div className="border border-green-700 mt-2 text-green-700 text-sm">
  {/* Cabeçalho */}
  <div className="bg-green-50 text-center font-semibold border-b border-green-700 py-1">
    VALOR BRUTO / DESCONTOS
  </div>

  {/* Valor Bruto e Líquido */}
  <div className="grid grid-cols-6 border-b border-green-700">
    <div className="col-span-2 flex items-center justify-center border-r border-green-700 font-semibold text-center">
      Valor Bruto (R$):
    </div>
    <div className="col-span-1 flex items-center justify-center border-r border-green-700 p-1">
      <Input
        name="valorBruto"
        value={formData.valorBruto}
        onChange={handleInputChange}
        className="inline w-5/6 h-6 border border-green-700 text-right text-sm"
      />
    </div>
    <div className="col-span-3 flex items-center justify-center p-1">
      <div className="w-full flex flex-col items-center">
        <div className="font-semibold text-center">Valor Líquido (R$):</div>
        <Input
          name="valorLiquido"
          value={formData.valorLiquido}
          onChange={handleInputChange}
          className="inline w-5/6 h-6 border border-green-700 text-right text-sm mt-1"
        />
      </div>
    </div>
  </div>

  {/* Descontos */}
  <div className="grid grid-cols-6 border-b border-green-700">
    <div className="col-span-2 flex items-center justify-center border-r border-green-700 font-semibold text-center">
      Descontos (%)
    </div>
    <div className="col-span-4 p-1">
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center">
          <div className="text-xs font-semibold">IRRF</div>
          <Input
            name="irrfPercent"
            value={formData.irrfPercent}
            onChange={handleInputChange}
            className="inline w-5/6 h-6 border border-green-700 text-center text-sm mt-1"
          />
        </div>
        <div className="flex flex-col items-center">
          <div className="text-xs font-semibold">ISS</div>
          <Input
            name="issPercent"
            value={formData.issPercent}
            onChange={handleInputChange}
            className="inline w-5/6 h-6 border border-green-700 text-center text-sm mt-1"
          />
        </div>
        <div className="flex flex-col items-center">
          <div className="text-xs font-semibold">INSS</div>
          <Input
            name="inssPercent"
            value={formData.inssPercent}
            onChange={handleInputChange}
            className="inline w-5/6 h-6 border border-green-700 text-center text-sm mt-1"
          />
        </div>
      </div>
    </div>
  </div>

  {/* Total de Descontos */}
  <div className="grid grid-cols-6 border-b border-green-700">
    <div className="col-span-2 flex items-center justify-center border-r border-green-700 font-semibold text-center">
      Total de Descontos (R$):
    </div>
    <div className="col-span-4 flex items-center justify-center p-1">
      <Input
        name="totalDescontos"
        value={formData.totalDescontos}
        onChange={handleInputChange}
        className="inline w-5/6 h-6 border border-green-700 text-right text-sm"
      />
    </div>
  </div>

  {/* Observações */}
  <div className="grid grid-cols-6">
    <div className="col-span-2 flex items-center justify-center border-r border-green-700 font-semibold text-center">
     Valor Líquido:
    </div>
    <div className="col-span-4 p-1">
      <Textarea
        name="obs"
        value={formData.obs}
        onChange={handleInputChange}
        className="w-full h-16 border border-green-700 resize-none text-sm p-1"
      />
    </div>
  </div>


{/* === MEIO: VISTOS (vertical) === */}
<div className="col-span-1 flex items-center justify-center border border-green-700">
  <div className="transform -rotate-90 text-green-700 font-semibold text-sm tracking-widest">
  
  </div>
</div>

{/* === DIREITA: FAVORECIDO === */}
<div className="col-span-5 border border-green-700 text-green-700 text-sm">
  {/* Cabeçalho */}
  <div className="bg-green-50 text-center font-semibold border-b border-green-700 py-1">
    FAVORECIDO
  </div>

  {/* Nome */}
 <div className="grid grid-cols-[auto_1fr] border-b border-green-700">
  <div className="flex items-center justify-center border-r border-green-700 font-semibold text-center px-3">
    Nome:
  </div>
  <div className="flex items-center p-1">
    <Input
      name="nome"
      value={formData.nome}
      onChange={handleInputChange}
      className="w-full h-6 border border-green-700 text-sm"
    />
  </div>
</div>


  {/* Endereço / Telefone */}
  <div className="grid grid-cols-6 border-b border-green-700">
    <div className="col-span-2 flex items-center justify-center border-r border-green-700 font-semibold text-center">
      End. / Tel.:
    </div>
    <div className="col-span-4 grid grid-cols-2 gap-2 p-1">
      <Input
        name="endereco"
        value={formData.endereco}
        onChange={handleInputChange}
        className="inline w-full h-6 border border-green-700 text-sm"
      />
      <Input
        name="tel"
        value={formData.tel}
        onChange={handleInputChange}
        className="inline w-full h-6 border border-green-700 text-sm"
      />
    </div>
  </div>

  {/* CPF / INSS */}
  <div className="grid grid-cols-6 border-b border-green-700">
    <div className="col-span-2 flex items-center justify-center border-r border-green-700 font-semibold text-center">
      CPF / PIS:
    </div>
    <div className="col-span-4 grid grid-cols-2 gap-2 p-1">
      <Input
        name="cpfN"
        value={formData.cpfN}
        onChange={handleInputChange}
        className="inline w-full h-6 border border-green-700 text-sm"
      />
      <Input
        name="inscrInss"
        value={formData.inscrInss}
        onChange={handleInputChange}
        className="inline w-full h-6 border border-green-700 text-sm"
      />
    </div>
  </div>
  
{/* Local / Data / Ass. */}
<div className="grid grid-cols-6 border-b border-green-700">
  <div className="col-span-2 flex items-center justify-center border-r border-green-700 font-semibold text-center">
    Local / Data
  </div>
 <div className="col-span-4 grid grid-flow-col auto-cols-max gap-[100px] p-1">
  <Input
    name="local"
    value={formData.local}
    onChange={handleInputChange}
    className="w-70 h-6 border border-green-700 text-sm"
    placeholder="Digite o local"
  />
   <Input
    type="date"
    name="data"
    value={formData.data}
    onChange={handleInputChange}
    className="w-30 h-6 border border-green-700 text-sm text-center"
  />
</div>
</div>


  {/* Assinaturas */}
  <div className="grid grid-cols-3 border-t border-green-700">
    <div className="text-center border-r border-green-700 p-2">
      <div className="font-semibold text-green-700">EMITENTE</div>
      <div className="mt-6 border-t border-dotted border-green-700 pt-4">Assinatura</div>
    </div>
    <div className="text-center border-r border-green-700 p-2">
      <div className="font-semibold text-green-700">ATESTO</div>
      <div className="mt-6 border-t border-dotted border-green-700 pt-4">Assinatura</div>
    </div>
    <div className="text-center p-2">
      <div className="font-semibold text-green-700">APROVAÇÃO</div>
      <div className="mt-6 border-t border-dotted border-green-700 pt-4">Assinatura</div>
    </div>
  </div>
</div>
</div>
          {/* Botão PDF */}
          <div className="mt-6 mb-8 flex justify-center">
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


export default FormRPS;
