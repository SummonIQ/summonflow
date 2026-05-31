## Codex Execution Discipline

### Universal Execution Rules
- Restate the exact defect in one sentence before editing.
- Classify the issue first: UI, runtime/state, data/persistence, API/integration, or workflow/orchestration.
- Trace the issue from trigger to final side effect before changing code.
- Quantify the traced path before the first edit:
  1. Count the elements/boundaries that must match for the fix to be correct.
  2. Count the coordinate spaces / state owners / persistence layers / network boundaries involved.
  3. Count the properties or handoffs that actually define correctness.
- Identify the single subsystem most likely responsible before the first edit.
- First attempt: make one direct change in that subsystem only.
- Do not broaden scope because of uncertainty.
- Do not treat uncertainty as permission to touch nearby code.
- Do not mix cleanup, refactors, redesign, or speculative improvements into a targeted fix unless explicitly requested.
- If the obvious cause is visible from the screenshot, error, or failing behavior, start with that obvious cause first.
- If the first fix misses, reset to the traced path and patch the next direct cause only.
- After two misses, stop broad inference and instrument the path or use only literal user-specified deltas.
- Report scope explicitly after each patch with `Changed:` and `Did not change:`.
- Before any second attempt, state:
  1. Which exact element, handoff, or boundary is still wrong.
  2. Whether the remaining problem is anchor/alignment, size/shape, visibility/styling, state overwrite, payload mismatch, or orchestration flow.
  3. The next single property or handoff to edit.
- Never change one requested property to compensate for another unless the user explicitly asks for that tradeoff.
- Never edit an adjacent element unless it is proven to be part of the failing path.
- "Visual balance", "perceived center", "cleaner structure", "consistency", or similar qualitative judgments are not sufficient reasons to touch neighboring code on a narrow fix.

### Scope Discipline
- Prefer literal interpretation over inferred intent for bug-fix tasks.
- For narrow tasks, optimize for correctness and scope control before initiative.
- If the user is already narrowing scope, reduce initiative further and stick to literal deltas.
- Do not convert a precise task into a cleanup pass or adjacent enhancement.
- If the request names a specific defect, treat all unnamed nearby elements as out of scope until proven otherwise.
- If `unproven_adjacent_changes > 0`, stop and reduce scope before editing.
- If `required_changes > 1`, split the work into explicit sequential fixes instead of bundling them.
- Do not use a broad composition theory to justify edits when a concrete local mismatch is sufficient to explain the bug.

### Screenshot-Driven UI Rules
- Identify the single visible defect in plain language before editing.
- Change the most direct visual cause first.
- Prefer outer spacing/container issues before inner alignment issues when the screenshot shows excess space around the content.
- On the first attempt, change exactly one class or one property.
- Do not change neighboring controls, icon sizes, font sizes, or unrelated layout unless explicitly requested.
- For alignment or origin bugs, compare the exact centers or anchors of the affected elements before touching opacity, size, spacing, or nearby labels.
- For visual bugs with multiple requested properties, separate them into:
  1. origin/alignment
  2. size/range
  3. opacity/visibility
  4. neighboring adornments
- Fix them in that order unless the user specifies otherwise.

### Component Reuse Rules
- For UI work, check whether an existing shared component already solves the problem before creating anything new.
- If the project uses shadcn/ui or shared design-system components, prefer those first.
- Inspect the existing component inventory and local patterns before adding a new component.
- Do not recreate common primitives from scratch when an existing shadcn/ui, shared, or project-local component already exists.
- Extend existing components before inventing new parallel versions unless the existing one is clearly the wrong abstraction.
- Match existing component APIs and styling conventions instead of introducing one-off patterns.
- If a new component is truly necessary, state why the existing components are insufficient before adding it.
- On UI bug fixes, patch the nearest existing component or usage site first instead of creating a replacement component.

### Runtime And State Rules
- For runtime/state bugs, trace the real execution path before editing.
- Start at the failing boundary: event handler, runner, reducer/store, effect, IPC handler, API route, or persistence layer.
- Fix the first broken handoff in the path rather than editing UI around it.
- If state reverts, inspect overwrite/reload paths before changing setters.
- If iteration/orchestration fails, inspect the executor before changing the steps or prompts.
- Do not compensate for a state-path bug by editing render logic unless the render logic itself is the first proven broken handoff.
- If there are multiple possible state owners, enumerate them and eliminate the non-failing ones before editing.

### Data And Persistence Rules
- For data bugs, trace: input -> transform -> validation -> write -> readback -> render.
- If data is missing after a write, inspect the payload and overwrite path first.
- Do not change schemas, types, and UI together on the first pass unless the traced failure requires it.
- Do not modify schema, transform, and presentation in one patch when one layer can explain the defect by itself.
- If the user reports a write/read mismatch, prove whether the failure is pre-write, in-write, or post-read before editing unrelated consumers.

### JavaScript And TypeScript Rules
- Trace behavior through the actual call path instead of editing types first.
- Use types to confirm intent, not as an excuse for speculative cleanup.
- Do not widen or refactor types unless the traced bug requires it.
- Check the concrete runtime payloads and template resolution path before changing helper abstractions.
- Do not change abstractions, helper APIs, or naming to "make things clearer" during a targeted fix unless that abstraction is the failing boundary.

### React Rules
- Localize the issue to props, state, effects, derived render logic, or component boundaries before editing.
- Do not restructure components, rename props, or restyle siblings on a targeted bug fix unless required.
- For visual issues, change the nearest responsible element first.
- For interaction bugs, trace the event -> state -> render path first.
- Do not move neighboring JSX blocks or rebalance component composition on a narrow fix unless the traced issue is specifically layout ownership.

### Next.js Rules
- Trace through the real Next.js boundary first: route segment, server component, client component, server action, API route, cache layer, or middleware.
- Do not change caching, data fetching, and component structure together on the first attempt.
- For hydration or boundary issues, verify server/client ownership before editing markup or state.
- For persistence issues, inspect request payloads and revalidation/reload behavior before changing the UI.

### Vite Rules
- Start with the real failing boundary: module resolution, env loading, HMR path, plugin transform, or build config.
- Do not rewrite config broadly when the traced failure is local to one entry, alias, or plugin.

### Electron, Electrobun, And Tauri Rules
- Trace the issue across the real process boundary first: renderer, preload/bridge, IPC channel, main process, native shell, or webview.
- Do not edit renderer UI first when the failure may be in IPC, host message delivery, or native window state.
- For embedded browser issues, inspect state exclusivity and container spacing before changing controls or styling around them.

### Incident Addendum: Anti-Milking Discipline
- Treat repeated misses as evidence of poor constraint, not as permission to keep exploring.
- The allowed miss budget on a narrow bug is:
  1. first patch: one direct change
  2. second patch: one next direct cause only
  3. after that: stop guessing, instrument or wait for literal user-directed deltas
- Quantify every narrow fix before editing with:
  1. `required_matches`
  2. `actual_boundaries`
  3. `direct_properties`
  4. `unproven_adjacent_changes`
- Proceed only if:
  1. `unproven_adjacent_changes = 0`
  2. the first patch changes one direct property / one direct handoff / one shared anchor wrapper
- If the user asks for more of X, do not reduce Y unless they explicitly ask for that trade.
- If a previous patch touched a neighboring element without proof, the next step must first eliminate that reasoning pattern and return to the literal failing path.

404: Not Found