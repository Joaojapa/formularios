// FormRPS.jsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const FormRPS = () => {
  const [formData, setFormData] = useState({
    // Cabeçalho
    secao: "",
    numero: "",
    ano: "",

    // Recebimento
    recebiDe:
      "SINPAF - Sindicato Nacional dos Trabalhadores de Pesquisa e Desenvolvimento Agropecuário",
    quantia: "",
    valorExtenso: "",
    referente: "",

    // Favorecido
    nome: "",
    cpfCnpj: "",
    endereco: "",
    cidadeUf: "",
    banco: "",
    agencia: "",
    cidadeUfBanco: "",

    // Valores e históricos
    historico: "",
    valor: "",
    total: "",

    // Descontos
    irrfPercent: "",
    issPercent: "",
    inssPercent: "",
    totalDescontos: "",
    valorBruto: "",
    valorLiquido: "",

    // Info adicional
    tel: "",
    cpfN: "",
    inscrInss: "",
    local: "",
    data: "",

    // Observações
    obs: "",
  });
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Gera e baixa PDF do formulário (captura a tag <form>)
  const generatePDF = async () => {
    const formElement = document.querySelector("form");
    if (!formElement) return;

    const canvas = await html2canvas(formElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("Recibo_Prestacao_Servicos_RPS.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <form className="bg-white border border-green-800 p-0 rounded-md max-w-6xl mx-auto shadow-sm">
          {/* === Top header with logo and RPS box === */}
          <div className="grid grid-cols-12 border border-green-800">
            {/* logo left */}
            <div className="col-span-3 border-r border-green-800 p-3 flex items-center justify-center">
              <div className="w-full text-center">
                {/* ajuste o src caso necessário */}
                <img src="/SINPAF.png" alt="logo" className="max-h-20 mx-auto mb-1" />
                <div className="text-red-600 text-xs">Filiação à CUT</div>
              </div>
            </div>

            {/* center title */}
            <div className="col-span-6 p-3 border-r border-green-800">
              <div className="text-center text-green-800 font-semibold text-base">
                Sindicato Nacional dos Trabalhadores de Pesquisa e Desenvolvimento Agropecuário
              </div>
              <div className="mt-2 text-left text-sm text-green-800 font-semibold">
                <span className="inline-block align-middle">RPS</span>
                <span className="inline-block align-middle ml-3">{" "}</span>
                <div className="mt-2">
                  <label className="font-semibold">SEÇÃO:</label>
                  <Input
                    name="secao"
                    value={formData.secao}
                    onChange={handleInputChange}
                    className="inline ml-2 w-1/2 h-7 border border-green-800 text-sm"
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

          {/* === Recebi(emos) do ... block === */}
          <div className="border border-green-800 mt-1 p-3">
            <div className="text-sm text-green-800 font-semibold mb-2">
              Recebi(emos) do:
            </div>
            <div className="w-full border border-green-800 p-2 mb-2 text-sm">
              <Input
                name="recebiDe"
                value={formData.recebiDe}
                onChange={handleInputChange}
                className="w-full border-none p-0 text-sm"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 mb-2">
              <div className="col-span-1 text-sm">
                <label className="font-semibold text-green-800">a quantia de: (R$)</label>
                <Input
                  name="quantia"
                  value={formData.quantia}
                  onChange={handleInputChange}
                  className="mt-1 w-full h-7 border border-green-800 text-sm"
                />
              </div>
              <div className="col-span-2 text-sm">
                <label className="font-semibold text-green-800">Valor por extenso:</label>
                <Input
                  name="valorExtenso"
                  value={formData.valorExtenso}
                  onChange={handleInputChange}
                  className="mt-1 w-full h-7 border border-green-800 text-sm"
                />
              </div>
            </div>

            <div className="text-sm font-semibold text-green-800 mb-1">Referente a:</div>
            <Textarea
              name="referente"
              value={formData.referente}
              onChange={handleInputChange}
              className="w-full h-24 border border-green-800 resize-none text-sm p-2"
            />
          </div>

          {/* === Main content: left table (Valor Bruto / Descontos) and middle vertical "VISTOS" and right Favorecido block === */}
          <div className="grid grid-cols-12 gap-0 mt-1">
            {/* Left: Valor Bruto and Descontos */}
            <div className="col-span-6 border border-green-800 p-0">
              <div className="p-2 border-b border-green-800 text-sm font-semibold text-green-800">Valor Bruto</div>

              <div className="grid grid-cols-3 border-t border-green-800">
                <div className="col-span-1 border-r border-green-800 p-2">
                  <div className="text-xs font-semibold text-green-800 mb-2">DESCONTOS</div>
                  <div className="text-sm mb-2">
                    IRRF
                    <Input
                      name="irrfPercent"
                      value={formData.irrfPercent}
                      onChange={handleInputChange}
                      className="inline ml-2 w-14 h-6 border border-green-800 text-sm"
                      placeholder="%"
                    />
                  </div>
                  <div className="text-sm mb-2">
                    ISS
                    <Input
                      name="issPercent"
                      value={formData.issPercent}
                      onChange={handleInputChange}
                      className="inline ml-2 w-14 h-6 border border-green-800 text-sm"
                      placeholder="%"
                    />
                  </div>
                  <div className="text-sm mb-2">
                    INSS
                    <Input
                      name="inssPercent"
                      value={formData.inssPercent}
                      onChange={handleInputChange}
                      className="inline ml-2 w-14 h-6 border border-green-800 text-sm"
                      placeholder="%"
                    />
                  </div>

                  <div className="text-sm mt-3">
                    Total de Descontos
                    <Input
                      name="totalDescontos"
                      value={formData.totalDescontos}
                      onChange={handleInputChange}
                      className="block mt-1 w-full h-7 border border-green-800 text-sm"
                    />
                  </div>
                </div>

                <div className="col-span-2 p-2">
                  <div className="grid grid-cols-2">
                    <div className="col-span-1 text-sm">
                      Valor Bruto:
                    </div>
                    <div className="col-span-1">
                      <Input
                        name="valorBruto"
                        value={formData.valorBruto}
                        onChange={handleInputChange}
                        className="w-full h-7 border border-green-800 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 mt-2">
                    <div className="col-span-1 text-sm">
                      Valor Líquido:
                    </div>
                    <div className="col-span-1">
                      <Input
                        name="valorLiquido"
                        value={formData.valorLiquido}
                        onChange={handleInputChange}
                        className="w-full h-7 border border-green-800 text-sm"
                      />
                    </div>
                  </div>

                  <div className="mt-4 text-sm">
                    <label className="font-semibold text-green-800">Observações</label>
                    <Textarea
                      name="obs"
                      value={formData.obs}
                      onChange={handleInputChange}
                      className="w-full h-20 border border-green-800 resize-none text-sm mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Middle vertical VISTOS / FAVORECIDO label (using rotation) */}
            <div className="col-span-1 flex items-center justify-center border-t border-b border-green-800">
              <div className="transform -rotate-90 text-green-800 font-semibold text-xs tracking-widest">
                V I S T O S &nbsp;&nbsp; F A V O R E C I D O
              </div>
            </div>

            {/* Right: Favorecido and details */}
            <div className="col-span-5 border border-green-800 p-0">
              <div className="bg-green-800 text-white px-3 py-1 text-sm font-semibold">FAVORECIDO</div>

              <div className="grid grid-cols-1 border-t border-green-800 text-sm">
                <div className="p-2 border-b border-green-800">
                  <div className="mb-1 font-semibold">Nome:</div>
                  <Input
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    className="w-full h-7 border border-green-800 text-sm"
                  />
                </div>

                <div className="p-2 border-b border-green-800">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="mb-1 font-semibold">End.:</div>
                      <Input
                        name="endereco"
                        value={formData.endereco}
                        onChange={handleInputChange}
                        className="w-full h-7 border border-green-800 text-sm"
                      />
                    </div>
                    <div>
                      <div className="mb-1 font-semibold">Tel.:</div>
                      <Input
                        name="tel"
                        value={formData.tel}
                        onChange={handleInputChange}
                        className="w-full h-7 border border-green-800 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-2 border-b border-green-800">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="mb-1 font-semibold">CPF/N°:</div>
                      <Input
                        name="cpfN"
                        value={formData.cpfN}
                        onChange={handleInputChange}
                        className="w-full h-7 border border-green-800 text-sm"
                      />
                    </div>
                    <div>
                      <div className="mb-1 font-semibold">Insc. INSS: PIS/NIT N°:</div>
                      <Input
                        name="inscrInss"
                        value={formData.inscrInss}
                        onChange={handleInputChange}
                        className="w-full h-7 border border-green-800 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-2 border-b border-green-800">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <div className="mb-1 font-semibold">Local:</div>
                      <Input
                        name="local"
                        value={formData.local}
                        onChange={handleInputChange}
                        className="w-full h-7 border border-green-800 text-sm"
                      />
                    </div>
                    <div>
                      <div className="mb-1 font-semibold">Data:</div>
                      <Input
                        name="data"
                        value={formData.data}
                        onChange={handleInputChange}
                        className="w-full h-7 border border-green-800 text-sm"
                      />
                    </div>
                    <div>
                      <div className="mb-1 font-semibold">Ass.:</div>
                      <div className="w-full h-7 border border-green-800" />
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <div className="grid grid-cols-3 gap-1 text-sm">
                    <div className="text-center border border-green-800 p-2">
                      <div className="font-semibold text-green-800">EMITENTE</div>
                      <div className="mt-6 border-t border-dotted border-green-800 pt-4">Assinatura</div>
                    </div>
                    <div className="text-center border border-green-800 p-2">
                      <div className="font-semibold text-green-800">ATESTO</div>
                      <div className="mt-6 border-t border-dotted border-green-800 pt-4">Assinatura</div>
                    </div>
                    <div className="text-center border border-green-800 p-2">
                      <div className="font-semibold text-green-800">APROVAÇÃO</div>
                      <div className="mt-6 border-t border-dotted border-green-800 pt-4">Assinatura</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> {/* end main grid */}

          {/* === Histórico & Valor (larger block similar to imagem original) === */}
          <div className="border border-green-800 mt-1">
            <div className="grid grid-cols-6 bg-green-50 border-b border-green-800 text-green-800 text-sm font-semibold">
              <div className="col-span-5 border-r border-green-800 p-2">Histórico</div>
              <div className="col-span-1 p-2 text-center">Valor</div>
            </div>

            <div className="grid grid-cols-6 text-sm">
              <div className="col-span-5 border-r border-green-800 p-2">
                <Textarea
                  name="historico"
                  value={formData.historico}
                  onChange={handleInputChange}
                  className="w-full h-28 border-none resize-none text-sm"
                />
              </div>
              <div className="col-span-1 p-2">
                <Textarea
                  name="valor"
                  value={formData.valor}
                  onChange={handleInputChange}
                  className="w-full h-28 border-none resize-none text-sm text-right"
                />
              </div>
            </div>

            <div className="grid grid-cols-6 border-t border-green-800 text-sm">
              <div className="col-span-5 border-r border-green-800 text-right p-2 font-semibold text-green-800">
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

          {/* === Footer with EMITENTE / ATESTO / APROVAÇÃO / Recebi e signature boxes (4) === */}
          <div className="grid grid-cols-4 border border-green-800 mt-2 text-sm">
            <div className="border-r border-green-800 text-center font-semibold text-green-800 p-2">EMITENTE</div>
            <div className="border-r border-green-800 text-center p-2 text-[11px]">
              ATESTO QUE OS SERVIÇOS FORAM PRESTADOS EM FAVOR DO SINPAF
            </div>
            <div className="border-r border-green-800 text-center font-semibold text-green-800 p-2">APROVAÇÃO</div>
            <div className="text-center p-2 text-[11px]">
              Recebi o valor líquido constante acima
              <br />
              ____/____/____ Data
            </div>
          </div>

          <div className="grid grid-cols-4 border-x border-b border-green-800 text-sm">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center p-6 border-r border-green-800 last:border-r-0">
                <div className="border-t border-dotted border-green-800 mt-6 pt-2" />
                <div className="text-green-800 mt-2">Assinatura</div>
              </div>
            ))}
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
