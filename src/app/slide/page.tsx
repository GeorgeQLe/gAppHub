import PageContent from "@/components/PageContent";
import { getProducts, sortProducts, splitDockProducts } from "@/lib/products";

export default async function Slide() {
  const sorted = sortProducts(await getProducts());
  const { dock, grid } = splitDockProducts(sorted);

  return (
    <PageContent variant="slide" dockProducts={dock} gridProducts={grid} />
  );
}
