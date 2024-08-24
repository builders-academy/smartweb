"use client";
import { FetchSwaps } from "@/helpers/fetch";
export default function page() {
  return <button onClick={FetchSwaps}>fetch</button>;
}
