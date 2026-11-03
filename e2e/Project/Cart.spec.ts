import { test, expect } from '@playwright/test';
import { login } from './test-helpers';

test.describe('Cart', () => {
  test('Adding 1 product to the cart', async ({ page }) => {
    await login(page);
    //Locate the Sauce Labs Backpack product.
    await expect(page.getByText('Sauce Labs Backpack', { exact: true })).toBeVisible();
    // Click Add to cart for that product only.
    const backpack = page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Backpack' });
    await backpack.getByRole('button', { name: 'Add to cart' }).click();
    // Verify that the cart badge displays 1.
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('Verifying if item is added to the cart in the shopping cart', async ({ page }) => {
    await login(page);
    //Locate the Sauce Labs Backpack product.
    await expect(page.getByText('Sauce Labs Backpack', { exact: true })).toBeVisible();
    // Click Add to cart for that product only.
    const backpack = page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Backpack' });
    await backpack.getByRole('button', { name: 'Add to cart' }).click();
    // Verify that the cart badge displays 1.
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    //Verify that the cart contains only the Sauce Labs Backpack product.
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page.getByText('Sauce Labs Backpack', { exact: true })).toBeVisible();
  });

  test('Removing the item from the shopping cart', async ({ page }) => {
    await login(page);
    //Locate the Sauce Labs Backpack product.
    await expect(page.getByText('Sauce Labs Backpack', { exact: true })).toBeVisible();
    // Click Add to cart for that product only.
    const backpack = page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Backpack' });
    await backpack.getByRole('button', { name: 'Add to cart' }).click();
    // Verify that the cart badge displays 1.
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    //Verify that the cart contains only the Sauce Labs Backpack product.
    await page.locator('[data-test="shopping-cart-link"]').click();
    // Remove the item from the cart.
    await page.getByRole('button', { name: 'Remove', exact: true }).click();
    // Verify that the cart badge is no longer visible.
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
    await expect(page.locator('.cart_item')).toHaveCount(0);
  });

  test('Adding 2 products to the cart', async ({ page }) => {
    await login(page);
    //Locate the Sauce Labs Backpack product.
    await expect(page.getByText('Sauce Labs Backpack', { exact: true })).toBeVisible();
    await expect(page.getByText('Sauce Labs Bike Light', { exact: true })).toBeVisible();
    // Click Add to cart for that product only.
    const backpack = page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Backpack' });
    await backpack.getByRole('button', { name: 'Add to cart' }).click();
    const bikeLight = page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Bike Light' });
    await bikeLight.getByRole('button', { name: 'Add to cart' }).click();
    // Verify that the cart badge displays 2.
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
  });

  test('remove one product and check that the other stays', async ({ page }) => {
    await login(page);
    //Locate the Sauce Labs Backpack product.
    await expect(page.getByText('Sauce Labs Backpack', { exact: true })).toBeVisible();
    await expect(page.getByText('Sauce Labs Bike Light', { exact: true })).toBeVisible();
    // Click Add to cart for that product only.
    const backpack = page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Backpack' });
    await backpack.getByRole('button', { name: 'Add to cart' }).click();
    const bikeLight = page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Bike Light' });
    await bikeLight.getByRole('button', { name: 'Add to cart' }).click();
    // Verify that the cart badge displays 2.
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
    //Open the shopping cart and remove one product.
    await page.locator('[data-test="shopping-cart-link"]').click();
    const backpackInCart = page.locator('.cart_item').filter({ hasText: 'Sauce Labs Backpack' });
    await backpackInCart.getByRole('button', { name: 'Remove', exact: true }).click();
    await expect(backpackInCart).toHaveCount(0);
    await expect(
      page.locator('.cart_item').filter({ hasText: 'Sauce Labs Bike Light' })
    ).toHaveCount(1);
    // Verify that the cart badge displays 1.
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('keeps carts separate between browser sessions', async ({ browser }) => {
    const contextA = await browser.newContext();
    const contextB = await browser.newContext();

    try {
      const pageA = await contextA.newPage();
      const pageB = await contextB.newPage();

      for (const page of [pageA, pageB]) {
        await login(page);
        await expect(page).toHaveURL(/\/inventory\.html$/);
      }

      const backpack = pageA.locator('.inventory_item').filter({ hasText: 'Sauce Labs Backpack' });
      await backpack.getByRole('button', { name: 'Add to cart' }).click();
      await expect(pageA.locator('.shopping_cart_badge')).toHaveText('1');

      await pageB.locator('[data-test="shopping-cart-link"]').click();
      await expect(pageB).toHaveURL(/\/cart\.html$/);
      await expect(pageB.locator('.cart_item')).toHaveCount(0);
    } finally {
      await contextA.close();
      await contextB.close();
    }



  });

  test('Cart shared between tabs', async ({ context }) => {
    const pageA = await context.newPage();
    const pageB = await context.newPage();

    await login(pageA);
    await expect(pageA).toHaveURL(/\/inventory\.html$/);
    await pageB.goto('https://www.saucedemo.com/inventory.html');
    await expect(pageB).toHaveURL(/\/inventory\.html$/);

    const backpackA = pageA.locator('.inventory_item').filter({ hasText: 'Sauce Labs Backpack' });
    await backpackA.getByRole('button', { name: 'Add to cart' }).click();

    await pageB.reload();
    const backpackB = pageB.locator('.inventory_item').filter({ hasText: 'Sauce Labs Backpack' });
    await expect(backpackB.getByRole('button', { name: 'Remove' })).toBeVisible();
    await backpackB.getByRole('button', { name: 'Remove' }).click();

    await pageA.reload();
    const backpackAfterReload = pageA.locator('.inventory_item').filter({ hasText: 'Sauce Labs Backpack' });
    await expect(backpackAfterReload.getByRole('button', { name: 'Add to cart' })).toBeVisible();
    await expect(pageA.locator('.shopping_cart_badge')).toHaveCount(0);
  });

  test('Cart preserved after refresh', async ({ page }) => {
    await login(page);
    await page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Backpack' })
      .getByRole('button', { name: 'Add to cart' }).click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    await page.reload();

    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    await expect(
      page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Backpack' })
        .getByRole('button', { name: 'Remove', exact: true })
    ).toBeVisible();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page.locator('.cart_item')).toHaveCount(1);
    await expect(
      page.locator('.cart_item').filter({ hasText: 'Sauce Labs Backpack' })
    ).toHaveCount(1);
  });

  test('Cart preserved after logout and login', async ({ page }) => {
    await login(page);
    await page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Backpack' })
      .getByRole('button', { name: 'Add to cart' }).click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    await page.locator('#react-burger-menu-btn').click();
    await page.locator('#logout_sidebar_link').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/');

    await login(page);
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page.locator('.cart_item')).toHaveCount(1);
    await expect(
      page.locator('.cart_item').filter({ hasText: 'Sauce Labs Backpack' })
    ).toHaveCount(1);
  });

  test('Continue Shopping preserves cart', async ({ page }) => {
    await login(page);
    await page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Backpack' })
      .getByRole('button', { name: 'Add to cart' }).click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.getByRole('button', { name: 'Continue Shopping', exact: true }).click();
    await page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Bike Light' })
      .getByRole('button', { name: 'Add to cart' }).click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
    await page.locator('[data-test="shopping-cart-link"]').click();

    await expect(page.locator('.cart_item')).toHaveCount(2);
    await expect(page.getByText('Sauce Labs Backpack', { exact: true })).toBeVisible();
    await expect(page.getByText('Sauce Labs Bike Light', { exact: true })).toBeVisible();
  });
});
