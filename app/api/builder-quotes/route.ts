import { equipment } from "@/data/equipment";
import { calculateRecommendedPackage } from "@/lib/calculations";
import { parseConfiguration } from "@/lib/config-validation";
import type { Prisma } from "@/lib/generated/prisma/client";
import {
  asNumber,
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

interface BasketLine {
  equipmentId: string;
  name: string;
  quantity: number;
  lineTotal: number;
}

function parseBasket(value: unknown): { lines?: BasketLine[]; errors?: Record<string, string> } {
  if (value === undefined || value === null) return { lines: [] };
  if (!Array.isArray(value)) return { errors: { basket: "Basket must be a list of lines." } };

  const errors: Record<string, string> = {};
  const lines: BasketLine[] = [];

  value.forEach((entry, index) => {
    const line = (entry ?? {}) as Record<string, unknown>;
    const item = equipment.find((e) => e.id === line.equipmentId);
    const quantity = asNumber(line.quantity);

    if (!item) {
      errors[`basket.${index}`] = "Unknown equipment line.";
      return;
    }
    if (!Number.isFinite(quantity) || quantity < 1 || quantity > 999) {
      errors[`basket.${index}`] = "Quantity must be between 1 and 999.";
      return;
    }
    lines.push({
      equipmentId: item.id,
      name: item.name,
      quantity: Math.round(quantity),
      lineTotal: item.dailyRate * Math.round(quantity),
    });
  });

  if (Object.keys(errors).length > 0) return { errors };
  return { lines };
}

export async function POST(request: Request): Promise<Response> {
  const body = await readJson(request);
  if (!body) return badRequest({ message: "Invalid JSON body." });

  const { config, errors: configErrors } = parseConfiguration(body.configuration);
  if (!config) return badRequest(configErrors ?? {});

  const { lines, errors: basketErrors } = parseBasket(body.basket);
  if (!lines) return badRequest(basketErrors ?? {});

  const recommendation = calculateRecommendedPackage(config);
  const basketTotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const estimateTotal = recommendation.estimatedTotal + basketTotal;

  const result = await write("api/builder-quotes", (db) =>
    createUniqueReference("SG-BQ", (reference) =>
      db.builderQuote.create({
        data: {
          reference,
          configuration: config as unknown as Prisma.InputJsonValue,
          recommendation: {
            pa: recommendation.pa,
            truss: recommendation.truss,
            stage: recommendation.stage,
            lighting: recommendation.lighting,
            av: recommendation.av,
            crewCount: recommendation.crewCount,
            setupHours: recommendation.setupHours,
            powerRequirementKva: recommendation.powerRequirementKva,
            estimatedTotal: recommendation.estimatedTotal,
          },
          basket: lines as unknown as Prisma.InputJsonValue,
          estimateTotal,
        },
      })
    )
  );

  if (result.status === "failed") return failure(500, result.error);

  if (result.status === "mocked") {
    console.log(
      `[api/builder-quotes] payload: ${JSON.stringify({ config, lines, estimateTotal }).slice(0, 2000)}`
    );
    return created({
      ok: true,
      id: mockId(),
      reference: makeReference("SG-BQ"),
      estimateTotal,
      mocked: true,
    });
  }

  return created({
    ok: true,
    id: result.value.id,
    reference: result.value.reference,
    estimateTotal,
  });
}
