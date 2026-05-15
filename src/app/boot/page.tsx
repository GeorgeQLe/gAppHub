import PageContent from "@/components/PageContent";
import { getProducts, sortProducts, splitDockProducts } from "@/lib/products";

export default async function Boot() {
  const sorted = sortProducts(await getProducts());
  const { dock, grid } = splitDockProducts(sorted);

  return (
    <PageContent variant="boot" dockProducts={dock} gridProducts={grid} />
  );
}
