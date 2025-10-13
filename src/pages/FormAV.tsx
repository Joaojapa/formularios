import { useState } from "react";
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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const generatePDF = async () => {
    const formElement = document.getElementById("form-av");
    if (!formElement) {
      alert("Erro: formulário não encontrado!");
      return;
    }

    const canvas = await html2canvas(formElement, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("Autorizacao_Viagem.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <form
          id="form-av"
          className="bg-white border border-green-700 p-4 rounded-md max-w-5xl mx-auto text-sm"
        >
          {/* Cabeçalho */}
          <div className="grid grid-cols-12 border border-green-700 mb-1">
            {/* Logo */}
            <div className="col-span-3 flex flex-col items-center justify-center border-r border-green-700 p-2">
              <img
                src="/SINPAF.png"
                alt="SINPAF"
                className="w-20 mb-1"
              />
              <div className="text-xs text-green-700 font-semibold">
                Filiação à CUT
              </div>
            </div>

            {/* Título e seção */}
            <div className="col-span-6 border-r border-green-700 p-2 text-center">
              <div className="text-green-700 font-semibold text-sm">
                Sindicato Nacional dos Trabalhadores de Pesquisa e Desenvolvimento Agropecuário
              </div>
              <div className="text-green-700 font-semibold text-sm">
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
                <Input name="nome" value={formData.nome} onChange={handleInputChange} className="inline w-5/6 h-6 border border-green-700 ml-2" />
              </div>
              <div className="p-1">
                CPF:
                <Input name="cpf" value={formData.cpf} onChange={handleInputChange} className="inline w-4/6 h-6 border border-green-700 ml-2" />
                Cargo:
                <Input name="cargo" value={formData.cargo} onChange={handleInputChange} className="inline w-3/6 h-6 border border-green-700 ml-2" />
              </div>
            </div>

            <div className="grid grid-cols-2 border-t border-green-700">
              <div className="border-r border-green-700 p-1">
                Banco:
                <Input name="banco" value={formData.banco} onChange={handleInputChange} className="inline w-5/6 h-6 border border-green-700 ml-2" />
              </div>
              <div className="p-1">
                Agência:
                <Input name="agencia" value={formData.agencia} onChange={handleInputChange} className="inline w-1/4 h-6 border border-green-700 ml-2" />
                C/C:
                <Input name="cc" value={formData.cc} onChange={handleInputChange} className="inline w-1/3 h-6 border border-green-700 ml-2" />
              </div>
            </div>

            <div className="border-t border-green-700 p-1">
              Cidade/Estado:
              <Input name="cidadeEstado" value={formData.cidadeEstado} onChange={handleInputChange} className="inline w-2/3 h-6 border border-green-700 ml-2" />
            </div>

            <div className="border-t border-green-700 p-1">
              Roteiro:
              <Input name="roteiro" value={formData.roteiro} onChange={handleInputChange} className="inline w-5/6 h-6 border border-green-700 ml-2" />
            </div>

            <div className="border-t border-green-700 p-1">
              Objetivo:
              <Input name="objetivo" value={formData.objetivo} onChange={handleInputChange} className="inline w-5/6 h-6 border border-green-700 ml-2" />
            </div>

            <div className="border-t border-green-700 p-1">
              Observações:
              <Textarea name="observacoes" value={formData.observacoes} onChange={handleInputChange} className="w-full h-16 border-none resize-none" />
            </div>

            {/* Saída e retorno */}
            <div className="grid grid-cols-3 border-t border-green-700 text-sm">
              <div className="border-r border-green-700 p-1">
                Saída: Nº dias (C):
                <Input name="saidaDiasC" value={formData.saidaDiasC} onChange={handleInputChange} className="inline w-1/3 h-6 border border-green-700 ml-2" />
                Valor das Diárias (C):
                <Input name="valorDiariasC" value={formData.valorDiariasC} onChange={handleInputChange} className="inline w-1/3 h-6 border border-green-700 ml-2" />
              </div>
              <div className="border-r border-green-700 p-1">
                Adiant. Total Diária de Capital:
                <Input name="adiantCapital" value={formData.adiantCapital} onChange={handleInputChange} className="inline w-2/3 h-6 border border-green-700 ml-2" />
              </div>
            </div>

            <div className="grid grid-cols-3 border-t border-green-700 text-sm">
              <div className="border-r border-green-700 p-1">
                Retorno: Nº dias (I):
                <Input name="retornoDiasI" value={formData.retornoDiasI} onChange={handleInputChange} className="inline w-1/3 h-6 border border-green-700 ml-2" />
                Valor das Diárias (I):
                <Input name="valorDiariasI" value={formData.valorDiariasI} onChange={handleInputChange} className="inline w-1/3 h-6 border border-green-700 ml-2" />
              </div>
              <div className="border-r border-green-700 p-1">
                Adiant. Total Diária de Interior:
                <Input name="adiantInterior" value={formData.adiantInterior} onChange={handleInputChange} className="inline w-2/3 h-6 border border-green-700 ml-2" />
              </div>
            </div>

            <div className="grid grid-cols-3 border-t border-green-700 text-sm">
              <div className="border-r border-green-700 p-1">
                Outros:
                <Input name="outrosValor" value={formData.outrosValor} onChange={handleInputChange} className="inline w-1/3 h-6 border border-green-700 ml-2" />
              </div>
              <div className="p-1">
                Valor (R$):
                <Input name="valorTotal" value={formData.valorTotal} onChange={handleInputChange} className="inline w-1/3 h-6 border border-green-700 ml-2" />
                Total Adiantamento (R$):
                <Input name="totalAdiantamento" value={formData.totalAdiantamento} onChange={handleInputChange} className="inline w-1/3 h-6 border border-green-700 ml-2" />
              </div>
            </div>

            <div className="grid grid-cols-2 border-t border-green-700 text-sm">
              <div className="border-r border-green-700 p-1">
                Valor Total (R$):
                <Input name="valorTotal" value={formData.valorTotal} onChange={handleInputChange} className="inline w-1/3 h-6 border border-green-700 ml-2" />
              </div>
              <div className="p-1">
                Valor por extenso (R$):
                <Input name="valorExtenso" value={formData.valorExtenso} onChange={handleInputChange} className="inline w-2/3 h-6 border border-green-700 ml-2" />
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
