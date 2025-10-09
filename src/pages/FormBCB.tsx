import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Download } from "lucide-react";

export default function AutorizacaoRecebimento() {
  const { toast } = useToast();

  const handleDownload = () => {
    toast({
      title: "Download",
      description: "Formulário gerado com sucesso!",
    });
  };

  return (
    <div className="w-full p-4 flex justify-center">
      <div className="border border-green-700 w-[900px] text-sm">
        {/* Cabeçalho */}
        <div className="grid grid-cols-12 border border-green-700 mb-1">
          <div className="col-span-3 flex items-center justify-center border-r border-green-700 p-2">
            <div className="text-center text-green-700 font-bold">
              <div className="text-2xl">SINPAF</div>
              <div className="text-xs">Filiação à CUT</div>
            </div>
          </div>
          <div className="col-span-6 text-center p-2 border-r border-green-700">
            <div className="text-green-700 font-semibold text-sm">
              Sindicato Nacional dos Trabalhadores de Pesquisa e Desenvolvimento Agropecuário
            </div>
            <div className="text-left mt-1 text-green-700 font-semibold text-sm">
              SEÇÃO: 
              <Input className="inline w-2/3 h-6 border border-green-700 ml-2 text-sm rounded-none focus:outline-none focus:ring-0" />
            </div>
          </div>
          <div className="col-span-3 text-center p-2">
            <div className="text-red-600 font-bold text-sm">
              AUTORIZAÇÃO DE RECEBIMENTO - AR
            </div>
            <div className="flex justify-between text-green-700 text-sm mt-1">
              <div>
                Nº 
                <Input className="inline w-16 h-6 border border-green-700 ml-1 text-sm rounded-none focus:outline-none focus:ring-0" />
              </div>
              <div>
                ANO: 
                <Input className="inline w-16 h-6 border border-green-700 ml-1 text-sm rounded-none focus:outline-none focus:ring-0" />
              </div>
            </div>
          </div>
        </div>

        {/* Favorecido */}
        <div className="border border-green-700">
          <div className="bg-green-700 text-white text-sm px-2 py-1 font-semibold">FAVORECIDO</div>
          <div className="grid grid-cols-2 border-t border-green-700 text-sm">
            <div className="border-r border-green-700 p-1">
              Nome:
              <Input className="inline w-5/6 h-6 border border-green-700 ml-2 text-sm rounded-none focus:outline-none focus:ring-0" />
            </div>
            <div className="p-1">
              CPF/CNPJ:
              <Input className="inline w-4/6 h-6 border border-green-700 ml-2 text-sm rounded-none focus:outline-none focus:ring-0" />
            </div>
          </div>
          <div className="grid grid-cols-2 border-t border-green-700 text-sm">
            <div className="border-r border-green-700 p-1">
              Endereço:
              <Input className="inline w-5/6 h-6 border border-green-700 ml-2 text-sm rounded-none focus:outline-none focus:ring-0" />
            </div>
            <div className="p-1">
              Cidade/UF:
              <Input className="inline w-4/6 h-6 border border-green-700 ml-2 text-sm rounded-none focus:outline-none focus:ring-0" />
            </div>
          </div>
          <div className="grid grid-cols-3 border-t border-green-700 text-sm">
            <div className="border-r border-green-700 p-1">
              Banco/C.C.:
              <Input className="inline w-3/4 h-6 border border-green-700 ml-2 text-sm rounded-none focus:outline-none focus:ring-0" />
            </div>
            <div className="border-r border-green-700 p-1">
              Agência:
              <Input className="inline w-3/4 h-6 border border-green-700 ml-2 text-sm rounded-none focus:outline-none focus:ring-0" />
            </div>
            <div className="p-1">
              Cidade/UF:
              <Input className="inline w-3/4 h-6 border border-green-700 ml-2 text-sm rounded-none focus:outline-none focus:ring-0" />
            </div>
          </div>
        </div>

        {/* Histórico e Valor */}
        <div className="border border-green-700 mt-1">
          <div className="grid grid-cols-6 bg-green-50 border-b border-green-700 text-green-700 text-sm font-semibold">
            <div className="col-span-5 border-r border-green-700 p-1">Histórico</div>
            <div className="col-span-1 p-1 text-center">Valor</div>
          </div>
          <div className="grid grid-cols-6 text-sm">
            <div className="col-span-5 border-r border-green-700">
              <Textarea className="w-full h-40 border-none resize-none text-sm rounded-none focus:outline-none focus:ring-0" />
            </div>
            <div className="col-span-1">
              <Textarea className="w-full h-40 border-none resize-none text-sm text-right rounded-none focus:outline-none focus:ring-0" />
            </div>
          </div>
          <div className="grid grid-cols-6 border-t border-green-700 text-sm">
            <div className="col-span-5 border-r border-green-700 text-right p-1 font-semibold text-green-700">TOTAL</div>
            <div className="col-span-1 text-right p-1">
              <Input className="w-full text-right border-none font-semibold text-sm rounded-none focus:outline-none focus:ring-0" />
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="grid grid-cols-4 border border-green-700 mt-2 text-sm">
          <div className="border-r border-green-700 text-center font-semibold text-green-700 p-1">
            AUTORIZO
          </div>
          <div className="border-r border-green-700 text-center p-1 text-[11px]"></div>
          <div className="border-r border-green-700 text-center font-semibold text-green-700 p-1"></div>
          <div className="text-center p-1 text-[11px]">Recebi a importância acima.</div>
        </div>

        <div className="grid grid-cols-4 border-x border-b border-green-700 text-sm">
          <div className="text-center p-4 border-r border-green-700">
            <div className="border-t border-green-700 mt-4" />
            <div className="text-green-700 mt-1">Data</div>
            <div className="border-t border-green-700 mt-4" />
            <div className="text-green-700 mt-1">Assinatura</div>
          </div>
          <div className="text-center p-4 border-r border-green-700">
            <div className="border-t border-green-700 mt-12" />
            <div className="text-green-700 mt-1">Assinatura</div>
          </div>
          <div className="text-center p-4 border-r border-green-700">
            <div className="border-t border-green-700 mt-12" />
            <div className="text-green-700 mt-1">Local</div>
          </div>
          <div className="text-center p-4">
            <div className="border-t border-green-700 mt-4" />
            <div className="text-green-700 mt-1">Assinatura</div>
            <div className="mt-4">____/____/______</div>
            <div>Data</div>
          </div>
        </div>

        {/* Botão download */}
        <div className="flex justify-end p-2">
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" /> Baixar
          </Button>
        </div>
      </div>
    </div>
  );
}
