import { expect, test } from "@playwright/test";
import { postPublishingCompany } from "./test-data/publishing-companies";

let initialCompanies: number[] = [];
let cleanCompanies: number[] = [];
let postCompany: number | null = null;
let cleanCompaniesAfter: number[] = [];

test.beforeEach(async ({ page, request }, testInfo) => {
  if (testInfo.title.includes("@ADD")) {
    let response = await request.get(
      `http://localhost:8080/api/publishing-companies`
    );
    let body = await response.json();
    body.forEach((company: any) => {
      initialCompanies.push(company.id);
    });
  } else if (testInfo.title.includes("@DELETE")) {
    let response = await request.post(
      `http://localhost:8080/api/publishing-companies`,
      {
        data: postPublishingCompany,
      }
    );
    let body = await response.json();

    postCompany = body.id;
  }
});

test.afterEach(async ({ context, request }, testInfo) => {
  if (testInfo.title.includes("@ADD")) {
    let response = await request.get(
      `http://localhost:8080/api/publishing-companies`
    );
    let body = await response.json();
    body.forEach((company: any) => {
      if (!initialCompanies.includes(parseInt(company.id!))) {
        cleanCompaniesAfter.push(parseInt(company.id!));
      }
    });
    for (const publishingCompany of cleanCompaniesAfter) {
      await request.delete(
        `http://localhost:8080/api/publishing-companies/${publishingCompany}`
      );
    }
  }
});

test("should add new publishing company @ADD", async ({ page }) => {
  await page.goto("/publishing-companies");
  await page.click("text=Add a row");
  await expect(page.locator("//tr[@data-row-key]").first()).toBeVisible();
  let rows = page.locator("//tr[@data-row-key]");
  for (const row of await rows.all()) {
    let row_key = await row.getAttribute("data-row-key");
    if (!initialCompanies.includes(parseInt(row_key!))) {
      cleanCompanies.push(parseInt(row_key!));
    }
  }
  expect(cleanCompanies.length).toEqual(1);
});

test("should delete publishing company @DELETE", async ({ page }) => {
  await page.goto("/publishing-companies");
  await page.click(
    `//tr[@data-row-key=${postCompany}]/td/a[contains(text(),'Delete')]`
  );
  await page.click("//button/span[contains(text(),'OK')]");
  await expect(
    page.locator("//div[contains(text(), 'Row deleted.')]")
  ).toBeVisible();
});
