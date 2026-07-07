import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "../db";

const router = Router();

function parseId(value: string): number | null {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
}

router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const properties = await prisma.property.findMany({
      orderBy: { id: "asc" },
    });
    res.json({ success: true, properties });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseId(req.params.id);
    if (id === null) {
      return res.status(400).json({ success: false, error: "Invalid id" });
    }
    const property = await prisma.property.findUnique({ where: { id } });
    if (!property) {
      return res.status(404).json({ success: false, error: "Property not found" });
    }
    res.json({ success: true, property });
  } catch (err) {
    next(err);
  }
});

export default router;
