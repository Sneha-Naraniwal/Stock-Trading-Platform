import { fetchChartData } from "@/lib/yahoo-finance/fetchChartData";
import { Interval, Range } from "@/types/yahoo-finance";
import AreaClosedChart from "./AreaClosedChart";
import { fetchQuote } from "@/lib/yahoo-finance/fetchQuote";

export default async function MarketsChart({
  ticker,
  range,
  interval,
}: {
  ticker: string;
  range: Range;
  interval: Interval;
}) {
  const chartData = await fetchChartData(ticker, range, interval);
  const quoteData = await fetchQuote(ticker);

  const [chart, quote] = await Promise.all([chartData, quoteData]);

  // If quote is null, return a fallback UI
  if (!quote) {
    return (
      <div className="flex h-full items-center justify-center text-center text-neutral-500">
        Unable to fetch quote data for {ticker}
      </div>
    );
  }

  // Handle case where chart is null or has no quotes
  const stockQuotes = chart && chart.quotes
    ? chart.quotes
        .map((quote) => ({
          date: quote.date,
          close: quote.close?.toFixed(2),
        }))
        .filter((quote) => quote.close !== undefined && quote.date !== null)
    : [];

  return (
    <>
      <div className="mb-0.5 font-medium">
        {quote.shortName} ({quote.symbol}){" "}
        {quote.regularMarketPrice?.toLocaleString(undefined, {
          style: "currency",
          currency: quote.currency,
        })}
      </div>
      {stockQuotes.length > 0 ? (
        <AreaClosedChart chartQuotes={stockQuotes} range={range} />
      ) : (
        <div className="flex h-full items-center justify-center text-center text-neutral-500">
          No data available
        </div>
      )}
    </>
  );
}