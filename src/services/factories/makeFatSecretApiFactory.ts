import FoodsController from "../../controllers/FoodsController";
import FatSecretAPI from "../FatSecretAPI";

export function makeFatSecretApiFactory() {
  const fatSecretApi = new FatSecretAPI();
  const foodsController = new FoodsController(fatSecretApi);
  return foodsController;
}
