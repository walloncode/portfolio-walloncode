import { Container } from "@/components/ui/container";
import { Separator } from "@/components/ui/separator";
import { profile } from "@/content/profile";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 pb-10">
      <Container>
        <Separator className="mb-8" />
        <div className="flex flex-col items-center gap-4 text-sm text-foreground-subtle sm:flex-row sm:justify-between">
          <p>
            © {year} {profile.name}. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-5">
            {profile.socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="transition-colors duration-200 hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
