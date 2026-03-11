# Coneto

Coneto is a shared component library used across all applications at Systatum — including Workaty, Dashtomer, and others, designed with modernity, simplicity, and usability in mind.

To start the storybook locally:

```bash
pnpm install
pnpm storybook
```

## Component Structure

Each main component consists of two parts:

1. `[component].tsx` – the React component
2. `[component].stories.tsx` – the Storybook file to display the component

## How to run:

1. Install dependencies: `pnpm install`
2. Start Storybook locally: `pnpm storybook`

## How to Submit Changes to Deploy Preview

1. Make any necessary changes to your component.
2. Commit and push your changes.
3. Create a pull request to the `main` branch.
4. View your updates on GitHub through the automatically generated deploy preview link.

## How to Test

1. Create your component test inside the `test/e2e` or `test/component` directory. Tests can be written for **E2E** scenarios or **component** behavior. Each component should have its own test file.
2. Write your test logic to cover expected behaviors, interactions, and visual, name the file using the format `[component].cy.ts` for test **e2e** and `[component].cy.tsx` for test **component** then save it.
3. Commit and push your changes to the repository.
4. To run tests locally:
   1. Ensure that you have `cypress` installed:

      ```bash
      pnpm add --save-dev cypress # you may need to do this
      ./node_modules/.bin/cypress install # install the cypress app locally
      ```

      You will know that you need to install `cypress` if you see this kind of error:

      ```txt
      Please reinstall Cypress by running: cypress install

      ----------

      Cypress executable not found at: /Users/adam.h/Library/Caches/Cypress/14.5.3/Cypress.app/Contents/MacOS/Cypress
      ```

   2. Run the storybook server, used for E2E testing: `pnpm run storybook`
   3. Execute either use one of the following commands:
      - `pnpm test-open` – opens the Cypress Test Runner with an interactive UI.
      - `pnpm test-run` or `pnpm test-run-component` – runs all tests in headless mode via the CLI. Ensure that you see `All specs passed!` eventually.

## Tech Stack

This repository uses:

- `@storybook/react-vite` – the core framework that runs Storybook using Vite for faster builds and hot reloads
- `@storybook/addon-essentials` – a set of essential addons like docs, controls, actions, and viewport to enhance Storybook functionality

## Code Quality Checks

1. Run unit tests: `pnpm test-open` or `pnpm test-run` or `pnpm test-run-component`
2. Run the linter to check for unused code and issues: `pnpm lint`

## Coding convention

1. Constants should always be in SNAKE_CASE_CAPITALS
2. Helper functions, when they're not likely to be re-usable, should be put in the same file of the component, but located after the component's function declaration.
3. Constants, when they're not likely to be re-usable, should be put in the same file of the compoennt.

## How to deploy

1. Build Storybook: `pnpm build-storybook`
2. Push the build output
3. Deploy it using your preferred platform (e.g., Vercel, Netlify, etc.)

## Publishing / Releasing to npm

To publish Coneto to npm, follow these steps:

1. Ensure you are logged in to npm

```bash
npm login
```

2. Update the version number in `package.json`

3. Build the package to check the newest component to release (if necessary):

```bash
pnpm build
```

4. Publish to npm

```bash
npm public --access public
```

5. Verify the release using **2FA** on npmjs (if enabled):

- When you run `npm publish --access public`, npm will prompt you to enter the **one-time code** from your authenticator app.
- Enter the code to complete the release.
