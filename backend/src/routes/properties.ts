import { Router, Request, Response, NextFunction } from "express";
import crypto from "node:crypto";
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

router.post(
  "/verify/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseId(req.params.id);
      if (id === null) {
        return res.status(400).json({ success: false, error: "Invalid id" });
      }
      const property = await prisma.property.findUnique({ where: { id } });
      if (!property) {
        return res
          .status(404)
          .json({ success: false, error: "Property not found" });
      }

      const digest = crypto
        .createHash("sha256")
        .update(property.address, "utf8")
        .digest("hex");
      const propertyHash = `0x${digest}`;

      return res.json({
        success: true,
        propertyHash,
        propertyId: property.id,
        address: property.address,
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
