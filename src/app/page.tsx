import DynamicIsland from "@/components/DynamicIsland";
import HomeIndicator from "@/components/HomeIndicator";
import IconGrid from "@/components/IconGrid";
import PhoneFrame from "@/components/PhoneFrame";
import StatusBar from "@/components/StatusBar";
import { getProducts, sortProducts } from "@/lib/products";

export default async function Home() {
  const products = sortProducts(await getProducts());

  return (
    <main className="flex h-screen flex-col items-center px-4 py-4">
      <svg
        width="140"
        height="32"
        viewBox="0 0 140 32"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Lexcorp"
      >
        <text
          x="50%"
          y="50%"
          dominantBaseline="central"
          textAnchor="middle"
          fill="#1d1d1f"
          fontSize="24"
          fontWeight="600"
          fontFamily="-apple-system, BlinkMacSystemFont, system-ui, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
          letterSpacing="0.2em"
        >
          LEXCORP
        </text>
      </svg>

      <p className="mt-1 text-[13px] uppercase tracking-widest text-[#86868b]">
        Made in Boston, Building in Public
      </p>

      <div className="mt-3 min-h-0 flex-1 pb-4">
        <PhoneFrame>
          <StatusBar />
          <DynamicIsland />
          <IconGrid products={products} />
          <HomeIndicator />
        </PhoneFrame>
      </div>
    </main>
  );
}
