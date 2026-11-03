import type { Page } from '@playwright/test';

export async function login(
  page: Page,
  username = 'standard_user',
  password = 'secret_sauce'
) {
  await page.goto('https://www.saucedemo.com/');
  await page.getByPlaceholder('Username').fill(username);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'Login', exact: true }).click();
}
