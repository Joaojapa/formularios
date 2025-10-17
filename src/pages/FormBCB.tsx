import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const NUM_BANCOS_ROWS = 6;
const NUM_APLIC_ROWS = 6;

const FormBCB = () => {
  const formRef = useRef(null);

  // ✅ Carrega os dados salvos antes de criar o estado
  const saved = typeof window !== "undefined" ? localStorage.getItem("formBCBData") : null;
  const savedData = saved ? JSON.parse(saved) : null;

  const [header, setHeader] = useState(savedData?.header || {
    secao: "",
    numero: "",
    periodo: "",
  });

  const [resumo, setResumo] = useState(savedData?.resumo || {
    caixa: { saldoAnterior: "", entradas: "", saidas: "", saldoAtual: "" },
    bancos: { saldoAnterior: "", entradas: "", saidas: "", saldoAtual: "" },
    subTotal: { saldoAnterior: "", entradas: "", saidas: "", saldoAtual: "" },
    aplicacoes: { saldoAnterior: "", entradas: "", saidas: "", saldoAtual: "" },
    total: { saldoAnterior: "", entradas: "", saidas: "", saldoAtual: "" },
  });

  const [bancosRows, setBancosRows] = useState(
    savedData?.bancosRows ||
      Array.from({ length: NUM_BANCOS_ROWS }, () => ({
        instituicao: "",
        saldoAnterior: "",
        entradas: "",
        saidas: "",
        saldoAtual: "",
      }))
  );

  const [aplicRows, setAplicRows] = useState(
    savedData?.aplicRows ||
      Array.from({ length: NUM_APLIC_ROWS }, () => ({
        instituicao: "",
        tipo: "",
        dataAplicacao: "",
        resgate: "",
        valor: "",
      }))
  );

  const [observacoes, setObservacoes] = useState(savedData?.observacoes || "");

  const [assinaturas, setAssinaturas] = useState(
    savedData?.assinaturas || {
      preparadoNome: "",
      preparadoData: "",
      conferidoNome: "",
      conferidoData: "",
      aprovadoNome: "",
      aprovadoData: "",
    }
  );

  // ✅ Salva automaticamente no localStorage ao alterar qualquer coisa
  useEffect(() => {
    const dataToSave = {
      header,
      resumo,
      bancosRows,
      aplicRows,
      observacoes,
      assinaturas,
    };
    localStorage.setItem("formBCBData", JSON.stringify(dataToSave));
  }, [header, resumo, bancosRows, aplicRows, observacoes, assinaturas]);

  const handleHeaderChange = (e) => {
    setHeader({ ...header, [e.target.name]: e.target.value });
  };

  const handleResumoChange = (section, field, value) => {
    setResumo({
      ...resumo,
      [section]: { ...resumo[section], [field]: value },
    });
  };

  const handleBancosChange = (index, field, value) => {
    const copy = [...bancosRows];
    copy[index] = { ...copy[index], [field]: value };
    setBancosRows(copy);
  };

  const handleAplicChange = (index, field, value) => {
    const copy = [...aplicRows];
    copy[index] = { ...copy[index], [field]: value };
    setAplicRows(copy);
  };

  const handleAssinaturasChange = (e) => {
    setAssinaturas({ ...assinaturas, [e.target.name]: e.target.value });
  };

  const generatePDF = async () => {
    if (!formRef.current) return;

    const canvas = await html2canvas(formRef.current, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("Boletim_Caixa_Bancos.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div
          ref={formRef}
          className="bg-white border border-green-700 p-3 rounded-md max-w-4xl mx-auto text-[13px]"
          style={{ color: "#003300" }}
        >
          {/* Cabeçalho */}
          <div className="grid grid-cols-12 border border-green-700 p-2">
            <div className="col-span-2 flex items-start justify-center pr-2 border-r border-green-700">
              <img src="/SINPAF.png" alt="SINPAF" className="h-16 object-contain" />
            </div>

            <div className="col-span-8 px-2">
              <div className="border border-green-700 p-1 text-center">
                <div className="font-semibold text-sm">
                  Sindicato Nacional dos Trabalhadores de Pesquisa e
                  Desenvolvimento Agropecuário
                </div>
              </div>

              <div className="mt-2">
                <div className="text-center font-bold text-lg text-green-700">
                  SEÇÃO:
                </div>
                <div className="mt-1">
                  <Input
                    name="secao"
                    value={header.secao}
                    onChange={handleHeaderChange}
                    className="w-full h-7 text-sm border border-green-700"
                    placeholder=""
                  />
                </div>
              </div>
            </div>

            <div className="col-span-2 pl-2 border-l border-green-700">
              <div className="flex justify-between items-center">
                <div className="font-semibold text-sm">BOLETIM DE CAIXA E BANCOS</div>
              </div>
              <div className="mt-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex-1">
                    Nº
                    <Input
                      name="numero"
                      value={header.numero}
                      onChange={handleHeaderChange}
                      className="ml-2 h-7 text-sm border border-green-700"
                    />
                  </div>
                  <div className="flex-1">
                    Período:
                    <Input
                      name="periodo"
                      value={header.periodo}
                      onChange={handleHeaderChange}
                      className="ml-2 h-7 text-sm border border-green-700"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 1 - RESUMO */}
          <div className="mt-3 border border-green-700">
            <div className="bg-green-700 text-white px-2 py-1 font-semibold">1 - RESUMO</div>

            <div className="grid grid-cols-6 border-t border-green-700 text-sm">
              <div className="col-span-2 border-r border-green-700 p-1 font-semibold">DISPONIBILIDADES</div>
              <div className="col-span-1 border-r border-green-700 p-1 text-center font-semibold">SALDO ANTERIOR</div>
              <div className="col-span-1 border-r border-green-700 p-1 text-center font-semibold">ENTRADAS</div>
              <div className="col-span-1 border-r border-green-700 p-1 text-center font-semibold">SAÍDAS</div>
              <div className="col-span-1 p-1 text-center font-semibold">SALDO ATUAL</div>
            </div>

            {/* Caixa */}
            <div className="grid grid-cols-6 border-t border-green-200 text-sm">
              <div className="col-span-2 border-r border-green-700 p-1">Caixa</div>
              <div className="col-span-1 border-r border-green-700 p-1">
                <Input
                  value={resumo.caixa.saldoAnterior}
                  onChange={(e) => handleResumoChange("caixa", "saldoAnterior", e.target.value)}
                  className="w-full h-7 text-sm text-right"
                />
              </div>
              <div className="col-span-1 border-r border-green-700 p-1">
                <Input
                  value={resumo.caixa.entradas}
                  onChange={(e) => handleResumoChange("caixa", "entradas", e.target.value)}
                  className="w-full h-7 text-sm text-right"
                />
              </div>
              <div className="col-span-1 border-r border-green-700 p-1">
                <Input
                  value={resumo.caixa.saidas}
                  onChange={(e) => handleResumoChange("caixa", "saidas", e.target.value)}
                  className="w-full h-7 text-sm text-right"
                />
              </div>
              <div className="col-span-1 p-1">
                <Input
                  value={resumo.caixa.saldoAtual}
                  onChange={(e) => handleResumoChange("caixa", "saldoAtual", e.target.value)}
                  className="w-full h-7 text-sm text-right"
                />
              </div>
            </div>

            {/* Bancos */}
            <div className="grid grid-cols-6 border-t border-green-200 text-sm">
              <div className="col-span-2 border-r border-green-700 p-1">Bancos</div>
              <div className="col-span-1 border-r border-green-700 p-1">
                <Input
                  value={resumo.bancos.saldoAnterior}
                  onChange={(e) => handleResumoChange("bancos", "saldoAnterior", e.target.value)}
                  className="w-full h-7 text-sm text-right"
                />
              </div>
              <div className="col-span-1 border-r border-green-700 p-1">
                <Input
                  value={resumo.bancos.entradas}
                  onChange={(e) => handleResumoChange("bancos", "entradas", e.target.value)}
                  className="w-full h-7 text-sm text-right"
                />
              </div>
              <div className="col-span-1 border-r border-green-700 p-1">
                <Input
                  value={resumo.bancos.saidas}
                  onChange={(e) => handleResumoChange("bancos", "saidas", e.target.value)}
                  className="w-full h-7 text-sm text-right"
                />
              </div>
              <div className="col-span-1 p-1">
                <Input
                  value={resumo.bancos.saldoAtual}
                  onChange={(e) => handleResumoChange("bancos", "saldoAtual", e.target.value)}
                  className="w-full h-7 text-sm text-right"
                />
              </div>
            </div>

            {/* SUB-TOTAL */}
            <div className="grid grid-cols-6 border-t border-green-200 text-sm">
              <div className="col-span-2 border-r border-green-700 p-1">SUB-TOTAL</div>
              <div className="col-span-1 border-r border-green-700 p-1">
                <Input
                  value={resumo.subTotal.saldoAnterior}
                  onChange={(e) => handleResumoChange("subTotal", "saldoAnterior", e.target.value)}
                  className="w-full h-7 text-sm text-right"
                />
              </div>
              <div className="col-span-1 border-r border-green-700 p-1">
                <Input
                  value={resumo.subTotal.entradas}
                  onChange={(e) => handleResumoChange("subTotal", "entradas", e.target.value)}
                  className="w-full h-7 text-sm text-right"
                />
              </div>
              <div className="col-span-1 border-r border-green-700 p-1">
                <Input
                  value={resumo.subTotal.saidas}
                  onChange={(e) => handleResumoChange("subTotal", "saidas", e.target.value)}
                  className="w-full h-7 text-sm text-right"
                />
              </div>
              <div className="col-span-1 p-1">
                <Input
                  value={resumo.subTotal.saldoAtual}
                  onChange={(e) => handleResumoChange("subTotal", "saldoAtual", e.target.value)}
                  className="w-full h-7 text-sm text-right"
                />
              </div>
            </div>

            {/* Aplicações */}
            <div className="grid grid-cols-6 border-t border-green-200 text-sm">
              <div className="col-span-2 border-r border-green-700 p-1">Aplicações</div>
              <div className="col-span-1 border-r border-green-700 p-1">
                <Input
                  value={resumo.aplicacoes.saldoAnterior}
                  onChange={(e) => handleResumoChange("aplicacoes", "saldoAnterior", e.target.value)}
                  className="w-full h-7 text-sm text-right"
                />
              </div>
              <div className="col-span-1 border-r border-green-700 p-1">
                <Input
                  value={resumo.aplicacoes.entradas}
                  onChange={(e) => handleResumoChange("aplicacoes", "entradas", e.target.value)}
                  className="w-full h-7 text-sm text-right"
                />
              </div>
              <div className="col-span-1 border-r border-green-700 p-1">
                <Input
                  value={resumo.aplicacoes.saidas}
                  onChange={(e) => handleResumoChange("aplicacoes", "saidas", e.target.value)}
                  className="w-full h-7 text-sm text-right"
                />
              </div>
              <div className="col-span-1 p-1">
                <Input
                  value={resumo.aplicacoes.saldoAtual}
                  onChange={(e) => handleResumoChange("aplicacoes", "saldoAtual", e.target.value)}
                  className="w-full h-7 text-sm text-right"
                />
              </div>
            </div>

            {/* TOTAL */}
            <div className="grid grid-cols-6 border-t border-green-200 text-sm">
              <div className="col-span-2 border-r border-green-700 p-1 font-semibold">TOTAL</div>
              <div className="col-span-1 border-r border-green-700 p-1">
                <Input
                  value={resumo.total.saldoAnterior}
                  onChange={(e) => handleResumoChange("total", "saldoAnterior", e.target.value)}
                  className="w-full h-7 text-sm text-right font-semibold"
                />
              </div>
              <div className="col-span-1 border-r border-green-700 p-1">
                <Input
                  value={resumo.total.entradas}
                  onChange={(e) => handleResumoChange("total", "entradas", e.target.value)}
                  className="w-full h-7 text-sm text-right font-semibold"
                />
              </div>
              <div className="col-span-1 border-r border-green-700 p-1">
                <Input
                  value={resumo.total.saidas}
                  onChange={(e) => handleResumoChange("total", "saidas", e.target.value)}
                  className="w-full h-7 text-sm text-right font-semibold"
                />
              </div>
              <div className="col-span-1 p-1">
                <Input
                  value={resumo.total.saldoAtual}
                  onChange={(e) => handleResumoChange("total", "saldoAtual", e.target.value)}
                  className="w-full h-7 text-sm text-right font-semibold"
                />
              </div>
            </div>
          </div>

          {/* 2 - Discriminação das disponibilidades bancárias */}
          <div className="mt-3 border border-green-700">
            <div className="bg-green-700 text-white px-2 py-1 font-semibold">2 - DISCRIMINAÇÃO DAS DISPONIBILIDADES BANCÁRIAS</div>

            <div className="grid grid-cols-5 border-t border-green-700 text-sm font-semibold">
              <div className="p-1 border-r border-green-700">INSTITUIÇÃO</div>
              <div className="p-1 border-r border-green-700 text-center">SALDO ANTERIOR</div>
              <div className="p-1 border-r border-green-700 text-center">ENTRADAS</div>
              <div className="p-1 border-r border-green-700 text-center">SAÍDAS</div>
              <div className="p-1 text-center">SALDO ATUAL</div>
            </div>

            {bancosRows.map((row, idx) => (
              <div key={idx} className="grid grid-cols-5 border-t border-green-200 text-sm">
                <div className="p-1 border-r border-green-700">
                  <Input
                    value={row.instituicao}
                    onChange={(e) => handleBancosChange(idx, "instituicao", e.target.value)}
                    className="w-full h-8 text-sm"
                    placeholder=""
                  />
                </div>
                <div className="p-1 border-r border-green-700">
                  <Input
                    value={row.saldoAnterior}
                    onChange={(e) => handleBancosChange(idx, "saldoAnterior", e.target.value)}
                    className="w-full h-8 text-sm text-right"
                  />
                </div>
                <div className="p-1 border-r border-green-700">
                  <Input
                    value={row.entradas}
                    onChange={(e) => handleBancosChange(idx, "entradas", e.target.value)}
                    className="w-full h-8 text-sm text-right"
                  />
                </div>
                <div className="p-1 border-r border-green-700">
                  <Input
                    value={row.saidas}
                    onChange={(e) => handleBancosChange(idx, "saidas", e.target.value)}
                    className="w-full h-8 text-sm text-right"
                  />
                </div>
                <div className="p-1">
                  <Input
                    value={row.saldoAtual}
                    onChange={(e) => handleBancosChange(idx, "saldoAtual", e.target.value)}
                    className="w-full h-8 text-sm text-right"
                  />
                </div>
              </div>
            ))}

            {/* Totais linha */}
            <div className="grid grid-cols-5 border-t border-green-700 text-sm font-semibold">
              <div className="p-1 border-r border-green-700">TOTAL</div>
              <div className="p-1 border-r border-green-700 text-right">-</div>
              <div className="p-1 border-r border-green-700 text-right">-</div>
              <div className="p-1 border-r border-green-700 text-right">-</div>
              <div className="p-1 text-right">-</div>
            </div>
          </div>

          {/* 3 - Discriminação das aplicações financeiras */}
          <div className="mt-3 border border-green-700">
            <div className="bg-green-700 text-white px-2 py-1 font-semibold">3 - DISCRIMINAÇÃO DAS APLICAÇÕES FINANCEIRAS</div>

            <div className="grid grid-cols-5 border-t border-green-700 text-sm font-semibold">
              <div className="p-1 border-r border-green-700">INSTITUIÇÃO</div>
              <div className="p-1 border-r border-green-700">TIPO</div>
              <div className="p-1 border-r border-green-700 text-center">DATA DA APLICAÇÃO</div>
              <div className="p-1 border-r border-green-700 text-center">RESGATE</div>
              <div className="p-1 text-center">VALOR</div>
            </div>

            {aplicRows.map((r, i) => (
              <div key={i} className="grid grid-cols-5 border-t border-green-200 text-sm">
                <div className="p-1 border-r border-green-700">
                  <Input
                    value={r.instituicao}
                    onChange={(e) => handleAplicChange(i, "instituicao", e.target.value)}
                    className="w-full h-8 text-sm"
                  />
                </div>
                <div className="p-1 border-r border-green-700">
                  <Input
                    value={r.tipo}
                    onChange={(e) => handleAplicChange(i, "tipo", e.target.value)}
                    className="w-full h-8 text-sm"
                  />
                </div>
                <div className="p-1 border-r border-green-700">
                  <Input
                    value={r.dataAplicacao}
                    onChange={(e) => handleAplicChange(i, "dataAplicacao", e.target.value)}
                    className="w-full h-8 text-sm"
                  />
                </div>
                <div className="p-1 border-r border-green-700">
                  <Input
                    value={r.resgate}
                    onChange={(e) => handleAplicChange(i, "resgate", e.target.value)}
                    className="w-full h-8 text-sm"
                  />
                </div>
                <div className="p-1">
                  <Input
                    value={r.valor}
                    onChange={(e) => handleAplicChange(i, "valor", e.target.value)}
                    className="w-full h-8 text-sm text-right"
                  />
                </div>
              </div>
            ))}

            <div className="grid grid-cols-5 border-t border-green-700 text-sm font-semibold">
              <div className="p-1 border-r border-green-700">TOTAL</div>
              <div className="p-1 border-r border-green-700 text-center">-</div>
              <div className="p-1 border-r border-green-700 text-center">-</div>
              <div className="p-1 border-r border-green-700 text-center">-</div>
              <div className="p-1 text-right">-</div>
            </div>
          </div>

          {/* Observações */}
          <div className="mt-3 border border-green-700 p-2">
            <div className="font-semibold text-sm">Observações:</div>
            <Textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className="w-full h-24 mt-2 resize-none border border-green-700 text-sm"
            />
          </div>

          {/* Rodapé assinaturas */}
<div className="mt-4 border border-green-700">
  <div className="grid grid-cols-3 text-sm">
    <div className="p-3 border-r border-green-700 text-center">Preparado por</div>
    <div className="p-3 border-r border-green-700 text-center">Conferido por</div>
    <div className="p-3 text-center">Aprovado por</div>
  </div>

  <div className="grid grid-cols-3 border-t border-green-700 text-sm">
    <div className="p-3 border-r border-green-700 text-center">
      <Input
        name="preparadoNome"
        value={assinaturas.preparadoNome}
        onChange={handleAssinaturasChange}
        className="w-full h-8 text-sm"
        placeholder="Nome"
      />
    </div>
    <div className="p-3 border-r border-green-700 text-center">
      <Input
        name="conferidoNome"
        value={assinaturas.conferidoNome}
        onChange={handleAssinaturasChange}
        className="w-full h-8 text-sm"
        placeholder="Nome"
      />
    </div>
    <div className="p-3 text-center">
      <Input
        name="aprovadoNome"
        value={assinaturas.aprovadoNome}
        onChange={handleAssinaturasChange}
        className="w-full h-8 text-sm"
        placeholder="Nome"
      />
    </div>
  </div>
</div>


          {/* Botão PDF */}
          <div className="mt-4 flex justify-center">
            <Button onClick={generatePDF} size="lg" className="gap-2">
              <Download className="w-4 h-4" />
              Salvar como PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormBCB;
