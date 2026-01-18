import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Connecting to DB...')
  // Create
  const r = await prisma.restaurant.create({
    data: {
      name: "Test Resto",
      cuisine: "Test",
    }
  })
  console.log('Created Restaurant:', r.id)

  const v = await prisma.visit.create({
    data: {
      date: new Date(),
      rating: 5,
      restaurantId: r.id,
      companions: JSON.stringify(["Alice"])
    }
  })
  console.log('Created Visit:', v.id)

  // Verify
  const found = await prisma.restaurant.findUnique({
    where: { id: r.id },
    include: { visits: true }
  })

  if (found && found.visits.length === 1) {
    console.log('Verification Successful!')
  } else {
    console.error('Verification Failed!')
    process.exit(1)
  }

  // Cleanup
  await prisma.visit.delete({ where: { id: v.id } })
  await prisma.restaurant.delete({ where: { id: r.id } })
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
