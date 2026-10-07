const MAX_AUDIO_BYTES = 50 * 1024 * 1024;
const AUDIO_TYPES = new Set(["audio/mpeg","audio/wav","audio/x-wav","audio/mp4","audio/x-m4a","audio/aac","audio/flac","audio/x-flac"]);
const AUDIO_EXTENSIONS = new Set(["mp3","wav","m4a","aac","flac"]);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname !== "/api/submissions") {
      return env.ASSETS.fetch(request);
    }

    if (request.method !== "POST") {
      return json({ error: "Method not allowed." }, 405);
    }

    /* Keep the public site deployable before private submission storage is provisioned. */
    if (!env.DB || !env.MUSIC) {
      return json({
        error: "Direct uploads are temporarily unavailable. Please email coolschoolproduction@gmail.com."
      }, 503);
    }

    let form;
    try { form = await request.formData(); }
    catch { return json({ error: "Invalid submission." }, 400); }

    const clean = (value,max) => String(value ?? "").trim().slice(0,max);
    const name = clean(form.get("name"),100);
    const contact = clean(form.get("contact"),160);
    const artist = clean(form.get("artist"),120);
    const note = clean(form.get("note"),1000);
    const file = form.get("music_file");

    if (!name || !contact || !(file instanceof File) || !file.size) {
      return json({ error: "Name, contact and an audio file are required." }, 400);
    }
    if (file.size > MAX_AUDIO_BYTES) {
      return json({ error: "Audio file must be 50 MB or smaller." }, 413);
    }

    const extension = (file.name.split(".").pop() || "").toLowerCase();
    if (!AUDIO_TYPES.has(file.type) && !AUDIO_EXTENSIONS.has(extension)) {
      return json({ error: "Upload an MP3, WAV, M4A, AAC or FLAC file." }, 415);
    }

    const safeName = (file.name || "track").replace(/[^a-zA-Z0-9._-]+/g,"-").slice(-120);
    const key = `submissions/${new Date().toISOString().slice(0,10)}/${crypto.randomUUID()}-${safeName}`;

    try {
      await env.MUSIC.put(key,file.stream(),{
        httpMetadata:{contentType:file.type || "application/octet-stream"},
        customMetadata:{originalName:file.name}
      });
      await env.DB.prepare(
        "INSERT INTO submissions (name, contact, artist, music_key, music_filename, music_type, music_size, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
      ).bind(name,contact,artist||null,key,file.name,file.type||null,file.size,note||null).run();
      return json({ok:true},201);
    } catch {
      await env.MUSIC.delete(key).catch(()=>{});
      return json({error:"Could not save the submission. Please try again."},500);
    }
  }
};

function json(data,status=200){
  return new Response(JSON.stringify(data),{
    status,
    headers:{
      "content-type":"application/json; charset=utf-8",
      "cache-control":"no-store",
      "x-content-type-options":"nosniff"
    }
  });
}
