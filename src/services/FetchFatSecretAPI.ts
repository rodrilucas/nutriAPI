import dotenv from "dotenv";
import AppError from "../error/AppError";
dotenv.config();

class FetchFatSecretAPI {
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
}

export default FetchFatSecretAPI;
