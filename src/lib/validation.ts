import { z } from "zod";

import { GROCERY_MAX_QUANTITY } from "@/constants/grocery";

export const addItemSchema = z.object({
  name: z.string().min(1, "Item name is required").max(80, "Item name is too long"),
  quantity: z
    .number()
    .int()
    .min(1, "Quantity must be at least 1")
    .max(GROCERY_MAX_QUANTITY, `Quantity must not exceed ${GROCERY_MAX_QUANTITY}`),
  category: z.enum(["produce", "dairy", "meat", "bakery", "frozen", "pantry", "other"])
});
