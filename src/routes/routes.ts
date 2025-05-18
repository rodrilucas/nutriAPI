import { Router } from "express";
import { catchAsync } from "../middlewares/catchAsync";
import { validateQuery } from "../middlewares/validateQuery";
import { validateParams } from "../middlewares/validateParams";
import { params, queries } from "../schemas/zod";
import FoodsController from "../controllers/FoodsController";

const routes = Router();
const foodsController = new FoodsController();

routes.get(
  "food/search",
  validateQuery(queries),
  catchAsync(foodsController.getAll)
);

routes.get(
  "food/search/:id",
  validateParams(params),
  catchAsync(foodsController.getById)
);

export default routes;
