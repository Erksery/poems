import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

export interface Poem {
  id: string;
  slug: string;
  title: string;
  collections: string[];
  layout: "default" | "with-artwork";
}

export interface Collection {
  id: string;
  name: string;
}

export const collections: Collection[] = [
  { id: "fairy-tales", name: "Сказки" },
  { id: "sad-untruths", name: "Печальные неправды" },
  { id: "obscene", name: "Матерные" },
];

function toPoem(entry: CollectionEntry<"poems">): Poem {
  return {
    id: entry.id,
    slug: entry.data.slug,
    title: entry.data.title,
    collections: entry.data.collections,
    layout: entry.data.layout,
  };
}

export async function getPoems(): Promise<Poem[]> {
  const entries = await getCollection("poems");

  return entries.map(toPoem).sort((a, b) => {
    const aIndex = collections.findIndex((collection) =>
      a.collections.includes(collection.id),
    );

    const bIndex = collections.findIndex((collection) =>
      b.collections.includes(collection.id),
    );

    return aIndex - bIndex;
  });
}

export async function getPoemsForCollection(
  collectionId: string,
): Promise<Poem[]> {
  const poems = await getPoems();

  if (collectionId === "all") {
    return poems;
  }

  return poems.filter((poem) => poem.collections.includes(collectionId));
}

export function getCollectionsForPoem(poem: Poem): Collection[] {
  return collections.filter((collection) =>
    poem.collections.includes(collection.id),
  );
}

export async function getPoemBySlug(slug: string): Promise<Poem | undefined> {
  const poems = await getPoems();

  return poems.find((poem) => poem.slug === slug);
}

export async function getAdjacentPoems(
  currentSlug: string,
  collectionId = "all",
) {
  const collectionPoems = await getPoemsForCollection(collectionId);

  const currentIndex = collectionPoems.findIndex(
    (poem) => poem.slug === currentSlug,
  );

  if (currentIndex === -1) {
    return {
      previous: undefined,
      next: undefined,
    };
  }

  return {
    previous: collectionPoems[currentIndex - 1],
    next: collectionPoems[currentIndex + 1],
  };
}
