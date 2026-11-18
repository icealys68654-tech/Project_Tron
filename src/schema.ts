import { z } from "zod";

/** BuildingSchema – every structure that enters the Grid must pass this */
export const BuildingSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: z.enum([
    "residential",
    "commercial",
    "industrial",
    "landmark",
    "iso",
    "portal",
    "club",
    "recognizer",
  ]),
  height: z.number().positive().max(500),
  position: z.object({
    x: z.number(),
    y: z.number(),
    z: z.number().optional().default(0),
  }),
  neonColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  isLandmark: z.boolean().optional().default(false),
});

export type Building = z.infer<typeof BuildingSchema>;

/** CitySchema – the complete validated payload */
export const CitySchema = z.object({
  name: z.string().min(1).default("Tron City"),
  version: z.string().default("1.0.0"),
  buildings: z.array(BuildingSchema).min(0),
  generatedAt: z.string().datetime().optional(),
});

export type City = z.infer<typeof CitySchema>;

/**
 * loadCity – the only approved entry point.
 * Anything that has not crossed this function does not exist inside the Grid.
 */
export function loadCity(raw: unknown): City {
  return CitySchema.parse(raw);
}

/** Convenience helper for partial updates / samples */
export function createSampleCity(): City {
  return loadCity({
    name: "Tron City",
    version: "1.0.0",
    generatedAt: new Date().toISOString(),
    buildings: [
      {
        id: "disc-core",
        name: "Disc Core",
        type: "landmark",
        height: 120,
        position: { x: 0, y: 0, z: 0 },
        neonColor: "#00f0ff",
        isLandmark: true,
      },
      {
        id: "end-of-line",
        name: "End of Line Club",
        type: "club",
        height: 45,
        position: { x: 80, y: -40 },
        neonColor: "#ff00aa",
      },
      {
        id: "portal-01",
        name: "The Portal",
        type: "portal",
        height: 90,
        position: { x: -60, y: 70 },
        neonColor: "#aaff00",
      },
      {
        id: "iso-cluster-1",
        name: "ISO Crystalline Form",
        type: "iso",
        height: 35,
        position: { x: 30, y: 50 },
        neonColor: "#ffffff",
      },
    ],
  });
}