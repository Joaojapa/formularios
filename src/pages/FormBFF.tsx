import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const NUM_ROWS = 35; // <- agora 35 linhas

const FormBFF = () => {
  const formRef = useRef(null);

  const initialRows = Array.from({ length: NUM_ROWS }, (_, i) => ({
    doc: String(i + 1).padStart(2, "0"),
    historico: "",
    valor: "",
  }));

  const [header, setHeader] = useState({
    secao: "",
    numero: "",
    ano: "",
    valorEmR$: "",
    periodoDe: "",
    periodoAte: "",
  });

  const [favorecido, setFavorecido] = useState({
    nome: "",
    cpfCnpj: "",
    endereco: "",
    cidadeUf: "",
    banco: "",
    agencia: "",
    cidadeUfBanco: "",
  });

  const [rows, setRows] = useState(initialRows);

  const [saldos, setSaldos] = useState({
    saldoAnterior: "",
    totalDespesa: "",
    saldoFinal: "",
  });

  const [assinaturas, setAssinaturas] = useState({
    responsavelData: "",
    conferenciaData: "",
    aprovacaoData: "",
    recebidoData: "",
  });

  const handleHeaderChange = (e) => {
    setHeader({ ...header, [e.target.name]: e.target.value });
  };

  const handleFavChange = (e) => {
    setFavorecido({ ...favorecido, [e.target.name]: e.target.value });
  };

  const handleRowChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], [field]: value };
    setRows(newRows);
  };

  const handleSaldosChange = (e) => {
    setSaldos({ ...saldos, [e.target.name]: e.target.value });
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
    pdf.save("Boletim_Fundo_Fixo.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div
          ref={formRef}
          className="bg-white border border-green-700 p-2 rounded-md max-w-6xl mx-auto text-[12px]"
          style={{ color: "#003300" }}
        >
          {/* Cabeçalho */}
          <div className="grid grid-cols-12 border border-green-700">
            <div className="col-span-3 flex items-center justify-center border-r border-green-700 p-2">
              <div className="flex items-center gap-3">
                <img src="/SINPAF.png" alt="SINPAF" className="h-14 object-contain" />
                <div className="text-green-700 font-bold leading-none">
                  <div className="text-lg"></div>
                </div>
              </div>
            </div>

            <div className="col-span-6 p-2 border-r border-green-700">
              <div className="text-center font-semibold text-sm text-green-700">
                Sindicato Nacional dos Trabalhadores de Pesquisa e Desenvolvimento Agropecuário
              </div>

              <div className="flex items-center mt-2">
                <div className="font-semibold text-sm text-green-700 pr-2">Boletim de Fundo Fixo</div>
                <div className="ml-4 w-full text-sm flex items-center">
                  <span className="font-semibold text-sm">SEÇÃO:</span>
                  <Input
                    name="secao"
                    value={header.secao}
                    onChange={handleHeaderChange}
                    className="ml-2 h-6 text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-between mt-1 text-[11px]">
                <div>VALOR EM R$:
                  <Input
                    name="valorEmR$"
                    value={header["valorEmR$"]}
                    onChange={handleHeaderChange}
                    className="ml-2 inline w-36 h-6 text-sm"
                  />
                </div>
                <div>
                  PERÍODO:
                  <span className="ml-2">de</span>
                  <Input
                    name="periodoDe"
                    value={header.periodoDe}
                    onChange={handleHeaderChange}
                    className="ml-2 inline w-28 h-6 text-sm"
                  />
                  <span className="ml-2">a</span>
                  <Input
                    name="periodoAte"
                    value={header.periodoAte}
                    onChange={handleHeaderChange}
                    className="ml-2 inline w-28 h-6 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="col-span-3 p-2">
              <div className="text-right">
                <div className="text-red-600 font-bold text-sm">BFF</div>
              </div>

              <div className="flex justify-end gap-2 mt-2 text-sm">
                <div className="flex items-center gap-1">
                  <span className="font-semibold">Nº</span>
                  <Input
                    name="numero"
                    value={header.numero}
                    onChange={handleHeaderChange}
                    className="w-20 h-6 text-sm"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold">Ano</span>
                  <Input
                    name="ano"
                    value={header.ano}
                    onChange={handleHeaderChange}
                    className="w-20 h-6 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="h-2" />

          {/* Favorecido */}
          <div className="border border-green-700">
            <div className="bg-green-700 text-white text-sm px-2 py-1 font-semibold">FAVORECIDO</div>

            <div className="grid grid-cols-2 border-t border-green-700 text-sm">
              <div className="border-r border-green-700 p-1">
                <span className="font-semibold">Nome:</span>
                <Input
                  name="nome"
                  value={favorecido.nome}
                  onChange={handleFavChange}
                  className="ml-2 inline w-5/6 h-6 text-sm"
                />
              </div>
              <div className="p-1">
                <span className="font-semibold">CPF/CNPJ:</span>
                <Input
                  name="cpfCnpj"
                  value={favorecido.cpfCnpj}
                  onChange={handleFavChange}
                  className="ml-2 inline w-4/6 h-6 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 border-t border-green-700 text-sm">
              <div className="border-r border-green-700 p-1">
                <span className="font-semibold">Endereço:</span>
                <Input
                  name="endereco"
                  value={favorecido.endereco}
                  onChange={handleFavChange}
                  className="ml-2 inline w-5/6 h-6 text-sm"
                />
              </div>
              <div className="p-1">
                <span className="font-semibold">Cidade/UF:</span>
                <Input
                  name="cidadeUf"
                  value={favorecido.cidadeUf}
                  onChange={handleFavChange}
                  className="ml-2 inline w-4/6 h-6 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 border-t border-green-700 text-sm">
              <div className="border-r border-green-700 p-1">
                <span className="font-semibold">Banco/C.C.:</span>
                <Input
                  name="banco"
                  value={favorecido.banco}
                  onChange={handleFavChange}
                  className="ml-2 inline w-3/4 h-6 text-sm"
                />
              </div>
              <div className="border-r border-green-700 p-1">
                <span className="font-semibold">Agência:</span>
                <Input
                  name="agencia"
                  value={favorecido.agencia}
                  onChange={handleFavChange}
                  className="ml-2 inline w-3/4 h-6 text-sm"
                />
              </div>
              <div className="p-1">
                <span className="font-semibold">Cidade/UF:</span>
                <Input
                  name="cidadeUfBanco"
                  value={favorecido.cidadeUfBanco}
                  onChange={handleFavChange}
                  className="ml-2 inline w-3/4 h-6 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Tabela */}
          <div className="border border-green-700 mt-1 overflow-hidden">
            <div className="grid grid-cols-6 bg-green-50 border-b border-green-700 text-green-700 text-sm font-semibold">
              <div className="col-span-1 border-r border-green-700 p-1 text-center">DOC.Nº</div>
              <div className="col-span-4 border-r border-green-700 p-1">HISTÓRICO</div>
              <div className="col-span-1 p-1 text-center">VALOR EM R$</div>
            </div>

            {/* Renderiza 35 linhas */}
            <div>
              {rows.map((r, idx) => (
                <div key={idx} className="grid grid-cols-6 text-sm border-b border-green-100">
                  <div className="col-span-1 border-r border-green-700 p-1 text-center">{r.doc}</div>
                  <div className="col-span-4 border-r border-green-700 p-1">
                    <Textarea
                      value={r.historico}
                      onChange={(e) => handleRowChange(idx, "historico", e.target.value)}
                      className="w-full h-10 resize-none border-none text-sm"
                    />
                  </div>
                  <div className="col-span-1 p-1">
                    <Input
                      value={r.valor}
                      onChange={(e) => handleRowChange(idx, "valor", e.target.value)}
                      className="w-full text-right h-8 text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Saldos */}
            <div className="grid grid-cols-6 border-t border-green-700 text-sm">
              <div className="col-span-5 border-r border-green-700 p-1 font-semibold text-green-700 text-right">
                SALDO ANTERIOR:
              </div>
              <div className="col-span-1 p-1 text-right">
                <Input
                  name="saldoAnterior"
                  value={saldos.saldoAnterior}
                  onChange={handleSaldosChange}
                  className="w-full text-right h-6 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-6 border-t border-green-700 text-sm">
              <div className="col-span-5 border-r border-green-700 p-1 font-semibold text-green-700 text-right">
                TOTAL DA DESPESA:
              </div>
              <div className="col-span-1 p-1 text-right">
                <Input
                  name="totalDespesa"
                  value={saldos.totalDespesa}
                  onChange={handleSaldosChange}
                  className="w-full text-right h-6 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-6 border-t border-green-700 text-sm">
              <div className="col-span-5 border-r border-green-700 p-1 font-semibold text-green-700 text-right">
                SALDO FINAL DO FUNDO FIXO:
              </div>
              <div className="col-span-1 p-1 text-right">
                <Input
                  name="saldoFinal"
                  value={saldos.saldoFinal}
                  onChange={handleSaldosChange}
                  className="w-full text-right h-6 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Rodapé de assinaturas */}
          <div className="grid grid-cols-4 border border-green-700 mt-2 text-sm">
            <div className="border-r border-green-700 text-center font-semibold text-green-700 p-2">RESPONSÁVEL</div>
            <div className="border-r border-green-700 text-center p-2 text-[11px]">ATESTO QUE OS SERVIÇOS FORAM PRESTADOS</div>
            <div className="border-r border-green-700 text-center font-semibold text-green-700 p-2">CONFERÊNCIA / APROVAÇÃO</div>
            <div className="text-center p-2 text-[11px]">Recebi a importância correspondente ao reembolso dos pagamentos constantes do presente boletim.</div>
          </div>

          <div className="grid grid-cols-4 border-x border-b border-green-700 text-sm">
            <div className="p-4 border-r border-green-700 text-center">
              <div className="text-[11px]">Data</div>
              <Input
                name="responsavelData"
                value={assinaturas.responsavelData}
                onChange={handleAssinaturasChange}
                className="mx-auto mt-1 w-32 h-6 text-sm"
              />
              <div className="border-t border-dotted border-green-700 mt-4" />
              <div className="text-green-700 mt-1">Assinatura</div>
            </div>

            <div className="p-4 border-r border-green-700 text-center">
              <div className="text-[11px]">Data</div>
              <Input
                name="conferenciaData"
                value={assinaturas.conferenciaData}
                onChange={handleAssinaturasChange}
                className="mx-auto mt-1 w-32 h-6 text-sm"
              />
              <div className="border-t border-dotted border-green-700 mt-4" />
              <div className="text-green-700 mt-1">Assinatura</div>
            </div>

            <div className="p-4 border-r border-green-700 text-center">
              <div className="text-[11px]">Data</div>
              <Input
                name="aprovacaoData"
                value={assinaturas.aprovacaoData}
                onChange={handleAssinaturasChange}
                className="mx-auto mt-1 w-32 h-6 text-sm"
              />
              <div className="border-t border-dotted border-green-700 mt-4" />
              <div className="text-green-700 mt-1">Assinatura</div>
            </div>

            <div className="p-4 text-center">
              <div className="text-[11px]">Data</div>
              <Input
                name="recebidoData"
                value={assinaturas.recebidoData}
                onChange={handleAssinaturasChange}
                className="mx-auto mt-1 w-32 h-6 text-sm"
              />
              <div className="border-t border-dotted border-green-700 mt-4" />
              <div className="text-green-700 mt-1">Assinatura</div>
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

export default FormBFF;
