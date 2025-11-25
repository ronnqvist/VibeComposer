# Migration Notes

## Repository Inventory

### Target: VibeComposer (this repo)
- **Framework/build**: React Router v7 with Vite bundling (see `package.json`, `vite.config.ts`).
- **Language**: TypeScript.
- **Styling**: Tailwind CSS v4 (`app/styles/index.css`, `tailwind.config.ts`).
- **State management**: Zustand (`app/store/useStore.ts`).
- **Auth**: Clerk React.
- **Audio/editor**: Strudel REPL embedded via `<strudel-repl>` iframe (`app/components/StrudelRepl.tsx`) fed by `currentStrudelCode` from the store. AI chat flows use `useSendChatMessage` and `app/routes/api.chat.message.tsx` to stream responses and push cleaned code into the REPL.
- **Backend**: React Router data routes for API endpoints (`app/routes/api.*`), MongoDB via `mongoose` (`app/db/connect.ts`).
- **Existing AI integration**: Anthropic Claude streaming in `app/routes/api.chat.message.tsx`.
- **Licensing**: AGPL-3.0 (`LICENSE`).

### Source: strudel-vibe-coder
- Network access to the source repository was blocked in this environment (HTTPS clone returned 403). Design and integration details will need to be approximated rather than copied verbatim. The upstream is reported as Strudel-oriented and licensed under AGPL based on user brief; retain attribution if future direct code copies are introduced.
- Styling/system details could not be inspected because of the access limitation.

## Migration Implications
- BYOK OpenRouter support will be implemented with server-side key resolution and new API routes to avoid exposing keys client-side.
- UI/theme changes will be re-created locally to approximate the source look and comply with AGPL expectations without direct code copying from the unavailable repository.
- Auto-apply-to-player will hook into the existing Strudel code flow by updating `currentStrudelCode` and refreshing the embedded REPL while keeping an undo buffer in state.

## Work Log
-  Initial inventory created; source repo unreachable (HTTP 403) so design tokens/components will be recreated based on target stack.
