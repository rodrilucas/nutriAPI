import express from "express";
import cors from "cors";
import routes from "./routes/routes";
import { errorHandler } from "./middlewares/errorHandler";
import checkAccess from "./middlewares/checkApiKey";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.use(
  cors({
    origin: "https://nutri-sandy.vercel.app/", 
  })
);

app.use(checkAccess);

app.use("/api/v1/", routes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
