export const VITTLES = {
  name: "Operation Vittles",
  status: "active" as const,
  briefing:
    "Apps as distribution. In the agentic coding era, the cost of shipping has collapsed — instead of waiting months to launch one polished product, we run a sustained airlift: dozens of small, useful tools shipped weekly. Each app is a touchpoint, each user a potential follower, each project shortens the corridor across the chasm. Operation Vittles is the supply run that keeps going until the crossing is complete.",
  overview:
    "The founders who win in this era won't just ship one polished product — they'll ship dozens of small ones and let distribution emerge from the work itself. Operation Vittles treats every launched app as a supply drop. The goal is one new public launch per week, each one earning attention that compounds into subscribers, followers, and eventually customers.",
  objectives: [
    { text: "Launch Pipeline: 1 launch/week cadence", completed: false },
    { text: "Content Engine: weekly tutorials & build-in-public", completed: false },
    { text: "Audience Traction: 1K subscribers via app CTAs", completed: false },
    { text: "Distribution Flywheel: apps ↔ content loop", completed: false },
    { text: "Scale to 5K subscribers by Sep 2026", completed: false },
  ],
  dates: { start: "2026-05-01", end: "2026-09-30" },
  colors: {
    primary: "#0A5BFF",
    secondary: "#C7D2E0",
    accent: "#8A96A8",
    heading: "#F3F6FB",
    border: "rgba(59,130,246,0.25)",
    cardBg: "#0B1526",
    bg: "#07111F",
  },
} as const;
