import { z } from "zod"

export enum ItemCategory {
  STARTER = "STARTER",
  MAIN = "MAIN",
  DESSERT = "DESSERT",
  DRINK = "DRINK",
}

export const menuItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  category: z.nativeEnum(ItemCategory),
  price: z.number().optional(),
})

export const visitSchema = z.object({
  restaurant: z.object({
    name: z.string().min(1, "Restaurant name is required"),
    cuisine: z.string().optional(),
    address: z.string().optional(),
    latitude: z.number().nullable().optional(),
    longitude: z.number().nullable().optional(),
  }),
  visit: z.object({
    date: z.date(),
    rating: z.number().min(1).max(5),
    menuItems: z.array(menuItemSchema).optional(),
    companions: z.array(z.string()).optional(),
  })
})

export type MenuItemValues = z.infer<typeof menuItemSchema>
export type VisitFormValues = z.infer<typeof visitSchema>
