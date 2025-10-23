import { useState } from "react";

const TrocarSenha = () => {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (novaSenha !== confirmarSenha) {
      setMensagem("As senhas não coincidem!");
      return;
    }

    // Aqui você poderia chamar uma API para atualizar a senha
    setMensagem("Senha alterada com sucesso!");
    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarSenha("");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[url('/CNDH_Site.webp')] bg-cover bg-center bg-no-repeat"
    >
      <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-primary">Trocar Senha</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Senha atual"
            value={senhaAtual}
            onChange={(e) => setSenhaAtual(e.target.value)}
            className="w-full p-3 border border-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <input
            type="password"
            placeholder="Nova senha"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            className="w-full p-3 border border-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <input
            type="password"
            placeholder="Confirmar nova senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            className="w-full p-3 border border-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Salvar
          </button>
        </form>
        {mensagem && (
          <p className="mt-4 text-center text-sm font-medium text-green-600">
            {mensagem}
          </p>
        )}
      </div>
    </div>
  );
};

export default TrocarSenha;
