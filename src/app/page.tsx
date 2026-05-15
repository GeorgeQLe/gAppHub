import PageContent from "@/components/PageContent";
import { getProducts, sortProducts, splitDockProducts } from "@/lib/products";

export default async function Home() {
  const sorted = sortProducts(await getProducts());
  const { dock, grid } = splitDockProducts(sorted);

  return (
    <PageContent variant="none" dockProducts={dock} gridProducts={grid} />
  );
}
