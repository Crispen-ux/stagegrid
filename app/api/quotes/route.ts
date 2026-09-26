import {
  EMAIL_PATTERN,
  asNumber,
  asOptionalString,
  asString,
  badRequest,
  created,
  createUniqueReference,
  failure,
  makeReference,
  mockId,
  readJson,
  write,
} from "@/lib/server";

export const runtime = "nodejs";

const EVENT_TYPES = ["corporate", "activation", "conference", "festival"];

interface Body {
  reference: string;
  eventType: string;
  guestCount: number;
  eventDate: Date | null;
  venue: string | null;
  name: string;
  email: string;
  notes: string | null;
}

function parseDate(value: unknown): Date | null {
  const text = asString(value);
  if (!text) return null;
  const parsed = new Date(`${text}T00:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function validate(body: Record<string, unknown>): { errors?: Record<string, string>; value?: Omit<Body, "reference"> } {
  const errors: Record<string, string> = {};
  const eventType = asString(body.eventType);
  const guestCount = asNumber(body.guestCount);
  const name = asString(body.name);
  const email = asString(body.email);

  if (!EVENT_TYPES.includes(eventType)) errors.eventType = "Please choose an event type.";
  if (!Number.isFinite(guestCount) || guestCount <= 0) {
    errors.guestCount = "Please enter an expected guest count.";
  } else if (guestCount > 1_000_000) {
    errors.guestCount = "That guest count looks incorrect.";
  }
  if (!name) errors.name = "Please enter your name.";
  if (!EMAIL_PATTERN.test(email)) errors.email = "Please enter a valid email address.";

  if (Object.keys(errors).length > 0) return { errors };

  return {
    value: {
      eventType,
      guestCount: Math.round(guestCount),
      eventDate: parseDate(body.eventDate),
      venue: asOptionalString(body.venue, 200),
      name,
      email,
      notes: asOptionalString(body.notes, 5000),
    },
  };
}

export async function POST(request: Request): Promise<Response> {
  const body = await readJson(request);
  if (!body) return badRequest({ message: "Invalid JSON body." });

  const { errors, value } = validate(body);
  if (errors || !value) return badRequest(errors ?? {});

  const result = await write("api/quotes", (db) =>
    createUniqueReference("SG-Q", (reference) =>
      db.quoteRequest.create({ data: { ...value, reference } })
    )
  );

  if (result.status === "failed") return failure(500, result.error);

  if (result.status === "mocked") {
    return created({ ok: true, id: mockId(), reference: makeReference("SG-Q"), mocked: true });
  }

  return created({ ok: true, id: result.value.id, reference: result.value.reference });
}
