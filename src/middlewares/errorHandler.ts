import { Request, Response, NextFunction } from "express";
import AppError from "../error/AppError";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || "Erro interno do servidor";

  res.status(statusCode).json({
    status: "error",
    message,
  });
};

export { errorHandler };
