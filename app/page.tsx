"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Gamepad2, Users, Shirt, UsersRound, Sparkles, Heart, History, Moon, Sun, ExternalLink, ArrowUpRight, LoaderCircle, X, Github, Compass, Command } from "lucide-react";
import type { Category, SearchResult, SearchResponse } from "@/lib/roblox";
import { categoryLabels } from "@/lib/roblox";

const categories: { id: Category; icon: typeof Gamepad2; hint: string }[] = [
  { id: "games", icon: Gamepad2, hint: "Discover experiences" },
  { id: "users", icon: Users, hint: "Find players" },
  { id: "items", icon: Shirt, hint: "Explore the catalog" },
  { id: "avatars", icon: Sparkles, hint: "Find avatar creators" },
  { id: "groups", icon: UsersRound, hint: "Explore communities" }
];
const popular = ["Brookhaven", "Dress to Impress", "Blox Fruits", "Adopt Me!", "Tower of Hell"];
type Recent = { q: string; category: Category };

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category>("games");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recent, setRecent] = useState<Recent[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [light, setLight] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      setFavorites(JSON.parse(localStorage.getItem("rf-favorites") || "[]"));
      setRecent(JSON.parse(localStorage.getItem("rf-recent") || "[]"));
      setLight(localStorage.getItem("rf-light") === "true");
    } catch {}
  }, []);

  async function search(value = query, cat = category) {
    const term = value.trim();
    if (term.length < 2) { setError("Type at least 2 characters to search."); return; }
    setQuery(term); setCategory(cat); setLoading(true); setError(""); setSearched(true); setShowFavorites(false);
    try {
      const response = await fetch("/api/search?q=" + encodeURIComponent(term) + "&category=" + cat);
      const data = await response.json() as SearchResponse;
      if (!response.ok) throw new Error(data.error || "Search failed. Please try again.");
      setResults(data.results || []);
      const next = [{ q: term, category: cat }, ...recent.filter(r => r.q.toLowerCase() !== term.toLowerCase() || r.category !== cat)].slice(0, 8);
      setRecent(next);
      try { localStorage.setItem("rf-recent", JSON.stringify(next)); } catch {}
    } catch (e) { setResults([]); setError(e instanceof Error ? e.message : "Something went wrong."); }
    finally { setLoading(false); }
  }
  function toggleFavorite(item: SearchResult) {
    const key = category + ":" + item.id;
    const next = favorites.includes(key) ? favorites.filter(x => x !== key) : [...favorites, key];
    setFavorites(next);
    try { localStorage.setItem("rf-favorites", JSON.stringify(next)); } catch {}
  }
  function setTheme(value: boolean) {
    setLight(value);
    try { localStorage.setItem("rf-light", String(value)); } catch {}
  }
  const activeCategory = categories.find(c => c.id === category)!;

  return <main className={"app-shell min-h-screen " + (light ? "light-mode" : "")}>
    <style jsx global>{`
      .light-mode { background: radial-gradient(ellipse at 50% -20%, rgba(139,92,246,.12), transparent 50%), #f6f7fb; color:#151521; }
      .light-mode .glass { background:rgba(255,255,255,.88); border-color:rgba(20,20,40,.1); }
      .light-mode .pill { border-color:rgba(20,20,40,.13); background:rgba(20,20,40,.035); }
      .light-mode .pill-active { background:#ede9fe; color:#5b21b6; border-color:#c4b5fd; }
      .light-mode .result-card { background:rgba(255,255,255,.85); border-color:rgba(20,20,40,.09); }
      .light-mode input { color:#171725; }
    `}</style>
    <header className="container flex h-[76px] items-center justify-between border-b border-white/[.07]">
      <a href="#" className="flex items-center gap-3 no-underline"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-500 text-white"><Compass size={22}/></span><span><span className="block text-[16px] font-black tracking-tight">roblox<span className="text-violet-400">finder</span></span><span className="block text-[10px] tracking-[.2em] text-gray-500">EXPLORE MORE</span></span></a>
      <nav className="flex items-center gap-2"><button onClick={() => {setShowFavorites(true);setSearched(false);}} className="pill flex items-center gap-2 rounded-xl px-3 py-2 text-sm"><Heart size={16}/><span className="hidden sm:inline">Favorites</span><span>{favorites.length || ""}</span></button><button aria-label="Toggle theme" onClick={() => setTheme(!light)} className="pill flex h-10 w-10 items-center justify-center rounded-xl">{light ? <Moon size={17}/> : <Sun size={17}/>}</button><a aria-label="GitHub repository" href="https://github.com/Yakubov-Dev/Roblox-finder" target="_blank" rel="noreferrer" className="pill flex h-10 w-10 items-center justify-center rounded-xl"><Github size={17}/></a></nav>
    </header>
    <section className="container pb-10 pt-16 text-center sm:pt-24">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/[.08] px-3 py-1.5 text-xs font-medium text-violet-300"><Sparkles size={14}/> Your Roblox universe, all in one place</div>
      <h1 className="mx-auto max-w-4xl text-4xl font-black leading-[1.08] tracking-[-.045em] sm:text-6xl md:text-7xl">Find your next <span className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-sky-300 bg-clip-text text-transparent">obsession.</span></h1>
      <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-gray-400 sm:text-base">Search games, players, avatar items and communities across Roblox. One search, endless possibilities.</p>
      <form className="search-glow glass mx-auto mt-9 flex max-w-2xl items-center gap-3 rounded-2xl p-2 pl-4 transition-all" onSubmit={e => {e.preventDefault();void search();}}>
        <Search className="shrink-0 text-violet-300" size={21}/><input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)} placeholder={"Search Roblox " + categoryLabels[category].toLowerCase() + "..."} className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-gray-500 sm:text-base"/>
        {query && <button type="button" aria-label="Clear search" onClick={() => {setQuery("");inputRef.current?.focus();}} className="text-gray-500"><X size={17}/></button>}
        <button type="submit" disabled={loading} className="flex items-center gap-2 rounded-xl bg-violet-500 px-4 py-3 text-sm font-bold text-white hover:bg-violet-400 disabled:opacity-60">{loading ? <LoaderCircle className="animate-spin" size={17}/> : <Search size={17}/>}<span className="hidden sm:inline">Search</span></button>
      </form>
      <div className="mx-auto mt-4 flex max-w-2xl flex-wrap justify-center gap-2">{categories.map(({id,icon:Icon}) => <button key={id} onClick={() => {setCategory(id);if (searched && query.trim().length>=2) void search(query,id);}} className={"pill flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition " + (category===id ? "pill-active" : "text-gray-400 hover:text-white")}><Icon size={15}/>{categoryLabels[id]}</button>)}</div>
      {!searched && !showFavorites && <div className="mt-7 flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-xs"><span className="mr-1 text-gray-500">Try searching</span>{popular.map(p => <button key={p} onClick={() => {setQuery(p);void search(p,"games");}} className="rounded-lg px-2 py-1 text-gray-400 hover:text-violet-300">{p}</button>)}</div>}
    </section>
    <section className="container pb-20">
      {showFavorites ? <div><div className="mb-6 flex items-center gap-3"><Heart className="text-violet-300"/><div><h2 className="text-xl font-bold">Your favorites</h2><p className="text-sm text-gray-500">Saved on this device</p></div></div><div className="glass rounded-2xl p-8 text-center"><Heart className="mx-auto mb-3 text-violet-300" size={30}/><p className="font-semibold">{favorites.length ? "Your saved items are ready to revisit" : "Nothing saved yet"}</p><p className="mt-2 text-sm text-gray-500">Search for games or players and tap the heart to save them.</p><button onClick={() => {setShowFavorites(false);setSearched(false);}} className="mt-5 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-bold text-white">Explore Roblox</button></div></div> :
      searched ? <div><div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><p className="mb-1 text-xs font-semibold uppercase tracking-[.18em] text-violet-300">{loading ? "Searching Roblox" : "Search results"}</p><h2 className="text-2xl font-bold">{categoryLabels[category]} <span className="text-gray-500">for “{query}”</span></h2></div>{!loading && !error && <span className="text-sm text-gray-500">{results.length} results</span>}</div>
      {error ? <div className="glass rounded-2xl p-6 text-sm text-rose-300">{error}</div> : loading ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[1,2,3,4,5,6].map(n => <div key={n} className="glass h-36 animate-pulse rounded-2xl"/>)}</div> : results.length===0 ? <div className="glass rounded-2xl p-10 text-center"><Search className="mx-auto mb-3 text-gray-500" size={28}/><p className="font-semibold">No results found</p><p className="mt-2 text-sm text-gray-500">Try another keyword or category.</p></div> :
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{results.map(item => {const key=category+":"+item.id;const saved=favorites.includes(key);return <article key={key} className="result-card glass flex min-h-[156px] gap-4 rounded-2xl p-4"><div className="flex h-[88px] w-[88px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-violet-500/10">{item.image ? <img src={item.image} alt="" loading="lazy" className="h-full w-full object-cover" onError={e=>{e.currentTarget.style.display="none";}}/> : <activeCategory.icon size={32} className="text-violet-300"/>}</div><div className="flex min-w-0 flex-1 flex-col"><div className="flex items-start gap-2"><h3 className="line-clamp-2 min-w-0 flex-1 text-sm font-bold leading-5">{item.name}</h3><button aria-label={saved?"Remove favorite":"Add favorite"} onClick={()=>toggleFavorite(item)} className={"shrink-0 rounded-lg p-1.5 "+(saved?"text-pink-400":"text-gray-500 hover:text-pink-400")}><Heart size={17} fill={saved?"currentColor":"none"}/></button></div><p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500">{item.subtitle||item.description||"Roblox result"}</p>{item.stats&&<p className="mt-1 text-[11px] font-semibold text-violet-300">{item.stats}</p>}<div className="mt-auto flex items-center justify-between gap-2 pt-3"><span className="text-[10px] text-gray-600">ID: {item.id}</span>{item.url&&<a href={item.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-violet-300">Open <ArrowUpRight size={14}/></a>}</div></div></article>;})}</div>}
      {!loading&&!error&&results.length>0&&<p className="mt-5 text-center text-xs text-gray-600">Results provided by Roblox public APIs. Availability may vary.</p>}</div> :
      <div className="grid gap-5 md:grid-cols-[1.2fr_.8fr]"><div className="glass rounded-3xl p-6 sm:p-8"><div className="mb-6 flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300"><Command size={22}/></div><h2 className="text-xl font-bold">Your search starts here.</h2><p className="mt-2 max-w-md text-sm leading-6 text-gray-400">From hidden gems to your next favorite creator, explore Roblox with a cleaner, faster search experience.</p><div className="mt-7 grid grid-cols-2 gap-3">{categories.slice(0,4).map(({id,icon:Icon,hint})=><button key={id} onClick={()=>{setCategory(id);inputRef.current?.focus();}} className="pill rounded-2xl p-4 text-left hover:border-violet-400/30"><Icon className="mb-3 text-violet-300" size={20}/><span className="block text-sm font-bold">{categoryLabels[id]}</span><span className="mt-1 block text-xs text-gray-500">{hint}</span></button>)}</div></div>
      <div className="glass rounded-3xl p-6 sm:p-8"><div className="mb-5 flex items-center justify-between"><div className="flex items-center gap-2"><History size={18} className="text-violet-300"/><h2 className="font-bold">Recent searches</h2></div>{recent.length>0&&<button onClick={()=>{setRecent([]);try{localStorage.removeItem("rf-recent");}catch{}}} className="text-xs text-gray-500">Clear</button>}</div>{recent.length?<div className="space-y-2">{recent.map((r,i)=><button key={r.q+r.category+i} onClick={()=>void search(r.q,r.category)} className="flex w-full items-center gap-3 rounded-xl p-3 text-left hover:bg-white/[.04]"><Search size={15} className="text-gray-500"/><span className="min-w-0 flex-1 truncate text-sm">{r.q}</span><span className="text-[10px] text-gray-500">{categoryLabels[r.category]}</span><ArrowUpRight size={14} className="text-gray-600"/></button>)}</div>:<div className="flex min-h-44 flex-col items-center justify-center text-center"><History className="mb-3 text-gray-600" size={26}/><p className="text-sm text-gray-400">Your searches will show up here.</p><p className="mt-1 text-xs text-gray-600">They stay on this device.</p></div>}<div className="mt-5 rounded-2xl border border-violet-400/10 bg-violet-400/[.05] p-4"><div className="flex items-center gap-2 text-sm font-bold"><Sparkles size={16} className="text-violet-300"/> Quick tip</div><p className="mt-2 text-xs leading-5 text-gray-400">Switch categories to search players, catalog items and communities.</p></div></div></div>}
    </section>
    <footer className="border-t border-white/[.07]"><div className="container flex flex-col items-center justify-between gap-3 py-6 text-xs text-gray-500 sm:flex-row"><a href="#" className="font-bold text-gray-300">roblox<span className="text-violet-400">finder</span></a><p>Unofficial fan-made discovery tool. Not affiliated with Roblox Corporation.</p><a href="https://github.com/Yakubov-Dev/Roblox-finder" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-violet-300">Built to explore <ExternalLink size={12}/></a></div></footer>
  </main>;
}