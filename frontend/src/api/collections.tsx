import { Book } from "@/api/books";
import { Author } from "@/api/authors";

export type Collection = {
  id?: number;
  name: string;
  books: Book[] | null;
  author: Author | null;
};

export async function getCollections(): Promise<Collection[]> {
  const res = await fetch(`${process.env.host}/api/collections`);
  return res.json();
}

export async function getCollection(collectionId: number): Promise<Collection> {
  const res = await fetch(
    `${process.env.host}/api/collections/${collectionId}`
  );
  return res.json();
}

export async function deleteCollection(id: number): Promise<void> {
  const res = await fetch(`${process.env.host}/api/collections/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw Error("Collection not saved. Check data.");
  }
}

export async function createCollection(
  collection: Collection
): Promise<Collection> {
  const res = await fetch(`${process.env.host}/api/collections`, {
    method: "POST",
    body: JSON.stringify(collection),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw Error("Collection not saved. Check data.");
  } else {
    return res.json();
  }
}

export async function updateCollection(collection: Collection): Promise<void> {
  const res = await fetch(
    `${process.env.host}/api/collections/${collection.id}`,
    {
      method: "PUT",
      body: JSON.stringify(collection),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
  if (!res.ok) {
    throw Error("Collection not saved. Check data.");
  }
}
