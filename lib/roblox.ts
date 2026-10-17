export type Category = "games" | "users" | "items" | "groups" | "avatars";
export type SearchResult = {
  id: number;
  name: string;
  description?: string;
  image?: string;
  subtitle?: string;
  url?: string;
  stats?: string;
};
export type SearchResponse = { results: SearchResult[]; error?: string };
export const categoryLabels: Record<Category, string> = {
  games: "Games", users: "Players", items: "Items", avatars: "Avatars", groups: "Groups"
};