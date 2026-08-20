// Función "meta-inbound" · Oasis del Alma · Hub Intelligence
// Webhook de ENTRADA de Messenger e Instagram (Meta Graph API): recibe los DMs
// de los clientes, se los pasa a la función "agente" y responde por el mismo canal.
//
// Secretos del servidor (Edge Functions → meta-inbound → Secrets):
//   META_PAGE_TOKEN    Page Access Token de la página de Facebook (Messenger)
//   META_IG_TOKEN      Token de Instagram (caso de uso "Instagram" → 2. Generar tokens
//                      → Generar token junto a la cuenta). Si no existe, se usa
//                      META_PAGE_TOKEN también para IG (vía página de Facebook).
//   META_VERIFY_TOKEN  cadena inventada (ej. 'oda-meta-2026'); se usa al registrar el webhook
//   SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY (automáticos)
//
// Registro en Meta (developers.facebook.com → tu app → Webhooks):
//   - Producto "Messenger" → Settings → Webhooks:
//       Callback URL:  https://xsolfiytdekybynboofa.supabase.co/functions/v1/meta-inbound
//       Verify token:  el valor de META_VERIFY_TOKEN
//       Suscribirse a: messages (objeto "page")
//   - Producto "Instagram" → API setup with Facebook login → Webhooks:
//       misma Callback URL y verify token; suscribirse a: messages (objeto "instagram")
//   - Suscribir la PÁGINA a la app (Messenger → Settings → Access Tokens → Add page).
//
// Despliegue: supabase functions deploy meta-inbound --no-verify-jwt

// El webhook de Meta no necesita CORS, pero el Hub sí: el botón «Actualizar nombres de IG»
// llama esta función desde el navegador y sin estas cabeceras el preflight falla.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

const GRAPH = "https://graph.facebook.com/v21.0";
const IGRAPH = "https://graph.instagram.com/v21.0";

