// app/api/reunioes/google/route.js
import { google } from "googleapis";

export async function POST(req) {
  try {
    const { summary, description, start, end, attendees } = await req.json();

    if (!summary || !start || !end) {
      return new Response(
        JSON.stringify({ error: "Campos obrigatórios não fornecidos" }),
        { status: 400 }
      );
    }

    const key = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: key.client_email,
        private_key: key.private_key.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/calendar"],
    });

    const calendar = google.calendar({ version: "v3", auth });

    const event = {
      summary,
      description,
      start, // já vem { dateTime, timeZone }
      end,   // já vem { dateTime, timeZone }
      attendees: attendees || [],
    };

    const response = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      requestBody: event,
    });

    return new Response(JSON.stringify({ success: true, event: response.data }), {
      status: 200,
    });
  } catch (err) {
    console.error("Erro ao criar evento no Google Calendar:", err);
    return new Response(
      JSON.stringify({ error: "Erro ao criar evento no Google Calendar", details: err.message }),
      { status: 500 }
    );
  }
}
