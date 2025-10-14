// src/components/FormPCV.jsx
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * FormPCV.jsx
 * PCV - Prestação de Contas de Viagem
 * - Usa public/SINPAF.png como logo
 * - Gera PDF Prestacao_Contas_Viagem.pdf
 * - Todos os campos editáveis (Inputs / Textareas)
 * - Layout inspirado na imagem fornecida
 */

const NUM_ITEM_ROWS = 12; // número de linhas na tabela de despesas (ITEM / HISTÓRICO / DIÁRIAS / HOSPEDAGEM / OUTRAS)

const FormPCV = () => {
  const formRef = useRef(null);

  // Cabeçalho
  const [cabecalho, setCabecalho] = useState({
    secao: "",
    numero: "",
    ano: "",
    sinpafChecked: false,
    convidadoChecked: false,
    // outros campos se desejar
  });

  // Favorecido bloco
  const [favorecido, setFavorecido] = useState({
    nome: "",
    cpf: "",
    cargo: "",
    banco: "",
    agencia: "",
    cidadeEstado: "",
    cc: "",
  });

  // Roteiro / Objetivo / Observações principais
  const [roteiro, setRoteiro] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [obsPrincipais, setObsPrincipais] = useState("");

  // Saída / Retorno / Outros / Valores
  const [viagemInfo, setViagemInfo] = useState({
    saidaDias: "",
    saidaValorDiarias: "",
    saidaAdiantDiariaCapital: "",
    retornoDias: "",
    retornoValorDiarias: "",
    retornoAdiantDiariaInterior: "",
    outrosDescricao: "",
    outrosValor: "",
    totalAdiantamento: "",
    valorTotal: "",
    valorPorExtenso: "",
  });

  // Adiantamento recebido em passagem
  const [passagem, setPassagem] = useState({
    fornecedor: "",
    numBilhete: "",
    trechos: "",
  });

  // Periodo efetivo da viagem
  const [periodoViagem, setPeriodoViagem] = useState({
    saidaData: "",
    saidaHora: "",
    retornoData: "",
    retornoHora: "",
    nDiasC: "",
    valorDiariasC: "",
    nDiasI: "",
    valorDiariasI: "",
  });

  // Itens de despesas (linha por linha)
  const initialItems = Array.from({ length: NUM_ITEM_ROWS }, (_, i) => ({
    item: i + 1,
    historico: i === 0 ? "DIÁRIAS" : i === 1 ? "TÁXI URBANO" : "",
    diarias: "",
    hospedagem: "",
    outras: "",
  }));
  const [items, setItems] = useState(initialItems);

  // Totais / Saldo / Receber/Devolver checks
  const [totais, setTotais] = useState({
    totalDespesasDiarias: "",
    totalDespesasHospedagem: "",
    totalDespesasOutras: "",
    adiantamentoRecebidoEspecie: "",
    totalGeralDespesa: "",
    saldoTipo: "", // "Receber" | "Devolver"
  });

  // Observações vertical (apenas texto)
  const [observacaoVertical, setObservacaoVertical] = useState("");

  // Rodapé assinaturas
  const [rodape, setRodape] = useState({
    emitenteData: "",
    emitenteVisto: "",
    recebiDocData: "",
    recebiDocVisto: "",
    conferidoData: "",
    conferidoVisto: "",
    aprovacaoData: "",
    aprovacaoVisto: "",
    recebiLocal: "",
    recebiDataFinal: "",
    recebiAssinatura: "",
  });

  // Handlers gerais
  const handleCabecalhoChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCabecalho((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  };

  const handleFavChange = (e) => {
    const { name, value } = e.target;
    setFavorecido((s) => ({ ...s, [name]: value }));
  };

  const handleViagemInfoChange = (e) => {
    const { name, value } = e.target;
    setViagemInfo((s) => ({ ...s, [name]: value }));
  };

  const handlePassagemChange = (e) => {
    const { name, value } = e.target;
    setPassagem((s) => ({ ...s, [name]: value }));
  };

  const handlePeriodoChange = (e) => {
    const { name, value } = e.target;
    setPeriodoViagem((s) => ({ ...s, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleTotaisChange = (e) => {
    const { name, value } = e.target;
    setTotais((s) => ({ ...s, [name]: value }));
  };

  const handleRodapeChange = (e) => {
    const { name, value } = e.target;
    setRodape((s) => ({ ...s, [name]: value }));
  };

  // PDF
  const generatePDF = async () => {
    if (!formRef.current) return;

    // html2canvas com escala para qualidade
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
    pdf.save("Prestacao_Contas_Viagem.pdf");
  };

  // markup — replicando fielmente o layout com Tailwind classes e bordas verdes
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div
          ref={formRef}
          className="bg-white border border-green-700 p-2 rounded-md max-w-5xl mx-auto text-[12px]"
          style={{ color: "#003300" }}
        >
          {/* -------- Cabeçalho superior com logo e título ---------- */}
          <div className="grid grid-cols-12 border border-green-700">
            <div className="col-span-2 p-2 flex items-start justify-center border-r border-green-700">
              <img src="/SINPAF.png" alt="SINPAF" className="h-16 object-contain" />
            </div>

            <div className="col-span-8 p-2 border-r border-green-700">
              <div className="text-center font-semibold text-sm">
                Sindicato Nacional dos Trabalhadores de Pesquisa e
                Desenvolvimento Agropecuário
              </div>
              <div className="mt-2">
                <div className="text-center text-red-600 font-bold text-lg">
                  PCV - PRESTAÇÃO DE CONTAS DE VIAGEM
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 items-center">
                  <div className="col-span-2">
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-semibold">SEÇÃO:</div>
                      <Input
                        name="secao"
                        value={cabecalho.secao}
                        onChange={handleCabecalhoChange}
                        className="h-7 text-sm border border-green-700 w-1/2"
                      />
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="grid grid-cols-3 gap-1 items-center">
                      <div className="text-sm">Número</div>
                      <Input
                        name="numero"
                        value={cabecalho.numero}
                        onChange={handleCabecalhoChange}
                        className="h-7 text-sm border border-green-700 col-span-1"
                      />
                      <Input
                        name="ano"
                        value={cabecalho.ano}
                        onChange={handleCabecalhoChange}
                        className="h-7 text-sm border border-green-700 col-span-1"
                        placeholder="Ano"
                      />
                    </div>
                  </div>
                </div>

                {/* checkbox linha SINPAF / convidado as in image */}
                <div className="mt-1 text-sm">
                  <label className="inline-flex items-center mr-4">
                    <input
                      type="checkbox"
                      name="sinpafChecked"
                      checked={cabecalho.sinpafChecked}
                      onChange={handleCabecalhoChange}
                      className="mr-1"
                    />
                    SINPAF
                  </label>
                  <label className="inline-flex items-center mr-4">
                    <input
                      type="checkbox"
                      name="convidadoChecked"
                      checked={cabecalho.convidadoChecked}
                      onChange={handleCabecalhoChange}
                      className="mr-1"
                    />
                     CONVIDADO
                  </label>
                </div>
              </div>
            </div>

            <div className="col-span-2 p-2">
              <div className="text-right text-sm">
                <div className="font-semibold">
                  Número / Ano
                </div>
                <div className="mt-2 text-right">
                  <div className="text-sm">Nº</div>
                </div>
              </div>
            </div>
          </div>

          {/* -------- FAVORECIDO bloco ---------- */}
          <div className="border border-green-700 mt-2">
            <div className="bg-green-700 text-white px-2 py-1 font-semibold">F A V O R E C I D O</div>

            <div className="p-2 grid grid-cols-6 gap-1 text-sm">
              <div className="col-span-3">
                <div className="flex items-center">
                  <div className="w-20">Nome:</div>
                  <Input name="nome" value={favorecido.nome} onChange={handleFavChange} className="h-7 text-sm w-full border border-green-700" />
                </div>
              </div>
              <div className="col-span-1">
                <div className="flex items-center">
                  <div className="w-16">CPF:</div>
                  <Input name="cpf" value={favorecido.cpf} onChange={handleFavChange} className="h-7 text-sm w-full border border-green-700" />
                </div>
              </div>
              <div className="col-span-2">
                <div className="flex items-center">
                  <div className="w-16">Cargo:</div>
                  <Input name="cargo" value={favorecido.cargo} onChange={handleFavChange} className="h-7 text-sm w-full border border-green-700" />
                </div>
              </div>

              <div className="col-span-2">
                <div className="flex items-center mt-1">
                  <div className="w-20">Banco:</div>
                  <Input name="banco" value={favorecido.banco} onChange={handleFavChange} className="h-7 text-sm w-full border border-green-700" />
                </div>
              </div>
              <div className="col-span-2">
                <div className="flex items-center mt-1">
                  <div className="w-20">Agência:</div>
                  <Input name="agencia" value={favorecido.agencia} onChange={handleFavChange} className="h-7 text-sm w-full border border-green-700" />
                </div>
              </div>
              <div className="col-span-2">
                <div className="flex items-center mt-1">
                  <div className="w-20">Cidade/Estado:</div>
                  <Input name="cidadeEstado" value={favorecido.cidadeEstado} onChange={handleFavChange} className="h-7 text-sm w-full border border-green-700" />
                </div>
              </div>

              <div className="col-span-2 mt-1">
                <div className="flex items-center">
                  <div className="w-20">C/C:</div>
                  <Input name="cc" value={favorecido.cc} onChange={handleFavChange} className="h-7 text-sm w-full border border-green-700" />
                </div>
              </div>

              {/* Roteiro / Objetivo / Observações */}
              <div className="col-span-6 mt-2">
                <div className="text-sm font-semibold">Roteiro:</div>
                <Textarea value={roteiro} onChange={(e) => setRoteiro(e.target.value)} className="w-full h-8 resize-none border border-green-700 text-sm" />
              </div>

              <div className="col-span-6 mt-2">
                <div className="text-sm font-semibold">Objetivo:</div>
                <Textarea value={objetivo} onChange={(e) => setObjetivo(e.target.value)} className="w-full h-8 resize-none border border-green-700 text-sm" />
              </div>

              <div className="col-span-6 mt-2">
                <div className="text-sm font-semibold">Observações:</div>
                <Textarea value={obsPrincipais} onChange={(e) => setObsPrincipais(e.target.value)} className="w-full h-12 resize-none border border-green-700 text-sm" />
              </div>
            </div>
          </div>

          {/* -------- Saída / Retorno / Outros / Totais bloco ---------- */}
          {/* Seção de Saída / Retorno / Outros / Valor Total */}
<div className="grid grid-cols-2 border border-green-700 text-sm mt-1">
  {/* Coluna Esquerda */}
  <div className="border-r border-green-700 p-2 space-y-2">
    {/* Saída */}
    <div className="grid grid-cols-12 items-center gap-2">
      <div className="col-span-2 font-semibold">Saída:</div>
      <div className="col-span-2 flex items-center gap-1">
        <span className="text-xs">Nº dias (C):</span>
        <Input className="h-6 w-full border-green-700" />
      </div>
      <div className="col-span-3 flex items-center gap-1">
        <span className="text-xs">Valor das Diárias (C):</span>
        <Input className="h-6 w-full border-green-700" />
      </div>
      <div className="col-span-5 flex items-center gap-1">
        <span className="text-xs">Adiant. Total Diária de Capital:</span>
        <Input className="h-6 w-full border-green-700" />
      </div>
    </div>

    {/* Retorno */}
    <div className="grid grid-cols-12 items-center gap-2">
      <div className="col-span-2 font-semibold">Retorno:</div>
      <div className="col-span-2 flex items-center gap-1">
        <span className="text-xs">Nº dias (I):</span>
        <Input className="h-6 w-full border-green-700" />
      </div>
      <div className="col-span-3 flex items-center gap-1">
        <span className="text-xs">Valor das Diárias (I):</span>
        <Input className="h-6 w-full border-green-700" />
      </div>
      <div className="col-span-5 flex items-center gap-1">
        <span className="text-xs">Adiant. Total Diária de Interior:</span>
        <Input className="h-6 w-full border-green-700" />
      </div>
    </div>

    {/* Outros */}
    <div className="grid grid-cols-12 items-center gap-2">
      <div className="col-span-2 font-semibold">Outros:</div>
      <div className="col-span-4 flex items-center gap-1">
        <span className="text-xs">Descrição:</span>
        <Input className="h-6 w-full border-green-700" />
      </div>
      <div className="col-span-3 flex items-center gap-1">
        <span className="text-xs">Valor (R$):</span>
        <Input className="h-6 w-full border-green-700" />
      </div>
      <div className="col-span-3 flex items-center gap-1">
        <span className="text-xs">Total Adiantamento (R$):</span>
        <Input className="h-6 w-full border-green-700" />
      </div>
    </div>

    {/* Valor Total */}
    <div className="grid grid-cols-12 items-center gap-2">
      <div className="col-span-2 font-semibold">Valor Total (R$):</div>
      <div className="col-span-4">
        <Input className="h-6 w-full border-green-700" />
      </div>
      <div className="col-span-6 flex items-center gap-1">
        <span className="text-xs">Valor Total Por Extenso (R$):</span>
        <Input className="h-6 w-full border-green-700" />
      </div>
    </div>
  </div>

  {/* Coluna Direita */}
  <div className="p-2 space-y-2">
    <div className="font-semibold text-center">
      ADIANTAMENTO RECEBIDO EM PASSAGEM - R$
    </div>
    <div className="text-xs italic text-center">
      EM CASO DE RECUPERAÇÃO DE PASSAGEM INDICAR:
    </div>
    <div className="grid grid-cols-3 gap-2 mt-1">
      <div>
        <span className="text-xs">Fornecedor</span>
        <Input className="h-6 w-full border-green-700" />
      </div>
      <div>
        <span className="text-xs">Número do Bilhete</span>
        <Input className="h-6 w-full border-green-700" />
      </div>
      <div>
        <span className="text-xs">Trecho(s)</span>
        <Input className="h-6 w-full border-green-700" />
      </div>
    </div>

    <div className="font-semibold text-center mt-3">
      PERÍODO EFETIVO DA VIAGEM
    </div>
    <div className="grid grid-cols-4 gap-2 text-xs text-center mt-1">
      <div className="col-span-2">
        <div className="font-semibold">Saída</div>
        <div className="grid grid-cols-2 gap-1 mt-1">
          <Input placeholder="Data" className="h-6 border-green-700" />
          <Input placeholder="Hora" className="h-6 border-green-700" />
        </div>
      </div>
      <div className="col-span-2">
        <div className="font-semibold">Retorno</div>
        <div className="grid grid-cols-2 gap-1 mt-1">
          <Input placeholder="Data" className="h-6 border-green-700" />
          <Input placeholder="Hora" className="h-6 border-green-700" />
        </div>
      </div>
    </div>

    <div className="grid grid-cols-4 gap-2 text-xs text-center mt-2">
      <div>
        <div className="font-semibold">Nº dias (C)</div>
        <Input className="h-6 border-green-700" />
      </div>
      <div>
        <div className="font-semibold">Valor Diárias (C)</div>
        <Input className="h-6 border-green-700" />
      </div>
      <div>
        <div className="font-semibold">Nº dias (I)</div>
        <Input className="h-6 border-green-700" />
      </div>
      <div>
        <div className="font-semibold">Valor Diárias (I)</div>
        <Input className="h-6 border-green-700" />
      </div>
    </div>
  </div>
</div>


          {/* -------- Tabela ITEM / HISTÓRICO / DIÁRIAS / HOSPEDAGEM / OUTRAS ---------- */}
          <div className="mt-3 border border-green-700">
            <div className="grid grid-cols-6 bg-green-50 text-green-700 text-sm font-semibold border-b border-green-700 p-2">
              <div className="col-span-1 border-r border-green-700 text-center">ITEM</div>
              <div className="col-span-3 border-r border-green-700 text-center">HISTÓRICO</div>
              <div className="col-span-1 border-r border-green-700 text-center">DIÁRIAS R$</div>
              <div className="col-span-1 text-center">HOSPEDAGEM R$</div>
              <div className="col-span-1 text-center hidden">OUTRAS R$</div>
            </div>

            {/* rows */}
            <div>
              {items.map((it, idx) => (
                <div key={idx} className="grid grid-cols-6 border-t border-green-200 text-sm">
                  <div className="col-span-1 p-1 border-r border-green-700 text-center">{it.item}</div>
                  <div className="col-span-3 p-1 border-r border-green-700">
                    <Textarea value={it.historico} onChange={(e) => handleItemChange(idx, "historico", e.target.value)} className="w-full h-9 resize-none border-none text-sm" />
                  </div>
                  <div className="col-span-1 p-1 border-r border-green-700">
                    <Input value={it.diarias} onChange={(e) => handleItemChange(idx, "diarias", e.target.value)} className="w-full h-8 text-sm text-right border border-green-100" />
                  </div>
                  <div className="col-span-1 p-1">
                    <Input value={it.hospedagem} onChange={(e) => handleItemChange(idx, "hospedagem", e.target.value)} className="w-full h-8 text-sm text-right border border-green-100" />
                  </div>
                </div>
              ))}
            </div>

            {/* Totais linha */}
            <div className="grid grid-cols-6 border-t border-green-700 text-sm font-semibold">
              <div className="col-span-1 p-2 border-r border-green-700">TOTAL DAS DESPESAS</div>
              <div className="col-span-3 p-2 border-r border-green-700"></div>
              <div className="col-span-1 p-2 border-r border-green-700">
                <Input name="totalDespesasDiarias" value={totais.totalDespesasDiarias} onChange={handleTotaisChange} className="w-full h-8 text-sm text-right" />
              </div>
              <div className="col-span-1 p-2">
                <Input name="totalDespesasHospedagem" value={totais.totalDespesasHospedagem} onChange={handleTotaisChange} className="w-full h-8 text-sm text-right" />
              </div>
            </div>

            {/* Adiantamento recebido em espécie e total geral */}
            <div className="grid grid-cols-6 border-t border-green-700 text-sm">
              <div className="col-span-3 p-2 border-r border-green-700">ADIANTAMENTO RECEBIDO EM ESPÉCIE - R$</div>
              <div className="col-span-1 p-2 border-r border-green-700">
                <Input name="adiantamentoRecebidoEspecie" value={totais.adiantamentoRecebidoEspecie} onChange={handleTotaisChange} className="w-full h-8 text-sm text-right" />
              </div>
              <div className="col-span-2 p-2">
                <div className="grid grid-cols-2 gap-1">
                  <div className="text-sm">TOTAL GERAL DA DESPESA (d + h + o) - R$</div>
                  <div>
                    <Input name="totalGeralDespesa" value={totais.totalGeralDespesa} onChange={handleTotaisChange} className="w-full h-8 text-sm text-right" />
                  </div>
                </div>
              </div>
            </div>

            {/* SALDO (Receber / Devolver) */}
            <div className="grid grid-cols-6 border-t border-green-700 text-sm items-center">
              <div className="col-span-2 p-2 border-r border-green-700">SALDO</div>
              <div className="col-span-2 p-2">
                <label className="inline-flex items-center mr-4">
                  <input type="radio" name="saldoTipo" checked={totais.saldoTipo === "Receber"} onChange={() => setTotais((s) => ({ ...s, saldoTipo: "Receber" }))} className="mr-1" />
                  Receber
                </label>
                <label className="inline-flex items-center mr-4">
                  <input type="radio" name="saldoTipo" checked={totais.saldoTipo === "Devolver"} onChange={() => setTotais((s) => ({ ...s, saldoTipo: "Devolver" }))} className="mr-1" />
                  Devolver
                </label>
              </div>
              <div className="col-span-2 p-2 text-right">
                <div className="text-sm">VALOR POR EXTENSO</div>
                <Input value={viagemInfo.valorPorExtenso} onChange={(e) => setViagemInfo((s) => ({ ...s, valorPorExtenso: e.target.value }))} className="w-full h-8 text-sm border border-green-700" />
              </div>
            </div>
          </div>

          {/* Observação vertical à esquerda + espaço em branco */}
          <div className="mt-3 grid grid-cols-12 gap-2">
            <div className="col-span-2">
              <div className="h-40 border border-green-700 text-center text-[12px] flex items-center justify-center" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
                OBSERVAÇÕES
              </div>
            </div>
            <div className="col-span-10 border border-green-700 p-2">
              <Textarea value={observacaoVertical} onChange={(e) => setObservacaoVertical(e.target.value)} className="w-full h-40 resize-none border-none text-sm" />
            </div>
          </div>

          {/* Rodapé assinaturas estilo tabela */}
          <div className="mt-3 border border-green-700">
            <div className="grid grid-cols-5 text-sm font-semibold">
              <div className="p-2 border-r border-green-700 text-center">EMITENTE</div>
              <div className="p-2 border-r border-green-700 text-center">RECEBI DOC.</div>
              <div className="p-2 border-r border-green-700 text-center">CONFERIDO</div>
              <div className="p-2 border-r border-green-700 text-center">APROVAÇÃO</div>
              <div className="p-2 text-center">Recebi o valor acima</div>
            </div>

            <div className="grid grid-cols-5 text-sm border-t border-green-700">
              {/* EMITENTE */}
              <div className="p-2 border-r border-green-700 text-center">
                <div className="text-xs">Data</div>
                <Input name="emitenteData" value={rodape.emitenteData} onChange={handleRodapeChange} className="w-32 mx-auto h-7 text-sm" />
                <div className="border-t border-dotted border-green-700 mt-3" />
                <div className="mt-1">Visto</div>
              </div>

              {/* RECEBI DOC */}
              <div className="p-2 border-r border-green-700 text-center">
                <div className="text-xs">Data</div>
                <Input name="recebiDocData" value={rodape.recebiDocData} onChange={handleRodapeChange} className="w-32 mx-auto h-7 text-sm" />
                <div className="border-t border-dotted border-green-700 mt-3" />
                <div className="mt-1">Visto</div>
              </div>

              {/* CONFERIDO */}
              <div className="p-2 border-r border-green-700 text-center">
                <div className="text-xs">Data</div>
                <Input name="conferidoData" value={rodape.conferidoData} onChange={handleRodapeChange} className="w-32 mx-auto h-7 text-sm" />
                <div className="border-t border-dotted border-green-700 mt-3" />
                <div className="mt-1">Visto</div>
              </div>

              {/* APROVAÇÃO */}
              <div className="p-2 border-r border-green-700 text-center">
                <div className="text-xs">Data</div>
                <Input name="aprovacaoData" value={rodape.aprovacaoData} onChange={handleRodapeChange} className="w-32 mx-auto h-7 text-sm" />
                <div className="border-t border-dotted border-green-700 mt-3" />
                <div className="mt-1">Visto</div>
              </div>

              {/* RECEBI O VALOR ACIMA */}
              <div className="p-2 text-center">
                <div className="text-xs">Local</div>
                <Input name="recebiLocal" value={rodape.recebiLocal} onChange={handleRodapeChange} className="w-32 mx-auto h-7 text-sm" />
                <div className="text-xs mt-2">Data</div>
                <Input name="recebiDataFinal" value={rodape.recebiDataFinal} onChange={handleRodapeChange} className="w-32 mx-auto h-7 text-sm" />
                <div className="border-t border-dotted border-green-700 mt-3" />
                <div className="mt-1">Assinatura</div>
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

export default FormPCV;
