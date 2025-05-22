import axios from 'axios';

export async function fetcher<T = unknown>(url: string): Promise<T> {
  const res = await axios.get<T>(url);
  return res.data;
}
