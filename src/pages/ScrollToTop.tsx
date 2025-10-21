import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Sempre rola para o topo quando a rota muda
    window.scrollTo({
      top: 0,
      behavior: "instant", // ou "smooth" se quiser efeito suave
    });
  }, [pathname]);

  return null;
}