// Nombre real del cliente. Meta lo entrega por dos caminos distintos y cualquiera de los
// dos puede fallar según el token/permiso que tenga la app, así que se intentan LOS DOS
// antes de caer al número. (Ese fallback numérico es el que dejaba filas «Instagram · 794476».)
async function nombreDeDetalle(senderId: string, canal: string): Promise<{ nombre: string; error: string }> {
  const igToken = (Deno.env.get("META_IG_TOKEN") || "").trim();
  const pageToken = (Deno.env.get("META_PAGE_TOKEN") || "").trim();
  const intentos: { base: string; tok: string }[] = [];
  if (canal === "instagram") {
    if (igToken) intentos.push({ base: IGRAPH, tok: igToken });
    if (pageToken) intentos.push({ base: GRAPH, tok: pageToken });
    if (igToken) intentos.push({ base: GRAPH, tok: igToken });
  } else {
    if (pageToken) intentos.push({ base: GRAPH, tok: pageToken });
    if (igToken) intentos.push({ base: IGRAPH, tok: igToken });
  }
  let ultimo = "";
  if (!intentos.length) return { nombre: "", error: "No hay META_IG_TOKEN ni META_PAGE_TOKEN configurados" };
  for (const it of intentos) {
    const host = it.base.includes("graph.instagram") ? "graph.instagram" : "graph.facebook";
    try {
      const r = await fetch(`${it.base}/${senderId}?fields=name,username&access_token=${encodeURIComponent(it.tok)}`);
      const p = await r.json().catch(() => ({}));
      const n = p?.name || (p?.username ? "@" + p.username : "");
      if (n) return { nombre: String(n), error: "" };
      const err = p?.error || {};
      ultimo = host + ": " + (err.message || JSON.stringify(p).slice(0, 160)) + (err.code ? " (code " + err.code + (err.error_subcode ? "/" + err.error_subcode : "") + ")" : "");
      console.log("meta-inbound: perfil sin nombre", senderId, ultimo);
    } catch (e) {
      ultimo = host + ": " + String(e).slice(0, 160);
      console.log("meta-inbound: falló el perfil", senderId, ultimo);
    }
  }
  return { nombre: "", error: ultimo };
}
async function nombreDe(senderId: string, canal: string) {
  return (await nombreDeDetalle(senderId, canal)).nombre;
}
// ¿Este nombre es el marcador numérico y no un nombre real?
const esFallback = (s: string) => /^(instagram|messenger)\s*·\s*\d+$/i.test(String(s || "").trim());

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const url = new URL(req.url);

  // --- verificación del webhook (GET de Meta al registrarlo) ---
  if (req.method === "GET") {
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge") || "";
    if (mode === "subscribe" && token === (Deno.env.get("META_VERIFY_TOKEN") || "")) {
      return new Response(challenge, { status: 200 });
    }
    return new Response("forbidden", { status: 403 });
  }

  if (req.method !== "POST") return new Response("ok", { status: 200 });

  try {
    const body = await req.json().catch(() => ({}));
    // object: "page" = Messenger · "instagram" = DMs de Instagram
    const objeto = String(body?.object || "");
    const canal = objeto === "instagram" ? "instagram" : "messenger";
    const igToken = Deno.env.get("META_IG_TOKEN") || "";
    // IG con token propio usa graph.instagram.com; Messenger (y IG vía página) usa graph.facebook.com
    const token = canal === "instagram" && igToken ? igToken : Deno.env.get("META_PAGE_TOKEN")!;
    const base = canal === "instagram" && igToken ? IGRAPH : GRAPH;

    // --- MANTENIMIENTO: { "mode": "nombres" } ---
    // Recorre las conversaciones de IG/Messenger que quedaron con el marcador numérico y
    // vuelve a pedirle el perfil a Meta. Se llama a mano cuando se arregla un token.
    if (String(body?.mode || "") === "nombres") {
      const supaUrl = Deno.env.get("SUPABASE_URL")!;
      const srk = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const hh = { "content-type": "application/json", apikey: srk, authorization: `Bearer ${srk}` };
      const arreglados: unknown[] = [];
      const sinNombre: unknown[] = [];
      try {
        const r = await fetch(`${supaUrl}/rest/v1/conversaciones?select=id,canal,cliente&canal=in.(instagram,messenger)&limit=500`, { headers: hh });
        const filas = await r.json().catch(() => []);
        for (const c of (Array.isArray(filas) ? filas : [])) {
          if (!esFallback(c.cliente) && c.cliente !== c.id) continue;
          const sid = String(c.id || "").replace(/^(ig|ms)_/, "");
          if (!sid) continue;
          const d = await nombreDeDetalle(sid, c.canal === "instagram" ? "instagram" : "messenger");
          const n = d.nombre;
          if (!n) { sinNombre.push({ id: c.id, sid, error: d.error }); continue; }
          await fetch(`${supaUrl}/rest/v1/conversaciones?id=eq.${encodeURIComponent(c.id)}`, {
            method: "PATCH", headers: { ...hh, Prefer: "return=minimal" }, body: JSON.stringify({ cliente: n }),
          });
          arreglados.push({ id: c.id, nombre: n });
        }
      } catch (e) {
        return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, "content-type": "application/json" } });
      }
      console.log("meta-inbound nombres:", arreglados.length, "arreglados ·", sinNombre.length, "sin nombre");
      return new Response(JSON.stringify({ ok: true, arreglados, sinNombre }), { headers: { ...corsHeaders, "content-type": "application/json" } });
    }

    for (const entry of body?.entry || []) {
      for (const ev of entry?.messaging || []) {
        const msg = ev?.message;
        const senderId = String(ev?.sender?.id || "");
        // ignorar ecos (mensajes enviados por la página/bot), acks y eventos sin mensaje
        if (!msg || msg.is_echo || !senderId) continue;

        let texto = String(msg.text || "");
        let imagenB64 = "", imagenMime = "image/jpeg";
        // imagen adjunta: descargarla y pasársela al agente para que la analice
        const att = (msg.attachments || []).find((a: any) => a?.type === "image" && a?.payload?.url);
        if (att) {
          try {
            const r = await fetch(att.payload.url);
            const bin = await r.arrayBuffer();
            let s = ""; const bytes = new Uint8Array(bin);
            for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
            imagenB64 = btoa(s);
            imagenMime = r.headers.get("content-type")?.split(";")[0] || "image/jpeg";
          } catch (_e) {}
        }
        if (!texto && !imagenB64) continue;

        // nombre del cliente (dos caminos de Graph; si los dos fallan, el número)
        let nombre = await nombreDe(senderId, canal);
        const nombreReal = !!nombre;
        if (!nombre) nombre = (canal === "instagram" ? "Instagram · " : "Messenger · ") + senderId.slice(-6);

        // --- pasar al agente ---
        const supaUrl = Deno.env.get("SUPABASE_URL")!;
        const srk = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const pref = canal === "instagram" ? "ig" : "ms";
        const agRes = await fetch(`${supaUrl}/functions/v1/agente`, {
          method: "POST",
          headers: { "content-type": "application/json", authorization: `Bearer ${srk}` },
          body: JSON.stringify({ conversacionId: `${pref}_${senderId}`, canal, cliente: nombre, texto, imagenB64, imagenMime }),
        });
        const ag = await agRes.json().catch(() => ({}));

        // Reparación: las conversaciones creadas cuando el perfil no se pudo leer quedaron con
        // «Instagram · 794476». Si en este mensaje sí obtuvimos el nombre, se corrige.
        if (nombreReal) {
          try {
            const cid = `${pref}_${senderId}`;
            const rc = await fetch(`${supaUrl}/rest/v1/conversaciones?id=eq.${encodeURIComponent(cid)}&select=cliente`, {
              headers: { apikey: srk, authorization: `Bearer ${srk}` },
            });
            const cur = await rc.json().catch(() => []);
            const actual = Array.isArray(cur) && cur[0] ? String(cur[0].cliente || "") : "";
            if (!actual || esFallback(actual) || actual === cid) {
              await fetch(`${supaUrl}/rest/v1/conversaciones?id=eq.${encodeURIComponent(cid)}`, {
                method: "PATCH",
                headers: { "content-type": "application/json", apikey: srk, authorization: `Bearer ${srk}`, Prefer: "return=minimal" },
                body: JSON.stringify({ cliente: nombre }),
              });
              console.log("meta-inbound: nombre corregido", cid, "->", nombre);
            }
          } catch (e) { console.error("meta-inbound: no se pudo corregir el nombre", String(e)); }
        }

        // --- responder por el mismo canal (Send API; ventana de 24h) ---
        const send = (message: unknown) => fetch(`${base}/me/messages?access_token=${encodeURIComponent(token)}`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ recipient: { id: senderId }, messaging_type: "RESPONSE", message }),
        });
        const parts = (ag && Array.isArray(ag.parts) && ag.parts.length) ? ag.parts
          : [...(ag && ag.reply ? [{ type: "text", value: ag.reply }] : []), ...((((ag && ag.images) || []) as string[]).map((u) => ({ type: "image", value: u })))];
        // El envío se VERIFICA: si Meta lo rechaza (típico con solicitudes ocultas de Instagram
        // que la cuenta aún no acepta), el Hub ya guardó la respuesta del bot pero el cliente
        // NUNCA la vio. Antes esto se ignoraba y el equipo creía que el bot sí respondió.
        let falloEnvio = "";
        for (const p of parts) {
          let r: Response | null = null;
          if (p.type === "image") r = await send({ attachment: { type: "image", payload: { url: p.value, is_reusable: false } } });
          else if (p.value) r = await send({ text: p.value });
          if (!r) continue;
          const j = await r.json().catch(() => ({}));
          if (!r.ok || (j as any)?.error) {
            falloEnvio = String((j as any)?.error?.message || `HTTP ${r.status}`);
            console.error("meta-inbound: Meta rechazó el envío", canal, senderId, falloEnvio);
          }
        }
        if (falloEnvio) {
          try {
            const cid = `${pref}_${senderId}`;
            const hdrs = { "content-type": "application/json", apikey: srk, authorization: `Bearer ${srk}`, Prefer: "return=minimal" };
            await fetch(`${supaUrl}/rest/v1/mensajes`, {
              method: "POST", headers: hdrs,
              body: JSON.stringify({ conversacion_id: cid, de: "sistema", texto: "⚠️ Instagram NO entregó la respuesta del bot (el cliente no la vio). Motivo de Meta: " + falloEnvio + ". Suele pasar cuando el mensaje entró como solicitud oculta: acéptala en Instagram (Solicitudes de mensajes → Aceptar) y vuelve a responderle.", meta: { noEntregado: true, error: falloEnvio } }),
            });
            await fetch(`${supaUrl}/rest/v1/conversaciones?id=eq.${encodeURIComponent(cid)}`, {
              method: "PATCH", headers: hdrs,
              body: JSON.stringify({ estado: "necesita", ultimo_at: new Date().toISOString() }),
            });
          } catch (e) { console.error("meta-inbound: no se pudo registrar el aviso de no-entrega", String(e)); }
        }
      }
    }
    return new Response("ok", { status: 200 });
  } catch (_e) {
    // Meta reintenta si no respondes 200; nunca fallar el webhook
    return new Response("ok", { status: 200 });
  }
});
