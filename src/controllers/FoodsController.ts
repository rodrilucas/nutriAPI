import { Request, Response } from "express";
import FetchFatSecretAPI from "../services/FatSecretAPI";

class FoodsController {
  constructor(private fetchFatSecretAPI: FetchFatSecretAPI) {
    this.fetchFatSecretAPI = fetchFatSecretAPI;
  }

  getAll = async (req: Request, res: Response) => {
    const { foodName, page } = req.query;
    const data = await this.fetchFatSecretAPI.searchFood(
      foodName as string,
      page as string
    );
    res.json(data);
  };

  getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = await this.fetchFatSecretAPI.searchFoodById(id);
    res.json(data);
  };
}

export default FoodsController;
