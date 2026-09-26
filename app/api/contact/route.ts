import {
  EMAIL_PATTERN,
  asOptionalString,
  asString,
  badRequest,
  created,
  failure,
  mockId,
  readJson,
  write,
} from "@/lib/server";

export const runtime = "nodejs";

interface Body {
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  message: string;
}

function validate(body: Record<string, unknown>): { errors?: Record<string, string>; value?: Body } {
  const errors: Record<string, string> = {};
  const name = asString(body.name);
  const email = asString(body.email);
  const message = asString(body.message);

  if (!name) errors.name = "Please enter your name.";
  else if (name.length > 120) errors.name = "Please keep your name under 120 characters.";
  if (!EMAIL_PATTERN.test(email)) errors.email = "Please enter a valid email address.";
  if (!message) errors.message = "Please add a short message.";
  else if (message.length > 5000) errors.message = "Please keep your message under 5000 characters.";

  if (Object.keys(errors).length > 0) return { errors };

  return {
    value: {
      name,
      company: asOptionalString(body.company, 120),
      email,
      phone: asOptionalString(body.phone, 40),
      message,
    },
  };
}

export async function POST(request: Request): Promise<Response> {
  const body = await readJson(request);
  if (!body) return badRequest({ message: "Invalid JSON body." });

  const { errors, value } = validate(body);
  if (errors || !value) return badRequest(errors ?? {});

  const result = await write("api/contact", (db) =>
    db.contactMessage.create({
      data: {
        name: value.name,
        company: value.company,
        email: value.email,
        phone: value.phone,
        message: value.message,
      },
    })
  );

  if (result.status === "failed") return failure(500, result.error);

  return created({
    ok: true,
    id: result.status === "saved" ? result.value.id : mockId(),
    mocked: result.status === "mocked",
  });
}
