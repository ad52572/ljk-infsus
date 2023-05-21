import { expect, test } from "@playwright/test";
import {
  deletePublishingCompany,
  postPublishingCompany,
  postPublishingCompanyErrorDescription,
  postPublishingCompanyErrorOIB,
  publishingCompanies,
  updatedPublishingCompany,
  updatePublishingCompany,
} from "./test-data/publishing-companies";

let companies: any = [];
let deleteCompany: any = null;
let updateCompany: any = null;
let postCompany: any = null;

test.beforeEach(async ({ context, request }, testInfo) => {
  if (testInfo.title.includes("@GET")) {
    for (const publishingCompany of publishingCompanies) {
      const response = await request.post("/api/publishing-companies", {
        data: publishingCompany,
      });
      let body = await response.json();
      companies.push(body);
    }
  } else if (testInfo.title.includes("@DELETE")) {
    const response = await request.post("/api/publishing-companies", {
      data: deletePublishingCompany,
    });
    deleteCompany = await response.json();
  } else if (testInfo.title.includes("@PUT")) {
    const response = await request.post("/api/publishing-companies", {
      data: updatePublishingCompany,
    });
    updateCompany = await response.json();
  }
});

test.afterEach(async ({ context, request }, testInfo) => {
  if (testInfo.title.includes("@GET")) {
    for (const publishingCompany of companies) {
      await request.delete(`/api/publishing-companies/${publishingCompany.id}`);
    }
  } else if (testInfo.title.includes("@PUT")) {
    await request.delete(`/api/publishing-companies/${updateCompany.id}`);
  } else if (testInfo.title.includes("@POST")) {
    await request.delete(`/api/publishing-companies/${postCompany.id}`);
  }
});

test("should get all publishing companies @GET", async ({ request }) => {
  const response = await request.get("/api/publishing-companies");
  let body = await response.json();
  await expect(response).toBeOK();
  for (const company of companies) {
    await expect(body).toContainEqual(company);
  }
});

test(`should get by id publishing company @GET`, async ({ request }) => {
  for (const company of companies) {
    const response = await request.get(
      `/api/publishing-companies/${company.id}`
    );
    let body = await response.json();
    await expect(response).toBeOK();
    await expect(body).toEqual(company);
  }
});

test(`should delete publishing company by id @DELETE`, async ({ request }) => {
  let response = await request.delete(
    `/api/publishing-companies/${deleteCompany.id}`
  );
  await expect(response).toBeOK();
  response = await request.get(`/api/publishing-companies/${deleteCompany.id}`);
  await expect(response).not.toBeOK();
});

test(`should update publishing company by id @PUT`, async ({ request }) => {
  let response = await request.put(
    `/api/publishing-companies/${updateCompany.id}`,
    {
      data: updatedPublishingCompany,
    }
  );
  await expect(response).toBeOK();
  await expect(await response.json()).not.toEqual(updatePublishingCompany);
});

test(`should create publishing company @POST`, async ({ request }) => {
  let response = await request.post(`/api/publishing-companies`, {
    data: postPublishingCompany,
  });
  await expect(response).toBeOK();
  let body = await response.json();
  delete body.id;
  await expect(body).toEqual(postPublishingCompany);
  postCompany = await response.json();
});

test(`should return error for OIB @ERROR-POST`, async ({ request }) => {
  let response = await request.post(`/api/publishing-companies`, {
    data: postPublishingCompanyErrorOIB,
  });
  await expect(response).not.toBeOK();
  let body = await response.json();
  await expect(body).toContain("OIB format not valid");
});

test(`should return error for description @ERROR-POST`, async ({ request }) => {
  let response = await request.post(`/api/publishing-companies`, {
    data: postPublishingCompanyErrorDescription,
  });
  await expect(response).not.toBeOK();
  let body = await response.json();
  await expect(body).toContain(
    "Description must be between 10 and 100 characters long"
  );
});
