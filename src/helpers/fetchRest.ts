"use client";
export async function FetchSwaps() {
  const response = await fetch("https://api.alexgo.io/v1/allswaps", {
    method: "GET",
  });
  const data = await response.json();
  console.log(data);
  return data;
}
export async function FetchValue() {
  const response = await fetch("https://api.alexgo.io/v1/price/stx", {
    method: "GET",
  });
  const data = await response.json();
  console.log("Value", data);
  return data;
}
export async function FetchPoolWithId() {
  const response = await fetch("https://api.alexgo.io/v1/pool_stats/13", {
    method: "GET",
  });
  const data = await response.json();
  console.log("poolID", data);
  return data;
}
export async function FetchTickers() {
  const response = await fetch("https://api.alexgo.io/v1/tickers", {
    method: "GET",
  });
  const data = await response.json();
  console.log("pool", data);
  return data;
}
export async function FetchPairs() {
  const response = await fetch("https://api.alexgo.io/v1/pairs", {
    method: "GET",
  });
  const data = await response.json();
  console.log("Pairs", data);
  return data;
}
export async function FetchHistoricalData() {
  const response = await fetch("https://api.alexgo.io/v1/historical_swaps/13", {
    method: "GET",
  });
  const data = await response.json();
  console.log("pool", data);
  return data;
}
