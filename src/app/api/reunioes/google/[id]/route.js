// app/api/reunioes/google/[id]/route.js
import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/calendar"];
const KEY = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY); // JSON da service account
const calendarId = process.env.GOOGLE_CALENDAR_ID;

const auth = new google.auth.JWT(
  KEY.client_email,
  null,
  KEY.private_key,
  SCOPES
);

const calendar = google.calendar({ version: "v3", auth });

export async function POST(req, { params }) {
  try {
    const { eventId, data, hora, clienteNome } = await req.json();

    const [year, month, day] = data.split("-");
    const [hours, minutes] = hora.split(":");

    const startDate = new Date(year, month - 1, day, hours, minutes);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // +1 hora

    const event = {
      summary: `Reunião com ${clienteNome}`,
      start: { dateTime: startDate.toISOString() },
      end: { dateTime: endDate.toISOString() },
    };

    let updatedEvent;
    if (eventId) {
      updatedEvent = await calendar.events.update({
        calendarId,
        eventId,
        requestBody: event,
      });
    } else {
      updatedEvent = await calendar.events.insert({
        calendarId,
        requestBody: event,
      });
    }

    return Response.json({ success: true, eventId: updatedEvent.data.id }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
