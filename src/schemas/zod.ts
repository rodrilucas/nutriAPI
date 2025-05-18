import { z } from "zod";

const queries = z.object({
  foodName: z
    .string({ message: "O campo (foodName) deve ser uma string" })
    .min(1, {
      message: "O campo (foodName) deve conter pelo menos 1 carácter(es)",
    })
    .refine((val) => isNaN(Number(val)), {
      message: "O campo (foodName) não pode ser apenas um número",
    }),
  page: z.coerce
    .number({ message: "A (página) deve ser um número válido" })
    .min(1, { message: "O valor mínimo da (página) deve ser (1)" })
    .nonnegative({
      message: "A (página) não pode ser um valor negativo (-)",
    })
    .default(1),
});

const params = z.object({
  id: z.coerce
    .number({ message: "O (id) deve ser um número" })
    .int({ message: "O (id) deve ser um número inteiro" })
    .min(1, { message: "O valor mínimo do (id) deve ser (1)" }),
});

export { queries, params }
