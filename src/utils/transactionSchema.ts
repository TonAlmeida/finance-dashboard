import { z } from "zod";

export const transactionSchema = z.object({
  date: z.string().nonempty("A data é obrigatória"),

  value: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        const cleaned = val.replace(/\s|R\$|,/g, "").replace(",", ".");
        const num = Number(cleaned);
        return isNaN(num) ? undefined : num;
      }
      return val;
    },
    z.number().positive("O valor deve ser positivo").refine((v) => !isNaN(v), {
      message: "O valor deve ser numérico",
    })
  ),

  category: z.string().nonempty("A categoria é obrigatória"),

  type: z
    .enum(["income", "expense"], {
      message: "Selecione o tipo de transação",
    })
    .refine((v) => !!v, { message: "Selecione o tipo de transação" }),

  counterpartName: z.string().nonempty("Informe o nome da contraparte"),
  counterpartDocument: z.string().optional(),

  numberOfTransactions: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        const num = Number(val.replace(",", "."));
        return isNaN(num) ? undefined : num;
      }
      return val;
    },
    z.number().min(1, "Número inválido").refine((v) => !isNaN(v), {
      message: "O número deve ser válido",
    })
  ),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;
