import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

export interface Poem {
  id: string;
  slug: string;
  title: string;
  order: number;
  collections: string[];
  layout: "default" | "with-artwork";
}

export interface Collection {
  id: string;
  name: string;
}

export const collections: Collection[] = [
  { id: "lunatic-hotel", name: "Отель Лунатика" },
  { id: "kaleidoscope", name: "Калейдоскоп" },
  { id: "soy-mirror", name: "Соевое Зеркало" },
  { id: "golden-cockerel", name: "Золотой Петушок" },
  { id: "misc", name: "Разное" },
];

export function toPoem(entry: CollectionEntry<"poems">): Poem {
  return {
    id: entry.id,
    slug: entry.data.slug,
    title: entry.data.title,
    order: entry.data.order,
    collections: entry.data.collections,
    layout: entry.data.layout,
  };
}

// Получение отсортированых стихов из папки poems
export async function getPoems(): Promise<Poem[]> {
  // getCollection - метод astro для получения данных из папки, детали в content.config.ts
  const entries = await getCollection("poems");

  // Сортировка: сравниваются два cтиха по идексу
  return entries.map(toPoem).sort((a, b) => {
    const aIndex = collections.findIndex((collection) =>
      a.collections.includes(collection.id),
    );

    const bIndex = collections.findIndex((collection) =>
      b.collections.includes(collection.id),
    );

    if (aIndex !== bIndex) {
      return aIndex - bIndex;
    }

    return a.order - b.order;
  });
}

// Получаем список стихов для одной категории
export async function getPoemsForCollection(
  collectionId: string,
): Promise<Poem[]> {
  const poems = await getPoems();

  // Если в будущем появится категория "Все"
  if (collectionId === "all") {
    return poems;
  }

  return poems.filter((poem) => poem.collections.includes(collectionId));
}

// Получение категории для стиха
export function getCollectionsForPoem(poem: Poem): Collection[] {
  return collections.filter((collection) =>
    poem.collections.includes(collection.id),
  );
}

// Получение стиха по тегу (нужно для русских названий)
export async function getPoemBySlug(slug: string): Promise<Poem | undefined> {
  const poems = await getPoems();

  return poems.find((poem) => poem.slug === slug);
}

// Получение соседних стихов для навигации
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
