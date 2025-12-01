import { ProductImage, Title, Container } from "@/components/shared";
import { GroupVariants } from "@/components/shared/group-variants";
import prisma from "@prisma/prisma-client";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
    include: {
      items: true,
      additionally: true,
    },
  });

  if (!product) {
    return notFound();
  }

  const options = product.options ? JSON.parse(product.options) : [];

  const variantItems = options.map(
    (option: string | { name: string; price?: number }, index: number) => ({
      name: typeof option === "string" ? option : option.name,
      value: String(index),
      ...(typeof option === "object" && { price: option.price }),
    })
  );

  return (
    <Container className="flex flex-col my-10">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <ProductImage
            imageUrl={product.imageUrl}
            className="w-full max-w-[500px] mx-auto"
          />
        </div>
        <div className="w-full md:w-1/2 bg-white p-8 rounded-lg shadow-md">
          <Title
            text={product.name}
            size="md"
            className="font-extrabold mb-4 text-gray-800"
          />
          <p className="text-gray-400 mb-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </p>
          {variantItems.length > 0 && (
            <GroupVariants
              items={variantItems}
              value={""} // Додайте поточний вибраний варіант, якщо потрібно
              // onClick обробник тепер має бути всередині клієнтського компонента
            />
          )}
        </div>
      </div>
    </Container>
  );
}
