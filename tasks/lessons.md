# Lessons

## 2026-05-21 — Static Deliverable Filenames Must Match Requested Route

- When creating standalone alignment artifacts, derive the filename from the user's requested subject or explicit filename before writing the first version.
- If the user corrects a generated artifact name, include the rename in the shipping boundary and record the correction in task history.
- Correction enforcement: this ship updated `alignment/index.html` to `alignment/icp.html`; no code-level enforcement is needed because the correction was a one-off artifact naming request.

## 2026-05-17 — Boot Splash Text Must Be Visually Timed

- When adding splash-screen copy, validate actual readability, not just state transitions in tests.
- Very short phase intervals can technically render all states while still being too fast for a user to perceive.
- Large letter spacing inside a constrained phone frame can clip short brand words at the edges; keep splash text in a full-width constrained container with modest tracking.
- If the requested splash copy is meant to appear "one on top of each other," do not swap a single text node; stack persistent lines and fade each line in while keeping prior lines visible.
- Correction enforcement: `src/__tests__/Animations.test.tsx` now asserts the boot splash copy sequence, and future visual timing changes should keep human-readable hold times in `PageContent.tsx`.
