export interface Collection {
  id: string;
  name: string;
}

export const collections: Collection[] = [
  { id: "all", name: "Все" },
  { id: "fairy-tales", name: "Сказки" },
  { id: "sad-untruths", name: "Печальные неправды" },
];
