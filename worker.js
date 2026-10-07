export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/submissions") {
      if (request.method !== "POST") {
        return json({ error: "Method not allowed." }, 405);
      }

      if (!env.DB) return json({ error: "Submissions database is not configured yet." }, 503);

      let body;
      try { body = await request.json(); }
      catch { return json({ error: "Invalid submission." }, 400); }

      const clean = value => String(value ?? "").trim();
      const name = clean(body.name).slice(0, 100);
      const contact = clean(body.contact).slice(0, 160);
      const artist = clean(body.artist).slice(0, 120);
      const musicUrl = clean(body.music_url).slice(0, 500);
      const note = clean(body.note).slice(0, 1000);

      if (!name || !contact || !musicUrl) {
        return json({ error: "Name, contact and music link are required." }, 400);
      }

      try {
        const parsed = new URL(musicUrl);
        if (!["http:", "https:"].includes(parsed.protocol)) throw new Error();
      } catch {
        return json({ error: "Please enter a valid music link." }, 400);
      }

      await env.DB.prepare(
        "INSERT INTO submissions (name, contact, artist, music_url, note) VALUES (?, ?, ?, ?, ?)"
      ).bind(name, contact, artist || null, musicUrl, note || null).run();

      return json({ ok: true }, 201);
    }

    return env.ASSETS.fetch(request);
  }
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff"
    }
  });
}
