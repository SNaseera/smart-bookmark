"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    fetchBookmarks();

    const channel = supabase
      .channel("realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookmarks" },
        () => fetchBookmarks()
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user]);

  async function fetchBookmarks() {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setBookmarks(data || []);
  }

  async function addBookmark() {
    if (!title || !url) return;

    await supabase.from("bookmarks").insert([
      {
        title,
        url,
        user_id: user.id,
      },
    ]);

    setTitle("");
    setUrl("");
  }

  async function deleteBookmark(id) {
    await supabase.from("bookmarks").delete().eq("id", id);
  }

  if (!user) {
    return (
      <div>
        <h1>Smart Bookmark</h1>
        <button
          onClick={() =>
            supabase.auth.signInWithOAuth({ provider: "google" })
          }
        >
          Login with Google
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>Smart Bookmark</h1>
      <button onClick={() => supabase.auth.signOut()}>
        Logout
      </button>

      <div style={{ marginTop: "20px" }}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ marginLeft: "10px" }}
        />
        <button onClick={addBookmark} style={{ marginLeft: "10px" }}>
          Add
        </button>
      </div>

      <div style={{ marginTop: "20px" }}>
        {bookmarks.map((b) => (
          <div key={b.id} style={{ marginBottom: "10px" }}>
            <a href={b.url} target="_blank">
              {b.title}
            </a>
            <button
              onClick={() => deleteBookmark(b.id)}
              style={{ marginLeft: "10px" }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
