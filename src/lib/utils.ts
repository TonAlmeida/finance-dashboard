// Função helper para concatenar classes Tailwind dinamicamente
export function cn(...classes: (string | undefined | null | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}
