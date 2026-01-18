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
    }

    // Handle Companions
    // We get an array of strings (names). We need to find or create them.
    const companionIds: number[] = []
    if (vData.companions && vData.companions.length > 0) {
        for (const name of vData.companions) {
            let companion = await prisma.companion.findUnique({
                where: { name }
            })
            if (!companion) {
                companion = await prisma.companion.create({
                    data: { name }
                })
            }
            companionIds.push(companion.id)
        }
    }

    // Create Visit
    await prisma.visit.create({
      data: {
        date: vData.date,
        rating: vData.rating,
        restaurantId: restaurant.id,
        menuItems: {
            create: vData.menuItems?.map(item => ({
                name: item.name,
                category: item.category,
                price: item.price
            })) || []
        },
        companions: {
            connect: companionIds.map(id => ({ id }))
        }
      }
    })

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Failed to create visit:", error)
    return { success: false, error: "Database error" }
  }
}
