export type Book = {
  id: number;
  title: string;
  publicationDate: string;
  description: string;
  price: number;
  publishingCompanyId: number | null;
  authorId: number | null;
  collectionId: number;
};

export async function getBooks(): Promise<Book[]> {
  const res = await fetch(`${process.env.host}/api/books`);
  return res.json();
}

export async function deleteBook(id: number): Promise<void> {
  const res = await fetch(`${process.env.host}/api/books/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw Error("Delete book error.");
  }
}

export async function updateBook(book: Book): Promise<void> {
  const res = await fetch(`${process.env.host}/api/books/${book.id}`, {
    method: "PUT",
    body: JSON.stringify(book),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw Error("Collection not saved. Check data.");
  }
}

export async function createBook(book: Book): Promise<Book> {
  const res = await fetch(`${process.env.host}/api/books`, {
    method: "POST",
    body: JSON.stringify(book),
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
