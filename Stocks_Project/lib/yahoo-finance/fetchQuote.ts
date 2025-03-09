import { unstable_noStore as noStore } from "next/cache";
import yahooFinance from "yahoo-finance2";

export async function fetchQuote(ticker: string) {
  noStore();

  try {
    const response = await yahooFinance.quote(ticker);
    return response;
  } catch (error) {
    console.error(`Failed to fetch stock quote for ${ticker}:`, error);
    return null; // Return null for any error, keeping it simple
  }
}