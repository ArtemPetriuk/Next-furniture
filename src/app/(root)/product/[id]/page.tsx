import { Container } from "@/components/shared/container";
import { notFound } from "next/navigation";
import prisma from "../../../../../prisma/prisma-client";
import { Title } from "@/components/shared/title";

export default async function ProductPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const product = await prisma.product.findFirst({
    where: { id: Number(id) },
  });

  if (!product) {
    return notFound();
  }

  return (
    <Container className="my-10 flex flex-col">
      {/* Це покажеться, якщо хтось відкриє посилання напряму або оновить сторінку */}
      <Title text={product.name} size="lg" className="mb-1 font-extrabold" />
    </Container>
  );
}
