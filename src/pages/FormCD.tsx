import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const FormCD = () => {
  const [formData, setFormData] = useState({
    cd: "",
    secao: "",
    despesas: Array(12).fill({ data: "", discriminacao: "", valor: "" }),
    total: "",
    totalExtenso: "",
    favorecidoData: "",
    favorecidoNome: "",
    aprovacaoData: "",
    aprovacaoAssinatura: "",
    recebidoData: "",
    recebidoAssinatura: "",
  });

  // ✅ Atualiza campos simples
  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Atualiza linhas de despesas
  const handleDespesaChange = (index, field, value) => {
    const newDespesas = [...formData.despesas];
    newDespesas[index] = { ...newDespesas[index], [field]: value };
    setFormData((prev) => ({ ...prev, despesas: newDespesas }));
  };

  // ✅ Gera PDF idêntico à tela
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
    pdf.save("Comprovante_de_Despesas.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="container mx-auto px-4">
        <form className="bg-white border border-green-700 p-4 rounded-md max-w-4xl mx-auto text-sm">
          {/* Cabeçalho */}
          <div className="grid grid-cols-12 border border-green-700">
            <div className="col-span-3 flex flex-col items-center justify-center border-r border-green-700 py-2">
              <div className="text-green-700 font-bold text-2xl">SINPAF</div>
              <div className="text-red-600 text-xs font-semibold">Filiação à CUT</div>
            </div>

            <div className="col-span-9 text-center">
              <div className="text-green-700 font-bold text-sm pt-2">
                Sindicato Nacional dos Trabalhadores de Pesquisa e Desenvolvimento Agropecuário
              </div>
              <div className="text-green-700 font-semibold text-xs mt-1">
                COMPROVANTE DE DESPESAS
              </div>

              <div className="grid grid-cols-12 border-t border-green-700 mt-1 text-green-700 font-semibold">
                <div className="col-span-2 border-r border-green-700 flex items-center justify-center py-1">
                  CD
                  <Input
                    value={formData.cd}
                    onChange={(e) => handleInputChange("cd", e.target.value)}
                    className="ml-2 h-5 w-16 border border-green-700 text-xs"
                  />
                </div>
                <div className="col-span-10 flex items-center pl-2">
                  SEÇÃO:
                  <Input
                    value={formData.secao}
                    onChange={(e) => handleInputChange("secao", e.target.value)}
                    className="ml-2 h-5 w-3/4 border border-green-700 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tabela de despesas */}
          <div className="border border-green-700 mt-1">
            <div className="grid grid-cols-12 bg-green-50 border-b border-green-700 text-green-700 font-semibold text-xs">
              <div className="col-span-2 border-r border-green-700 text-center py-1">DATA</div>
              <div className="col-span-8 border-r border-green-700 text-center py-1">
                DISCRIMINAÇÃO
              </div>
              <div className="col-span-2 text-center py-1">VALOR R$</div>
            </div>

            {formData.despesas.map((linha, index) => (
              <div key={index} className="grid grid-cols-12 border-t border-green-700 text-xs">
                <div className="col-span-2 border-r border-green-700">
                  <Input
                    value={linha.data}
                    onChange={(e) =>
                      handleDespesaChange(index, "data", e.target.value)
                    }
                    className="w-full border-none h-6 text-center text-xs"
                  />
                </div>
                <div className="col-span-8 border-r border-green-700">
                  <Input
                    value={linha.discriminacao}
                    onChange={(e) =>
                      handleDespesaChange(index, "discriminacao", e.target.value)
                    }
                    className="w-full border-none h-6 text-xs"
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    value={linha.valor}
                    onChange={(e) =>
                      handleDespesaChange(index, "valor", e.target.value)
                    }
                    className="w-full border-none h-6 text-right text-xs"
                  />
                </div>
              </div>
            ))}

            {/* Total */}
            <div className="grid grid-cols-12 border-t border-green-700 text-xs font-semibold">
              <div className="col-span-10 border-r border-green-700 text-right text-green-700 py-1 pr-2">
                TOTAL R$
              </div>
              <div className="col-span-2 text-right p-1">
                <Input
                  value={formData.total}
                  onChange={(e) => handleInputChange("total", e.target.value)}
                  className="w-full text-right border-none font-semibold text-xs"
                />
              </div>
            </div>
            <div className="border-t border-green-700 text-xs flex">
              <div className="text-green-700 font-semibold py-1 pl-2 w-full">
                TOTAL POR EXTENSO:
                <Input
                  value={formData.totalExtenso}
                  onChange={(e) =>
                    handleInputChange("totalExtenso", e.target.value)
                  }
                  className="ml-2 w-5/6 h-5 border border-green-700 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Rodapé */}
          <div className="grid grid-cols-3 border border-green-700 mt-2 text-xs font-semibold text-green-700">
            <div className="border-r border-green-700 text-center py-1">
              FAVORECIDO
            </div>
            <div className="border-r border-green-700 text-center py-1">
              APROVAÇÃO
            </div>
            <div className="text-center py-1">
              RECEBI O VALOR REFERENTE À PRESENTE DESPESA
            </div>
          </div>

          <div className="grid grid-cols-3 border-x border-b border-green-700 text-xs text-center">
            <div className="border-r border-green-700 p-2">
              Data:
              <Input
                value={formData.favorecidoData}
                onChange={(e) =>
                  handleInputChange("favorecidoData", e.target.value)
                }
                className="ml-2 h-5 w-24 border border-green-700 text-xs"
              />
              <div className="border-t border-dotted border-green-700 mt-4" />
              <div className="mt-1 text-green-700">Nome Legível</div>
            </div>

            <div className="border-r border-green-700 p-2">
              Data:
              <Input
                value={formData.aprovacaoData}
                onChange={(e) =>
                  handleInputChange("aprovacaoData", e.target.value)
                }
                className="ml-2 h-5 w-24 border border-green-700 text-xs"
              />
              <div className="border-t border-dotted border-green-700 mt-4" />
              <div className="mt-1 text-green-700">Assinatura</div>
            </div>

            <div className="p-2">
              Data:
              <Input
                value={formData.recebidoData}
                onChange={(e) =>
                  handleInputChange("recebidoData", e.target.value)
                }
                className="ml-2 h-5 w-24 border border-green-700 text-xs"
              />
              <div className="border-t border-dotted border-green-700 mt-4" />
              <div className="mt-1 text-green-700">Assinatura</div>
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

export default FormCD;
