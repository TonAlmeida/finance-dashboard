export function formatValue(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}
export function formatInputValue(value: number): string {
  if (!value || isNaN(value)) return "";
  return value
    .toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    .replace(/^0+(?=\d)/, ""); // remove zeros à esquerda
}
