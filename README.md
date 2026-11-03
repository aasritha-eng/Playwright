# SauceDemo Playwright Tests

This project tests SauceDemo’s login, product sorting and details, shopping cart, and checkout. The suite runs in Chromium, Firefox, and WebKit.

## Run locally

From the project folder, run:

```bash
npm ci
npx playwright install
npx playwright test e2e/Project
```

To open the local test report:

```bash
npx playwright show-report
```

## GitHub Actions

A push to `main` runs the tests automatically. In GitHub, open **Actions**, select a workflow run, and download **playwright-report** under **Artifacts**.