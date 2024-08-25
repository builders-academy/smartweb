"use client";
import { FetchSwaps } from "@/helpers/fetchRest";
import { FetchValue } from "@/helpers/fetchRest";
import { FetchPairs } from "@/helpers/fetchRest";
import { FetchPoolWithId } from "@/helpers/fetchRest";
import { FetchTickers } from "@/helpers/fetchRest";
import { FetchHistoricalData } from "@/helpers/fetchRest";

const Page = () => {
  return (
    <div>
      <button onClick={FetchSwaps}>Fetch Swaps</button>
      <br />
      <button onClick={FetchValue}>Fetch Value</button>
      <br />
      <button onClick={FetchPairs}>Fetch Pairs</button>
      <br />
      <button onClick={FetchPoolWithId}>Fetch Pool With ID</button>
      <br />
      <button onClick={FetchTickers}>Fetch Tickers</button>
      <br />
      <button onClick={FetchHistoricalData}>Fetch Historical Data</button>
    </div>
  );
};

export default Page;
