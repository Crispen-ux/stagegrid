import { parseConfiguration } from "@/lib/config-validation";
import type { Prisma } from "@/lib/generated/prisma/client";
import {
  asOptionalString,
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

export async function POST(request: Request): Promise<Response> {
  const body = await readJson(request);
  if (!body) return badRequest({ message: "Invalid JSON body." });

  const { config, errors } = parseConfiguration(body.configuration);
  if (!config) return badRequest(errors ?? {});

  const label = asOptionalString(body.label, 120);

  const result = await write("api/builder-configs", (db) =>
    createUniqueReference("SG-C", (reference) =>
      db.builderConfig.create({
        data: { reference, label, configuration: config as unknown as Prisma.InputJsonValue },
      })
    )
  );

  if (result.status === "failed") return failure(500, result.error);

  if (result.status === "mocked") {
    return created({ ok: true, id: mockId(), reference: makeReference("SG-C"), mocked: true });
  }

  return created({ ok: true, id: result.value.id, reference: result.value.reference });
}
