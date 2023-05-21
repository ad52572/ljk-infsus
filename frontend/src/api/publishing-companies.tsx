export type PublishingCompany = {
  id: number;
  name: string;
  description: string;
  founded: string;
  oib: string;
};

export async function getPublishingCompanies(): Promise<PublishingCompany[]> {
  const res = await fetch(`${process.env.host}/api/publishing-companies`);
  return res.json();
}

export async function getPublishingCompany(
  id: number
): Promise<PublishingCompany> {
  const res = await fetch(`${process.env.host}/api/publishing-companies/${id}`);
  return res.json();
}

export async function deletePublishingCompany(id: number): Promise<void> {
  const res = await fetch(
    `${process.env.host}/api/publishing-companies/${id}`,
    { method: "DELETE" }
  );
  console.log(res);
  if (!res.ok) {
    throw Error("Not deleted. Try again.");
  }
}

export async function createPublishingCompany(
  company: PublishingCompany
): Promise<PublishingCompany> {
  const res = await fetch(`${process.env.host}/api/publishing-companies`, {
    method: "POST",
    body: JSON.stringify(company),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw Error("Company not saved. Check data.");
  } else {
    return res.json();
  }
}

export async function updatePublishingCompany(
  company: PublishingCompany
): Promise<void> {
  const res = await fetch(
    `${process.env.host}/api/publishing-companies/${company.id}`,
    {
      method: "PUT",
      body: JSON.stringify(company),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
  if (!res.ok) {
    throw Error(await res.json());
  }
}
