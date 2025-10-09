import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, User } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!identifier || !password) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    toast.success("Login realizado com sucesso!");
    navigate("/"); // redireciona para dashboard ou página inicial
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: `url('/CNDH_Site.webp')`, // imagem de fundo
      }}
    >
      {/* Leve escurecimento no fundo */}
      <div className="bg-black/50 absolute inset-0"></div>

      <div className="relative z-10 flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md shadow-2xl bg-white rounded-2xl"> {/* card branco sólido */}
          <CardHeader className="space-y-2 text-center">
            {/* Logo SINPAF */}
            <img
              src="/SINPAF.png"
              alt="Logo SINPAF"
              className="mx-auto w-28 h-auto mb-2"
            />
            <h2 className="text-2xl font-bold text-green-700"></h2>
            <CardTitle className="text-2xl">Bem-vindo de volta</CardTitle>
            <CardDescription>
              Entre com as credenciais da seção para acessar o sistema
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identifier">E-mail</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="identifier"
                    type="text"
                    placeholder="E-mail da seção"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="pl-10 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 rounded-xl"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 rounded-xl"
              >
                Entrar
              </Button>
            </form>

            <div className="text-center space-y-2">
              <a
                href="#"
                className="text-sm text-destructive hover:underline block"
                onClick={(e) => {
                  e.preventDefault();
                  toast.info("Função em desenvolvimento");
                }}
              >
                Esqueceu sua senha?
              </a>
              <p className="text-sm text-muted-foreground">
                Não tem uma conta?{" "}
                <a
                  href="#"
                  className="text-primary hover:underline font-medium"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/register"); // Direciona para a tela de registro
                  }}
                >
                  Criar conta
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
