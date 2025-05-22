# Coneto Repo!

## What is Coneto?

Coneto is a shared component library used across all applications at Systatum — including Workaty, Dashtomer, and others.

---

## Component Structure

Each main component consists of two parts:

1. `[component].tsx` – the React component
2. `[component].stories.tsx` – the Storybook file to display the component

---

## How to run:

1. Install dependencies: `pnpm install`
2. Start Storybook locally: `pnpm storybook`

---

## How to Make Changes

1. Open Chromatic on your desktop
2. Make any necessary changes to your component
3. Commit and push your changes
4. Publish the changes to Chromatic: `npx chromatic --project-token={{your token}}`
5. View your updates in the Chromatic app

---

## Tech Stack

This repository uses:

- `@storybook/react-vite` – the core framework that runs Storybook using Vite for faster builds and hot reloads
- `@storybook/addon-essentials` – a set of essential addons like docs, controls, actions, and viewport to enhance Storybook functionality
- `@storybook/addon-onboarding` – helps new users understand how to use Storybook with guides and tips
- `@chromatic-com/storybook` – integrates Chromatic, which automates UI testing and visual reviews of your components
- `@storybook/experimental-addon-test` – an experimental addon for running component tests directly inside Storybook

---

## Code Quality Checks

1. Run unit tests: `pnpm test-storybook`
2. Run the linter to check for unused code and issues: `pnpm lint`

## How to deploy your code?

1. Build Storybook: `pnpm build-storybook`
2. Push the build output
3. Deploy it using your preferred platform (e.g., Vercel, Netlify, etc.)
