<!-- Copilot / AI assistant guidance for the TravelApp repository -->
# Copilot Instructions — TravelApp

Purpose
- Help AI coding agents be productive in this Expo + React Native (TypeScript) app.

Quick architecture summary
- File-based routing via Expo Router: pages live under `app/`. Notice the `(tabs)` folder for main tab layout and dynamic routes like `[id].tsx`.
- Global providers are wired in `app/_layout.tsx`: `AuthProvider`, `BookingProvider`, `FavoritesProvider` (see context/*.tsx).
- API surface is centralized in `utils/api.ts` — it exports fetch functions and a `setAuthToken` pattern used by `AuthContext`.

Key patterns and conventions
- Use React Contexts for global state (see `context/`) — hooks like `useAuth()` will throw if used outside provider.
- Types are defined in `types/models.ts`. API types (`Api*`) are mapped to UI models in `utils/api.ts`.
- UI components live in `components/` and `components/ui/`. Theme colors come from `constants/Colors.ts` and hooks like `useThemeColors`.
- Mobile + web behavior: layouts check `Platform` and `useWindowDimensions()` to switch sidebar vs. tab bar (see `app/_layout.tsx` and `app/(tabs)/_layout.tsx`).

Important developer workflows
- Install deps: `npm install`.
- Run (dev): `npx expo start -c` (the README recommends `-c` to avoid stale cache issues).
- Platform runs: `npm run android` / `npm run ios` / `npm run web` (backed by `expo run:*`).
- Lint: `npm run lint` (uses `expo` lint config).

Project-specific gotchas
- Auth token handling: token is stored in `AsyncStorage` under `@travel_app_token` and also set in-memory via `setAuthToken()` in `utils/api.ts`. When adding auth flows, update both storage and `setAuthToken` usage.
- Creating bookings: `createBooking` in `utils/api.ts` requires a token — the function throws `NO_TOKEN`/`UNAUTHORIZED` errors; follow existing error shapes when handling in UI.
- API resilience: many `fetch*` functions in `utils/api.ts` attempt flexible parsing (look for `json.data || json.items || (Array.isArray(json) ? json : [])`). Follow this pattern when adding new endpoints.
- Placeholder data/images: mapping functions use deterministic fallbacks from `data/` files — prefer consistent deterministic logic over random values to avoid UI flicker.

Where to change core behavior
- API base URL: `utils/api.ts` → `API_BASE_URL`.
- Add services: `utils/api.ts` contains a comment "Add other services here later" — extend here and mirror mappings to `types/models.ts`.
- Theme colors: `constants/Colors.ts` and hooks under `hooks/`.

Files to inspect first (examples)
- [app/_layout.tsx](app/_layout.tsx) — root layout and providers
- [app/(tabs)/_layout.tsx](app/(tabs)/_layout.tsx) — tab layout and web breakpoint handling
- [utils/api.ts](utils/api.ts) — API client, mapping, and auth token helpers
- [context/AuthContext.tsx](context/AuthContext.tsx) — login/logout, AsyncStorage keys
- [types/models.ts](types/models.ts) — canonical types and Api* shapes
- [components/ui/Button.tsx](components/ui/Button.tsx) — component patterns and useThemeColors
- [README.md](README.md) — project overview and run commands

Style of contributions expected from an AI agent
- Keep changes small and focused: follow existing code style (functional components, TypeScript, no extra dependencies).
- Preserve existing context/provider wiring; add context consumers only when wrapped by the provider.
- Mirror existing error handling and API response parsing patterns in `utils/api.ts`.
- When adding routes, prefer file-based pages under `app/` and follow the `(tabs)` layout conventions.

If something's missing or unclear
- Ask for runtime details (device vs. web), an API key, or examples of expected API payloads. The codebase uses an external API (`travel-api-dn8n.onrender.com`) but includes `data/` mock sets for offline UI work.

---
Please review this guidance and tell me any missing details or preferences to include (testing commands, CI, or branch policies).
