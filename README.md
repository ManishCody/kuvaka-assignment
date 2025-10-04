This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# kuvaka-assignment

---

# Project Overview

A Next.js 15 (App Router) application implementing a simple phone-based login flow with client-side OTP simulation, global state via Redux Toolkit, and UI built with modern React 19 and Radix UI utilities.

- Auth flow: User enters phone, requests OTP, verifies OTP, and is considered authenticated.
- State management: `@reduxjs/toolkit` with slices for `auth`, `chats`, and `ui` stored in a single Redux store (`src/store/index.ts`).
- Persistence: `auth` and `chats` slices are persisted to `localStorage` on the client.
- Navigation: After login, user is redirected to `/dashboard`.

## Recent Updates

- Introduced a chat loading skeleton shown while verifying authentication from `localStorage`.
  - `RequireAuth` now accepts a `fallback` prop and shows it during mount or when unauthenticated: `src/components/auth/RequireAuth.tsx`.
  - Chat page passes `ChatPageSkeleton` as fallback: `src/app/chat/[id]/page.tsx` and `src/components/chat/ChatPageSkeleton.tsx`.
- Refactored the phone login step into smaller components and a reusable hook:
  - Hook: `src/components/auth/hooks/usePhoneForm.ts` (form setup, Zod validation, autofocus).
  - Components: `src/components/auth/phone/CountrySelect.tsx`, `PhoneNumberInput.tsx`, `SendOtpButton.tsx`.
  - Parent: `src/components/auth/PhoneStep.tsx` now composes these pieces.
- Autofocus improvements:
  - Phone input auto-focuses after country list loads (and on mount).
  - OTP input (`InputOTP`) auto-focuses the first slot when the step appears.

## Tech Stack

- Next.js 15 (App Router)
- React 19
- Redux Toolkit + React-Redux
- TypeScript
- Framer Motion, Sonner (toasts)
- Radix UI primitives
- Tailwind CSS (v4)

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
# open http://localhost:3000
```

3. Build and run production:

```bash
npm run build
npm start
```

4. Lint:

```bash
npm run lint
```

## Project Structure

```text
my-next-app/
├─ src/
│  ├─ app/
│  │  └─ page.tsx                 # Login page (client component)
│  ├─ components/
│  │  ├─ auth/
│  │  │  ├─ Header.tsx            # Auth screen header
│  │  │  ├─ PhoneStep.tsx         # Phone entry step (composed)
│  │  │  ├─ OTPStep.tsx           # OTP entry step
│  │  │  ├─ hooks/
│  │  │  │  └─ usePhoneForm.ts    # RHF + Zod + autofocus for phone step
│  │  │  └─ phone/
│  │  │     ├─ CountrySelect.tsx  # Country code selector
│  │  │     ├─ PhoneNumberInput.tsx # Phone input with autofocus
│  │  │     └─ SendOtpButton.tsx  # Submit button for sending OTP
│  │  └─ redux-provider.tsx       # Wraps the app with Redux Provider
│  ├─ store/
│  │  ├─ index.ts                 # Redux store, persistence to localStorage
│  │  ├─ hooks.ts                 # Typed hooks (useAppDispatch/useAppSelector)
│  │  └─ slices/
│  │     ├─ authSlice.ts          # Auth state & actions (login/logout)
│  │     ├─ chatsSlice.ts         # Chats/messages state & actions
│  │     └─ uiSlice.ts            # UI state & actions
│  ├─ lib/
│  │  └─ phone-validation.ts      # Phone validation helper
│  └─ types/
│     └─ country.ts               # Country type used by PhoneStep
└─ package.json
```

## Architecture and Data Flow

### High-level application wiring

- The app is rendered with a Redux Provider defined in `src/components/redux-provider.tsx`, which provides the `store` from `src/store/index.ts` to all client components.
- `src/app/page.tsx` is a client component handling the login UI and interactions.
- `authSlice.ts` stores `isAuthenticated` and `user` info. On login, `login` action sets these fields.
- `chatsSlice.ts` seeds some demo chats and messages and provides actions to create/delete chats and add messages.
- `uiSlice.ts` stores small UI flags (drawer, search, history toggles).
- `src/store/index.ts` persists `auth` and `chats` into `localStorage` on each store update (client-only safeguards).
