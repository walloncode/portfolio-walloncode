import { Link } from "react-router-dom";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export function NotFound() {
  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <p className="font-mono text-sm text-foreground-subtle">404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
        Página não encontrada
      </h1>
      <p className="mt-3 max-w-md text-foreground-muted">
        O endereço que você tentou acessar não existe ou foi movido.
      </p>
      <Button asChild variant="outline" className="mt-8">
        <Link to="/">Voltar para o início</Link>
      </Button>
    </Container>
  );
}
