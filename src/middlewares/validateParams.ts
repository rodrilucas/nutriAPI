import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import AppError from "../error/AppError";

const validateParams =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      const message = result.error.errors.map((e) => e.message).join("; ");
      throw new AppError(message, 400);
    }
    next();
  };

export { validateParams };
