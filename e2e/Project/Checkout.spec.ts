import { test, expect } from '@playwright/test';
import { login } from './test-helpers';

test.describe('Checkout', () => {
  test('Proceed to checkout', async ({ page }) => {
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
    await page.getByRole('button', { name: 'Remove', exact: true }).first().click();
    // Verify that the cart badge displays 1.
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    // Proceed to checkout and verify that the checkout page is displayed.
    await page.getByRole('button', { name: 'Checkout', exact: true }).click();
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
    // Enter checkout information and continue to the next step.
    await page.getByPlaceholder('First Name').fill('John');
    await page.getByPlaceholder('Last Name').fill('Doe');
    await page.getByPlaceholder('Zip/Postal Code').fill('12345');
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await page.getByRole('button', { name: 'Finish', exact: true }).click();
    // Verify that the checkout complete page is displayed.
    //await expect(page).toHaveURL(/\/checkout-complete\.html$/);
    await expect(page.getByText('Thank you for your order!', { exact: true })).toBeVisible();

  });

  test('Error while proceeding to checkout-First Name required', async ({ page }) => {
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
    await page.getByRole('button', { name: 'Remove', exact: true }).first().click();
    // Verify that the cart badge displays 1.
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    // Proceed to checkout and verify that the checkout page is displayed.
    await page.getByRole('button', { name: 'Checkout', exact: true }).click();
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
    // Enter checkout information and continue to the next step.
    //await page.getByPlaceholder('First Name').fill('John');
    //await page.getByPlaceholder('Last Name').fill('Doe');
    //await page.getByPlaceholder('Zip/Postal Code').fill('12345');
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    //await page.getByRole('button', { name: 'Finish', exact: true }).click();  
    // Verify that the checkout complete page is displayed.
    //await expect(page).toHaveURL(/\/checkout-complete\.html$/);
    //await expect(page.getByText('Thank you for your order!', { exact: true })).toBeVisible();  
    await expect(page.getByText('Error: First Name is required', { exact: true })).toBeVisible();

  });

  test('Error while proceeding to checkout-Last Name required', async ({ page }) => {
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
    await page.getByRole('button', { name: 'Remove', exact: true }).first().click();
    // Verify that the cart badge displays 1.
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    // Proceed to checkout and verify that the checkout page is displayed.
    await page.getByRole('button', { name: 'Checkout', exact: true }).click();
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
    // Enter checkout information and continue to the next step.
    await page.getByPlaceholder('First Name').fill('John');
    //await page.getByPlaceholder('Last Name').fill('Doe');
    //await page.getByPlaceholder('Zip/Postal Code').fill('12345');
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    //await page.getByRole('button', { name: 'Finish', exact: true }).click();  
    // Verify that the checkout complete page is displayed.
    //await expect(page).toHaveURL(/\/checkout-complete\.html$/);
    //await expect(page.getByText('Thank you for your order!', { exact: true })).toBeVisible();  
    await expect(page.getByText('Error: Last Name is required', { exact: true })).toBeVisible();

  });

  test('Error while proceeding to checkout-Postal Code required', async ({ page }) => {
    await login(page);
    await page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Backpack' })
      .getByRole('button', { name: 'Add to cart' }).click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.getByRole('button', { name: 'Checkout', exact: true }).click();
    await page.getByPlaceholder('First Name').fill('John');
    await page.getByPlaceholder('Last Name').fill('Doe');
    await page.getByRole('button', { name: 'Continue', exact: true }).click();

    await expect(page.getByText('Error: Postal Code is required', { exact: true })).toBeVisible();
  });

  test('Checking if Checkout: Overview is visible and clicking on cancel', async ({ page }) => {
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
    // Proceed to checkout and verify that the checkout page is displayed.
    await page.getByRole('button', { name: 'Checkout', exact: true }).click();
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
    // Enter checkout information and continue to the next step.
    await page.getByPlaceholder('First Name').fill('John');
    await page.getByPlaceholder('Last Name').fill('Doe');
    await page.getByPlaceholder('Zip/Postal Code').fill('12345');
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await expect(page.getByText('Checkout: Overview', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page.locator('.cart_item')).toHaveCount(1);
    await expect(
      page.locator('.cart_item').filter({ hasText: 'Sauce Labs Bike Light' })
    ).toHaveCount(1);
  });

  test('Verify checkout calculations', async ({ page }) => {
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
    const prices = page.locator('.inventory_item_price');
    // Read each price as text: "$29.99" and "$9.99"
    const firstText = await prices.nth(0).innerText();
    const secondText = await prices.nth(1).innerText();
    // Remove "$" and convert text into numbers
    const firstPrice = Number(firstText.replace('$', '').trim());
    const secondPrice = Number(secondText.replace('$', '').trim());
    // Add the numbers
    const expectedSubtotal = firstPrice + secondPrice;
    console.log(expectedSubtotal); // 39.98
    await page.getByRole('button', { name: 'Checkout', exact: true }).click();
    await page.getByPlaceholder('First Name').fill('John');
    await page.getByPlaceholder('Last Name').fill('Doe');
    await page.getByPlaceholder('Zip/Postal Code').fill('12345');
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await expect(page.getByText('Checkout: Overview', { exact: true })).toBeVisible();
    // Read the displayed subtotal, such as "Item total: $39.98"
    const subtotalText = await page.locator('.summary_subtotal_label').innerText();
    // Keep the amount after "$" and convert it to a number
    const actualSubtotal = Number(subtotalText.split('$')[1].trim());
    // Compare it with the sum you calculated earlier
    expect(actualSubtotal).toBeCloseTo(expectedSubtotal, 2);
    const taxText = await page.locator('.summary_tax_label').innerText();
    const tax = Number(taxText.split('$')[1].trim());
    const totalText = await page.locator('.summary_total_label').innerText();
    const actualTotal = Number(totalText.split('$')[1].trim());
    const expectedTotal = expectedSubtotal + tax;
    expect(actualTotal).toBeCloseTo(expectedTotal, 2);

  });

  test('Cart contents match checkout', async ({ page }) => {
    await login(page);
    for (const productName of ['Sauce Labs Backpack', 'Sauce Labs Bike Light']) {
      const product = page.locator('.inventory_item').filter({ hasText: productName });
      await product.getByRole('button', { name: 'Add to cart' }).click();
    }

    await page.locator('[data-test="shopping-cart-link"]').click();
    const cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveCount(2);
    await expect(cartItems.nth(0).locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');
    await expect(cartItems.nth(0).locator('.inventory_item_price')).toHaveText('$29.99');
    await expect(cartItems.nth(0).locator('.cart_quantity')).toHaveText('1');
    await expect(cartItems.nth(1).locator('.inventory_item_name')).toHaveText('Sauce Labs Bike Light');
    await expect(cartItems.nth(1).locator('.inventory_item_price')).toHaveText('$9.99');
    await expect(cartItems.nth(1).locator('.cart_quantity')).toHaveText('1');

    await page.getByRole('button', { name: 'Checkout', exact: true }).click();
    await page.getByPlaceholder('First Name').fill('John');
    await page.getByPlaceholder('Last Name').fill('Doe');
    await page.getByPlaceholder('Zip/Postal Code').fill('12345');
    await page.getByRole('button', { name: 'Continue', exact: true }).click();

    const overviewItems = page.locator('.cart_item');
    await expect(overviewItems).toHaveCount(2);
    await expect(overviewItems.nth(0).locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');
    await expect(overviewItems.nth(0).locator('.inventory_item_price')).toHaveText('$29.99');
    await expect(overviewItems.nth(0).locator('.cart_quantity')).toHaveText('1');
    await expect(overviewItems.nth(1).locator('.inventory_item_name')).toHaveText('Sauce Labs Bike Light');
    await expect(overviewItems.nth(1).locator('.inventory_item_price')).toHaveText('$9.99');
    await expect(overviewItems.nth(1).locator('.cart_quantity')).toHaveText('1');
  });

  test('Cart clears after ordering', async ({ page }) => {
    await login(page);
    await page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Backpack' })
      .getByRole('button', { name: 'Add to cart' }).click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.getByRole('button', { name: 'Checkout', exact: true }).click();
    await page.getByPlaceholder('First Name').fill('John');
    await page.getByPlaceholder('Last Name').fill('Doe');
    await page.getByPlaceholder('Zip/Postal Code').fill('12345');
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await page.getByRole('button', { name: 'Finish', exact: true }).click();
    await expect(page.getByText('Thank you for your order!', { exact: true })).toBeVisible();

    await page.getByRole('button', { name: 'Back Home', exact: true }).click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page.locator('.cart_item')).toHaveCount(0);
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
  });

  test('Cancel from customer-details page', async ({ page }) => {
    await login(page);
    await page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Backpack' })
      .getByRole('button', { name: 'Add to cart' }).click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.getByRole('button', { name: 'Checkout', exact: true }).click();
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();

    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(page.locator('.cart_item')).toHaveCount(1);
    await expect(page.getByText('Sauce Labs Backpack', { exact: true })).toBeVisible();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });
});
