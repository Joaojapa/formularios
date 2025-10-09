import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("email") || "";
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleGeneratePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Por favor, preencha seu e-mail");
      return;
    }

    setIsLoading(true);
    try {
      // Simulação de envio de senha aleatória
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Senha aleatória enviada para seu e-mail!");
    } catch (error: any) {
      console.error("Erro ao gerar senha:", error);
      toast.error(error.message || "Erro ao gerar senha. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-8 bg-cover bg-center relative"
      style={{
        backgroundImage: `url('/CNDH_Site.webp')`,
      }}
    >
      {/* Leve escurecimento no fundo */}
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 w-full max-w-md">
        <Card className="shadow-2xl rounded-2xl bg-white"> {/* Card branco e arredondado */}
          <CardHeader className="space-y-2 text-center">
            {/* Logo SINPAF */}
            <img
              src="/SINPAF.png"
              alt="Logo SINPAF"
              className="mx-auto w-28 h-auto mb-2"
            />
            <CardTitle className="text-2xl">Gerar Senha</CardTitle>
            <CardDescription>
              Informe o e-mail da sua SEÇÃO para receber uma senha aleatória
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleGeneratePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 rounded-xl"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 rounded-xl"
                disabled={isLoading}
              >
                {isLoading ? "Enviando..." : "Gerar Senha"}
              </Button>
            </form>

            <div className="text-center space-y-2">
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => navigate("/login")}
                disabled={isLoading}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
