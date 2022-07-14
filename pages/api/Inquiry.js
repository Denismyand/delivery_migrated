import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getServerSideProps() {
  const dishes = await prisma.findMany();
  return {
    props: {
      menu: dishes,
    },
  };
}
