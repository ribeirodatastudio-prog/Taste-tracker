import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Connecting to DB...')

  // Cleanup
  await prisma.menuItem.deleteMany()
  await prisma.visit.deleteMany()
  await prisma.restaurant.deleteMany()
  await prisma.companion.deleteMany()

  // Create Restaurant
  const r = await prisma.restaurant.create({
    data: {
      name: "Test Resto",
      cuisine: "Test",
    }
  })
  console.log('Created Restaurant:', r.id)

  // Create Companion
  const c = await prisma.companion.create({
    data: { name: "Alice" }
  })
  console.log('Created Companion:', c.id)

  // Create Visit with MenuItems and Companion
  const v = await prisma.visit.create({
    data: {
      date: new Date(),
      rating: 5,
      restaurantId: r.id,
      menuItems: {
        create: [
            { name: "Soup", category: "STARTER", price: 5.50 },
            { name: "Steak", category: "MAIN", price: 25.00 }
        ]
      },
      companions: {
          connect: { id: c.id }
      }
    },
    include: {
        menuItems: true,
        companions: true
    }
  })
  console.log('Created Visit:', v.id)
  console.log('Visit Menu Items:', v.menuItems.length)
  console.log('Visit Companions:', v.companions.length)

  // Verify
  if (v.menuItems.length === 2 && v.companions.length === 1 && v.companions[0].name === "Alice") {
    console.log('Verification Successful!')
  } else {
    console.error('Verification Failed!')
    process.exit(1)
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
