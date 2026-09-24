# Orbit CRM — Frontend

A web client for **Orbit CRM**, a lightweight Zoho-style CRM. It covers the full sales flow: leads, contacts, accounts, deals, activities and sales pipelines, plus organization settings (API keys, webhooks, custom fields).

**Live demo:** `https://cebanoleksandr.github.io/zoho-fe/`

## Features

- **Authentication**: sign up and sign in with JWT access/refresh tokens. Expired access tokens are refreshed automatically, and logout asks for confirmation first.
- **Dashboard**: counts of open leads, active deals, accounts and pending activities.
- **Leads**: list with search and pagination, a detail page with inline editing, status changes and conversion into a contact and an account, plus an optional deal.
- **Contacts, Accounts, Deals**: CRUD with detail pages, inline editing and linked records.
- **Activities**: tasks, calls, meetings and more, with status tabs, quick "mark complete" and a panel on every record's detail page.
- **Pipelines**: multiple pipelines, a default pipeline, and stages with probability, won/lost flags and reordering.
- **Settings**:
  - **API keys**: create and revoke keys. A new key is shown only once.
  - **Webhooks**: subscribe to events, toggle a webhook on or off, and view its delivery history.
  - **Custom fields**: define extra fields per entity type and edit their values on detail pages.
- **Localization**: English, Ukrainian, Polish and Spanish. The language is detected from the browser and remembered.
- **Responsive UI**: a collapsible navigation drawer, card-style tables and compact dialogs on mobile.

## Tech stack

| Area | Tools |
| --- | --- |
| Framework | React 19, TypeScript, Vite |
| UI | MUI (Material UI) v9, Emotion, Tailwind CSS v4, Framer Motion |
| Routing | React Router v7 (hash router, which suits GitHub Pages) |
| Server state | TanStack Query v5 |
| Client state | Redux Toolkit (global alerts) |
| Forms & validation | React Hook Form, Yup |
| HTTP | Axios |
| i18n | i18next, react-i18next |

## Getting started

### Prerequisites

- Node.js 20.19+ (or 22.12+) and npm
- A running Orbit CRM backend API (by default the app expects one at `http://localhost:3000`)

### Setup

```bash
npm install
cp .env.example .env   # then set VITE_API_URL
npm run dev
```

The dev server prints its local URL. Because of the `base` setting in `vite.config.ts`, the app is served under `/zoho-fe/`.

### Environment variables

| Variable | Description | Default |
| --- | --- | --- |
| `VITE_API_URL` | Base URL of the backend API | `http://localhost:3000` |

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Type-check (`tsc -b`) and build for production into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |
| `npm run deploy` | Build and publish `dist/` to GitHub Pages (`gh-pages` branch) |

## Project structure

```
src/
├── api/
│   ├── client.ts          # Axios instance, token storage, auto-refresh on 401
│   ├── queryClient.ts     # TanStack Query client + global success/error alerts
│   ├── queryKeys.ts       # Query key factories
│   └── services/          # One service per backend resource
├── components/
│   ├── common/            # DataTable, PageHeader, ConfirmDialog, InlineEditField, ...
│   └── layouts/           # MainLayout (app shell), AuthLayout
├── hooks/queries/         # React Query hooks per resource (useLeads, useDeals, ...)
├── i18n/                  # i18next setup and locale files (en, uk, pl, es)
├── pages/                 # Route pages grouped by feature
├── router/                # Routes and auth guards
├── store/                 # Redux store (alert slice)
├── types/                 # Shared TypeScript domain types
├── theme.ts               # MUI theme overrides
└── main.tsx               # App entry point
```

## How it works

- **Routing and guards**: `/app/*` routes require an access token and `/auth/*` routes redirect signed-in users to the app. Both checks happen in route loaders (`src/router/index.tsx`).
- **Data fetching**: each backend resource has a service in `src/api/services` and matching hooks in `src/hooks/queries`. Mutations invalidate the affected query keys, so lists and detail pages stay up to date.
- **Notifications**: a mutation that sets `meta.alert` gets a localized toast on success or error automatically, through the global `MutationCache`.
- **Tokens**: tokens are stored in `localStorage`. On a `401` response, the Axios interceptor refreshes the access token once, sharing a single refresh request between parallel calls, and retries the original request.

## Adding a translation

1. Add a JSON file to `src/i18n/locales/`, using `en.json` as the reference for keys.
2. Import it in `src/i18n/index.ts` and add it to `resources` and `supportedLanguages`.

## Deployment

The app is deployed to GitHub Pages:

```bash
npm run deploy
```

Make sure `VITE_API_URL` in `.env` points to the production API before deploying, because the value is baked in at build time.
