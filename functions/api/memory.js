export async function onRequestPost(context) {
  const { request, env } = context;
  const apiKey = env.BACKBOARD_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ ok: true, note: "Backboard not configured, skipping memory" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await request.json();
    const { sessionId, score, grade, footprint_kg, transport, diet, energy, shopping } = body;

    const threadId = `ecosense_${sessionId}`;
    const message = `Carbon footprint assessment on ${new Date().toISOString().split("T")[0]}:
- Score: ${score}/100 (Grade: ${grade})
- Annual CO2: ${footprint_kg} kg
- Transport: ${transport}
- Diet: ${diet}
- Energy: ${energy}
- Shopping: ${shopping}`;

    // Create or continue thread with Backboard
    const res = await fetch("https://api.backboard.io/v1/threads", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        thread_id: threadId,
        messages: [{ role: "user", content: message }],
      }),
    });

    if (!res.ok) {
      // Fallback: just return OK so the main app doesn't break
      return new Response(JSON.stringify({ ok: true, note: "Memory save attempted" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true, saved: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    // Never break the main flow
    return new Response(JSON.stringify({ ok: true, note: "Memory save failed gracefully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}
