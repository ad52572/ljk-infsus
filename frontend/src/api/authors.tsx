export type Author = {
  id: number;
  f_name: string;
  l_name: string;
  email: string;
  phone: string;
  b_day: string;
};

export async function getAuthors(): Promise<Author[]> {
  const res = await fetch(`${process.env.host}/api/authors`);
  return res.json();
}
