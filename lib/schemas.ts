import { z } from "zod"

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
    starters: z.string().optional(),
    mainCourse: z.string().optional(),
    desserts: z.string().optional(),
    drinks: z.string().optional(),
    companions: z.array(z.string()).optional(),
  })
})

export type VisitFormValues = z.infer<typeof visitSchema>
