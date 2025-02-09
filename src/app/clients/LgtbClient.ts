import axios from "axios";
import { config } from "@config/config";

const isDevelopment = process.env.NODE_ENV === "development";

const API_BASE_URL = isDevelopment
  ? "http://localhost:3333"
  : process.env.NEXT_PUBLIC_LGTB_API_URL;

export const LgtbClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": `${config.api.lgtb_apiKey}`,
  },
});
