import axios from "axios";
import { config } from "@config/config";

// This is the base URL for the LGTB API. set in the .env file
const API_BASE_URL =
  process.env.NEXT_PUBLIC_LGTB_API_URL || "http://localhost:3333";

export const LgtbClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": `${config.api.lgtb_apiKey}`,
  },
});
