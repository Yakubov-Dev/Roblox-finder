import { NextRequest, NextResponse } from "next/server";
import type { Category, SearchResult } from "@/lib/roblox";

async function getJson(url: string) {
  const response = await fetch(url, { headers: { "User-Agent": "RobloxFinder/1.0" }, next: { revalidate: 60 } });
  if (!response.ok) throw new Error("Roblox API returned " + response.status);
  return response.json();
}
const enc = (s: string) => encodeURIComponent(s);

export async function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get("q") || "").trim().slice(0, 80);
  const category = (request.nextUrl.searchParams.get("category") || "games") as Category;
  if (q.length < 2) return NextResponse.json({ results: [] });
  try {
    let results: SearchResult[] = [];
    if (category === "games") {
      const data = await getJson("https://games.roblox.com/v1/games/search?keyword=" + enc(q) + "&limit=18");
      const games = (data.data || []) as any[];
      const ids = games.map(g => g.id).filter(Boolean).join(",");
      const images: Record<string, string> = {};
      if (ids) {
        try {
          const thumbs = await getJson("https://thumbnails.roblox.com/v1/games/icons?universeIds=" + ids + "&size=150x150&format=Png&isCircular=false");
          for (const t of thumbs.data || []) if (t.imageUrl) images[String(t.targetId)] = t.imageUrl;
        } catch {}
      }
      results = games.map(g => ({
        id: g.id, name: g.name || "Untitled experience", description: g.description || "",
        image: images[String(g.id)], subtitle: g.creator?.name ? "by " + g.creator.name : "Roblox experience",
        url: "https://www.roblox.com/games/" + (g.rootPlaceId || g.id),
        stats: typeof g.playerCount === "number" ? g.playerCount.toLocaleString() + " playing" : ""
      }));
    } else if (category === "users" || category === "avatars") {
      const data = await getJson("https://users.roblox.com/v1/users/search?keyword=" + enc(q) + "&limit=18");
      results = ((data.data || []) as any[]).map(u => ({
        id: u.id, name: u.displayName || u.name, description: u.name ? "@" + u.name : "Roblox player",
        subtitle: u.hasVerifiedBadge ? "Verified player" : "Player profile",
        image: "https://www.roblox.com/headshot-thumbnail/image?userId=" + u.id + "&width=150&height=150&format=png",
        url: "https://www.roblox.com/users/" + u.id + "/profile"
      }));
    } else if (category === "items") {
      const data = await getJson("https://catalog.roblox.com/v1/search/items/details?Keyword=" + enc(q) + "&Limit=18&SortType=3");
      results = ((data.data || []) as any[]).map(item => ({
        id: item.id, name: item.name || "Catalog item", description: item.description || "",
        subtitle: item.creatorName ? "by " + item.creatorName : "Catalog item",
        image: item.thumbnail?.url || "https://www.roblox.com/asset-thumbnail/image?assetId=" + item.id + "&width=150&height=150&format=png",
        url: "https://www.roblox.com/catalog/" + item.id,
        stats: item.price != null ? Number(item.price).toLocaleString() + " Robux" : "Catalog"
      }));
    } else if (category === "groups") {
      const data = await getJson("https://groups.roblox.com/v1/groups/search?keyword=" + enc(q) + "&limit=18");
      results = ((data.data || []) as any[]).map(g => ({
        id: g.id, name: g.name || "Roblox group", description: g.description || "",
        subtitle: "Community group", url: "https://www.roblox.com/groups/" + g.id,
        stats: typeof g.memberCount === "number" ? g.memberCount.toLocaleString() + " members" : ""
      }));
    }
    return NextResponse.json({ results });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Search failed";
    return NextResponse.json({ results: [], error: "Could not reach Roblox search right now. " + message }, { status: 502 });
  }
}