import { Product } from "@/types/Product";
import { Vtex } from "eitri-shopping-vtex-shared";

interface GetProductArgsType {
  searchQuery: string;
}

const search = async (searchQuery: string) => {
  try {
    const data = (await Vtex.catalog.searchProduct(searchQuery, {
      hideUnavailableItems: true,
    })) as { products: Product[] };

    console.log(data);

    return data.products.map((product) => ({
      productId: product.productId,
      productName: product.productName,
      images: product.items?.[0]?.images,
      price: product.items?.[0]?.sellers?.[0]?.commertialOffer?.Price,
    }));
  } catch (error) {
    console.error("Error fetching products from VTEX API:", error);
    return []; // Return an empty array in case of an error
  }
};

export default async function getProducts(
  args: GetProductArgsType
): Promise<Partial<Product>[]> {
  const promises = [search(args.searchQuery)];

  const data = await Promise.all(promises);

  return data;
}
