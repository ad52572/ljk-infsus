import { expect, test } from "@playwright/test";

test("should redirect to home page", async ({ page }) => {
  await page.goto("/");
  await page.locator('//a[contains(text(), "Home")]/..').click();
  await page.waitForURL(/.*\/$/);
  expect(page.url()).toContain("/");
});

test("should redirect to authors page", async ({ page }) => {
  await page.goto("/");
  await page.locator('//a[contains(text(), "Authors")]/..').click();
  await page.waitForURL(/.*\/authors$/);
  expect(page.url()).toContain("/authors");
});

test("should redirect to publishing-companies page", async ({ page }) => {
  await page.goto("/");
  await page
    .locator('//a[contains(text(), "Publishing companies")]/..')
    .click();
  await page.waitForURL(/.*\/publishing-companies$/);
  expect(page.url()).toContain("/publishing-companies");
});

test("should redirect to collections page", async ({ page }) => {
  await page.goto("/");
  await page.locator('//a[contains(text(), "Collections")]/..').click();
  await page.waitForURL(/.*\/collections$/);
  expect(page.url()).toContain("/collections");
});
