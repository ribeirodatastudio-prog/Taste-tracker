"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { visitSchema, VisitFormValues } from "@/lib/schemas"

export async function createVisit(data: VisitFormValues) {
  const result = visitSchema.safeParse(data)

  if (!result.success) {
    return { success: false, error: result.error.flatten() }
  }

  const { restaurant: rData, visit: vData } = result.data

  try {
    // Find or create restaurant
    let restaurant = await prisma.restaurant.findFirst({
      where: { name: rData.name }
    })

    if (!restaurant) {
      restaurant = await prisma.restaurant.create({
        data: {
            name: rData.name,
            cuisine: rData.cuisine,
            address: rData.address,
            latitude: rData.latitude,
            longitude: rData.longitude
        }
      })
    } else {
        // Optional: Update details if missing? Keeping it simple for now.
    }

    await prisma.visit.create({
      data: {
        date: vData.date,
        rating: vData.rating,
        starters: vData.starters,
        mainCourse: vData.mainCourse,
        desserts: vData.desserts,
        drinks: vData.drinks,
        companions: vData.companions ? JSON.stringify(vData.companions) : null,
        restaurantId: restaurant.id
      }
    })

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Failed to create visit:", error)
    return { success: false, error: "Database error" }
  }
}
