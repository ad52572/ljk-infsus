import { getBooks } from "@/api/books";

export default async function Books() {
  let books = await getBooks();
  console.log(books);
  return <main></main>;
}
