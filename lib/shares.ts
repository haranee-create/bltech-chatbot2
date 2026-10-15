import { list } from "@vercel/blob";
import type { ShareMeta } from "./types";

export type Share = { meta: ShareMeta; cardUrl: string; ogUrl: string };

export async function getShare(id: string): Promise<Share | null> {
  if (!/^[a-f0-9]{16}$/.test(id) || !process.env.BLOB_READ_WRITE_TOKEN) return null;

  const { blobs } = await list({ prefix: `shares/${id}/` });
  const find = (name: string) => blobs.find((b) => b.pathname.endsWith(name));
  const card = find("card.jpg");
  const og = find("og.jpg");
  const metaBlob = find("meta.json");
  if (!card || !og || !metaBlob) return null;

  const res = await fetch(metaBlob.url, { cache: "force-cache" });
  if (!res.ok) return null;
  return { meta: (await res.json()) as ShareMeta, cardUrl: card.url, ogUrl: og.url };
}
