import { test, expect } from '@playwright/test';
import { login } from './test-helpers';

test.describe('Login', () => {
  test('user can log in successfully', async ({ page }) => {
    await login(page);

    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.getByText('Products', { exact: true })).toBeVisible();
  });

  test('user cannot log in with an incorrect password', async ({ page }) => {
    await login(page, 'standard_user', 'wrong_password');

    await expect(
      page.getByText(
        'Epic sadface: Username and password do not match any user in this service',
        { exact: true }
      )
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login', exact: true })).toBeVisible();
  });

  test('user cannot log in with an empty password', async ({ page }) => {
    await login(page, 'standard_user', '');

    await expect(page.getByText('Epic sadface: Password is required', { exact: true }))
      .toBeVisible();
    await expect(page.getByRole('button', { name: 'Login', exact: true })).toBeVisible();
  });

  test('can someone open the products page without logging in?', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');

    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(
      page.getByText(
        "Epic sadface: You can only access '/inventory.html' when you are logged in.",
        { exact: true }
      )
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login', exact: true })).toBeVisible();
    await expect(page.locator('.inventory_item')).toHaveCount(0);
  });

  test('Locked-out user', async ({ page }) => {
    await login(page, 'locked_out_user');

    await expect(
      page.getByText('Epic sadface: Sorry, this user has been locked out.', { exact: true })
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login', exact: true })).toBeVisible();
  });

  test('Access blocked after logout', async ({ page }) => {
    await login(page);
    await page.locator('#react-burger-menu-btn').click();
    await page.locator('#logout_sidebar_link').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/');

    for (const [path, message] of [
      ['/inventory.html', "Epic sadface: You can only access '/inventory.html' when you are logged in."],
      ['/checkout-step-one.html', "Epic sadface: You can only access '/checkout-step-one.html' when you are logged in."]
    ]) {
      await page.goto(`https://www.saucedemo.com${path}`);
      await expect(page).toHaveURL('https://www.saucedemo.com/');
      await expect(page.getByText(message, { exact: true })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Login', exact: true })).toBeVisible();
    }
  });
});
