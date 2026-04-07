"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { GROCERY_CATEGORIES } from "@/constants/grocery";
import { addItemSchema } from "@/lib/validation";
import type { AddItemFormValues } from "@/types/grocery";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

interface AddItemFormProps {
  onAddItem: (values: AddItemFormValues) => void;
}

export const AddItemForm = ({ onAddItem }: AddItemFormProps) => {
  const form = useForm<AddItemFormValues>({
    resolver: zodResolver(addItemSchema),
    defaultValues: {
      name: "",
      quantity: 1,
      category: "other"
    }
  });

  const handleSubmit = (values: AddItemFormValues) => {
    onAddItem(values);
    form.reset({ name: "", quantity: 1, category: values.category });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Grocery Item</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-3 md:grid-cols-4" onSubmit={form.handleSubmit(handleSubmit)}>
          <Input placeholder="Item name" {...form.register("name")} />
          <Input
            type="number"
            min={1}
            max={99}
            placeholder="Qty"
            {...form.register("quantity", { valueAsNumber: true })}
          />
          <Select {...form.register("category")}>
            {GROCERY_CATEGORIES.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </Select>
          <Button type="submit">Add Item</Button>
        </form>
      </CardContent>
    </Card>
  );
};
