# Lessons

## 2026-05-17 — Boot Splash Text Must Be Visually Timed

- When adding splash-screen copy, validate actual readability, not just state transitions in tests.
- Very short phase intervals can technically render all states while still being too fast for a user to perceive.
- Large letter spacing inside a constrained phone frame can clip short brand words at the edges; keep splash text in a full-width constrained container with modest tracking.
- Correction enforcement: `src/__tests__/Animations.test.tsx` now asserts the boot splash copy sequence, and future visual timing changes should keep human-readable hold times in `PageContent.tsx`.
