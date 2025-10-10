import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function RecuperarSenha() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Digite seu e-mail");
      return;
    }

    setIsLoading(true);
    try {
      // Simula envio de link de recuperação
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Link de recuperação enviado!");
      navigate("/login"); // volta para login após envio
    } catch (error: any) {
      console.error("Erro ao enviar link:", error);
      toast.error(error.message || "Erro ao enviar Senha. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-8 bg-cover bg-center relative"
      style={{ backgroundImage: `url('/CNDH_Site.webp')` }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 w-full max-w-md">
        <Card className="shadow-2xl rounded-2xl bg-white">
          <CardHeader className="space-y-2 text-center">
            <img src="/SINPAF.png" alt="Logo SINPAF" className="mx-auto w-28 h-auto mb-2" />
            <CardTitle className="text-2xl">Recuperar Senha</CardTitle>
            <CardDescription>
              Insira seu e-mail para receber a senha temporária
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleRecover} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Digite seu e-mail"
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
                {isLoading ? "Enviando..." : "Enviar Senha"}
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
