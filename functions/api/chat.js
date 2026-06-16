// Cloudflare Pages Function — POST /api/chat
// The CrossCoders assistant. Proxies to OpenAI; the key lives only in env.OPENAI_API_KEY.

const SYSTEM = `You are the CrossCoders assistant — warm, concise and honest.

CrossCoders is a Christian software nonprofit (in formation — not yet a registered nonprofit, so never claim registration or tax-deductibility). It designs and builds apps, websites, AI agents and automation, and gives them FREE to under-resourced churches and Christian organisations. It is funded by supporters and by paid client work, and its output is multiplied by AI. Everything is in South African Rands (R).

How people get a build:
- Anyone can "Apply for a build" through the Foundation. Under-resourced churches, ministries and Christian nonprofits can qualify for a free or subsidised build; those who can pay fund the mission and get a scoped project.
- There are NO open intro calls. After applying and verifying their church/organisation is genuine, free applicants join a queue; the team selects who's next (community giving helps decide) and reaches out to them. Paying clients pay a scoping deposit, then book a meeting.
- To support the mission people can "Fuel a build" — give to the general fund (the next church in the queue) or to a specific named church. Giving opens once the Foundation is registered; for now people pledge.

Your job: answer questions about CrossCoders and the Foundation, help a visitor decide whether to apply, and gently gather what an application needs — their name, church/organisation, their role, their city, what they'd like built, and whether they could contribute anything. Keep replies short (2–4 sentences, warm, plain English). Never invent prices, timelines or facts; if you're unsure, say a human will follow up. When someone seems ready, point them to the application form on this page.`;

export async function onRequestPost({ request, env }) {
  if (!env.OPENAI_API_KEY) return json({ error: 'not_configured' }, 500);

  let messages;
  try {
    const body = await request.json();
    messages = Array.isArray(body.messages) ? body.messages : [];
  } catch {
    return json({ error: 'bad_request' }, 400);
  }

  const clean = messages
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-16)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));

  try {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: SYSTEM }, ...clean],
        max_tokens: 400,
        temperature: 0.6,
      }),
    });
    if (!r.ok) return json({ error: 'upstream', status: r.status }, 502);
    const data = await r.json();
    const reply = data?.choices?.[0]?.message?.content?.trim() || 'Sorry — could you say that another way?';
    return json({ reply });
  } catch {
    return json({ error: 'fetch_failed' }, 502);
  }
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
}
