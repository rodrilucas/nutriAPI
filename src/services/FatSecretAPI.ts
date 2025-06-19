import dotenv from "dotenv";
import AppError from "../error/AppError";
dotenv.config();

class FatSecretAPI {
  private accessToken: string | null = null;
  private tokenExpiresAt: number | null = null;

  private async getAccessToken() {
    const now = Date.now();

    if (this.accessToken && this.tokenExpiresAt && now < this.tokenExpiresAt) {
      return this.accessToken;
    }

    const clientId = process.env.FATSECRET_CLIENT_ID;
    const clientSecret = process.env.FATSECRET_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new AppError("Credenciais da API FatSecret não configuradas", 500);
    }

    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
      "base64"
    );

    const res = await fetch("https://oauth.fatsecret.com/connect/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        scope: "premier",
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Erro ao obter token:", error);
      throw new AppError("Não foi possível obter o token de acesso");
    }

    const data = await res.json();

    this.accessToken = data.access_token;
    const expiresIn = data.expires_in;
    this.tokenExpiresAt = now + expiresIn * 1000;

    if (!this.accessToken) {
      throw new AppError("Token de acesso não recebido.", 500);
    }

    return this.accessToken;
  }

  async searchFood(foodName: string, page: string) {
    try {
      const token = await this.getAccessToken();

      const response = await fetch(
        `https://platform.fatsecret.com/rest/foods/search/v1?search_expression=${encodeURIComponent(
          foodName
        )}&format=json&page_number=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new AppError("Erro ao buscar dados da FatSecret");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro FatSecret:", error);
      throw new AppError(
        error instanceof AppError ? error.message : "Erro interno do servidor",
        error instanceof AppError ? error.statusCode : 500
      );
    }
  }

  async searchFoodById(id: string) {
    try {
      const token = await this.getAccessToken();

      const response = await fetch(
        `https://platform.fatsecret.com/rest/food/v4?food_id=${id}&format=json`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new AppError("Erro ao buscar dados da FatSecret");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro FatSecret:", error);
      throw new AppError(
        error instanceof AppError ? error.message : "Erro interno do servidor",
        error instanceof AppError ? error.statusCode : 500
      );
    }
  }
}

export default FatSecretAPI;
