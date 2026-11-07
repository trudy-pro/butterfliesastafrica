# Butterflies Across Africa 🦋

**An interactive digital archive for exploring African butterflies through visual discovery, ecological information, and interactive interfaces.**

[View source code](https://github.com/trudy-pro/butterfliesastafrica)

> Some account and contribution features require a configured Supabase backend.

## About the project

Butterflies Across Africa explores how interaction design can make biodiversity information more accessible and engaging. Instead of navigating a static catalogue, visitors can discover butterfly species through appearance, habitat, geographical distribution, and seasonal activity.

The project brings together visual communication, UX design, frontend development, and interactive information exploration.

## Features

- **Species explorer:** browse illustrated butterfly specimens and open detailed profiles.
- **Search and filters:** explore by common or scientific name, family, wing colour, pattern, shape, habitat, and region.
- **Visual comparison:** compare specimens and their distinguishing characteristics.
- **Geographical exploration:** browse butterflies through an interactive map.
- **Seasonality:** explore flight periods, seasonal activity, and what may be flying in a given month.
- **Personal collection:** save examined specimens and track collection progress.
- **Contributor portal:** approved contributors can upload photographs for AI-assisted identification.
- **Administration:** contributor approval and submission-management interfaces.

Some features require a user account. AI-assisted identifications are suggestions, not authoritative scientific determinations.

## Technology

| Area | Tools |
| --- | --- |
| Frontend | React, TypeScript, Vite |
| Interface | Tailwind CSS, shadcn/ui |
| Animation | Framer Motion |
| Maps | Leaflet, React Leaflet |
| Data visualization | Recharts |
| Backend and authentication | Supabase |

## Run locally

You will need **Git**, **Node.js**, and **npm**.

```bash
git clone https://github.com/trudy-pro/butterfliesastafrica.git
cd butterfliesastafrica
npm install --no-package-lock --legacy-peer-deps
npm run dev
```

Open **http://localhost:8080/** in your browser.

The repository currently uses an installation workaround because its `package-lock.json` is not fully synchronized with `package.json`. This can be resolved by regenerating and committing a consistent lockfile.

### Environment configuration

Account and contribution features depend on Supabase configuration. For local development, place the following variables in an untracked `.env.local` file, using your own project values:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

Do not commit private API tokens, passwords, or Supabase service-role keys. A publishable client key is not a substitute for properly configured Supabase authorization and row-level security.

## Design considerations

The interface experiments with different ways to make scientific information approachable:

- **Visual discovery:** beginning with observable differences in colour, wing shape, and pattern.
- **Progressive disclosure:** offering detailed specimen information when a visitor chooses to explore further.
- **Multiple exploration paths:** combining search, filtering, comparison, maps, and seasonal views.
- **Personal engagement:** using collected specimens to encourage continued exploration.

## Status and next steps

This is an evolving web project. Potential improvements include better documentation of biodiversity data sources, accessibility testing, verified species information, expanded ecological datasets, and more robust visual comparisons.

## Project links

- **Repository:** https://github.com/trudy-pro/butterfliesastafrica

## Credits

An interactive web project combining interface design, frontend development, and biodiversity exploration. Built with React, TypeScript, Vite, Supabase, and open-source libraries.
