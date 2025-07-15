import { RequestHandler } from "express";

const checkAccess: RequestHandler = (req, res, next) => {
  const allowedOrigins = ["https://nutri-sandy.vercel.app/"];

  const origin = req.get("origin") || "";
  const referer = req.get("referer") || "";
  const apiKey = req.headers["x-api-key"];

  const isBrowserRequest = allowedOrigins.some(
    (domain) => origin.startsWith(domain) || referer.startsWith(domain)
  );

  const isKeyValid = apiKey === process.env.API_KEY;

  if (isBrowserRequest || isKeyValid) {
    return next();
  }

  res.status(401).json({ message: "Acesso não autorizado." });
};

export default checkAccess;
