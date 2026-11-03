import { test, expect } from '@playwright/test';
import { login } from './test-helpers';

test.describe('Products', () => {
  test('displays backpack product and price', async ({ page }) => {
    await login(page);
    // 3. Verify the Products heading is visible
    await expect(page.getByText('Sauce Labs Backpack', { exact: true })).toBeVisible();
    // 4. Verify its price "$29.99" is visible
    await expect(page.getByText('$29.99', { exact: true })).toBeVisible();
  });

  test('displays all available products', async ({ page }) => {
    await login(page);
    // 3. Verify all Products are visible
    // Verify exactly six product cards are displayed
    await expect(page.locator('.inventory_item')).toHaveCount(6);
    // Verify exactly six Add to cart buttons are displayed
    await expect(page.getByRole('button', { name: 'Add to cart' })).toHaveCount(6);



  });

  test('Sorting Products', async ({ page }) => {
    await login(page);
    //sorting products by price (low to high)
    await page.getByRole('combobox').selectOption('lohi');
    await expect(page.locator('.inventory_item_price')).toHaveCount(6);
    const prices = await page.locator('.inventory_item_price').allInnerTexts();
    expect(prices).toHaveLength(6);
    const priceNumbers = prices.map(price => Number(price.replace('$', '').trim()));
    const sortedPrices = [...priceNumbers].sort((a, b) => a - b);
    expect(priceNumbers).toEqual(sortedPrices);
    await page.reload();
  });

  test('Other sorting options', async ({ page }) => {
    await login(page);
    await expect(page).toHaveURL(/\/inventory\.html$/);
    const sort = page.locator('[data-test="product-sort-container"]');

    await sort.selectOption('hilo');
    await expect(page.locator('.inventory_item_price')).toHaveCount(6);
    const highToLowPrices = (await page.locator('.inventory_item_price').allInnerTexts())
      .map(price => Number(price.replace('$', '').trim()));
    expect(highToLowPrices).toHaveLength(6);
    expect(highToLowPrices).toEqual([...highToLowPrices].sort((a, b) => b - a));

    await sort.selectOption('az');
    await expect(page.locator('.inventory_item_name')).toHaveCount(6);
    const namesAscending = await page.locator('.inventory_item_name').allInnerTexts();
    expect(namesAscending).toHaveLength(6);
    expect(namesAscending).toEqual([...namesAscending].sort((a, b) => a.localeCompare(b)));

    await sort.selectOption('za');
    await expect(page.locator('.inventory_item_name')).toHaveCount(6);
    const namesDescending = await page.locator('.inventory_item_name').allInnerTexts();
    expect(namesDescending).toHaveLength(6);
    expect(namesDescending).toEqual([...namesDescending].sort((a, b) => b.localeCompare(a)));
  });

  test('Product details match', async ({ page }) => {
    await login(page);
    const backpack = page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Backpack' });
    const listingName = await backpack.locator('.inventory_item_name').innerText();
    const listingDescription = await backpack.locator('.inventory_item_desc').innerText();
    const listingPrice = await backpack.locator('.inventory_item_price').innerText();

    await backpack.locator('.inventory_item_name').click();

    await expect(page.locator('.inventory_details_name')).toHaveText(listingName);
    await expect(page.locator('.inventory_details_desc')).toHaveText(listingDescription);
    await expect(page.locator('.inventory_details_price')).toHaveText(listingPrice);
  });

  test('Add/remove from product details', async ({ page }) => {
    await login(page);
    const backpack = page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Backpack' });
    await backpack.locator('.inventory_item_name').click();
    // Wait for the backpack details page
    await expect(page).toHaveURL(/\/inventory-item\.html\?id=4$/);
    await expect(page.locator('.inventory_details_name')).toHaveText('Sauce Labs Backpack');
    await page.getByRole('button', {name: 'Add to cart',exact: true}).click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    await expect(page.getByRole('button', { name: 'Remove', exact: true })).toBeVisible();

    await page.getByRole('button', { name: 'Remove', exact: true }).click();
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
    await page.getByRole('button', { name: 'Back to products', exact: true }).click();
    await expect(
      page.locator('.inventory_item').filter({ hasText: 'Sauce Labs Backpack' })
        .getByRole('button', { name: 'Add to cart' })
    ).toBeVisible();
    await backpack.locator('.inventory_item_name').click();
    // Confirm we reached the correct product details
    await expect(page).toHaveURL(/\/inventory-item\.html\?id=4$/);
    await expect(page.locator('.inventory_details_name')).toHaveText('Sauce Labs Backpack');
    //Then add the product
    await page.getByRole('button', {name: 'Add to cart',exact: true}).click();
  });

  test('Select a product', async ({ page }) => {
  await login(page);
  await page.getByText('Sauce Labs Backpack', { exact: true }).click();
  await expect(page.locator('.inventory_details_name')).toHaveText('Sauce Labs Backpack');
});
});
