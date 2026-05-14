import DynamicIsland from "@/components/DynamicIsland";
import PhoneFrame from "@/components/PhoneFrame";
import StatusBar from "@/components/StatusBar";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
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

      <p className="mt-3 text-[13px] uppercase tracking-widest text-[#86868b]">
        Made in Boston, Building in Public
      </p>

      <div className="mt-12">
        <PhoneFrame>
          <StatusBar />
          <DynamicIsland />
        </PhoneFrame>
      </div>
    </main>
  );
}
