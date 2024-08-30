import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import axios from "axios";

async function fetchAllSwaps() {
  const loader = await axios.get("https://api.alexgo.io/v1/allswaps");
  const response = loader.data;
  return JSON.stringify(response);
}

export async function swapAgent(
  modelName: string = "gpt-4o"
): Promise<(input: string) => Promise<{ recommendations: string[] }>> {
  const llm = new ChatOpenAI({
    model: modelName,
    temperature: 0.3,
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    streaming: true,
  });

  const outputSchema = z.object({
    recommendations: z
      .array(z.string())
      .describe("List of 5 recommendation points for swapping in ALEX."),
  });

  const parser = StructuredOutputParser.fromZodSchema(outputSchema);

  const promptTemplate = ChatPromptTemplate.fromTemplate(`
    You are Swapping analysis agent that provides insights about swap options. You should analyze the swapping functionality on the ALEX decentralized exchange, focusing on the user experience and transaction settings. Detail the process of selecting base and quoted tokens, adjusting slippage tolerance, and understanding liquidity provider fees. Evaluate the importance of transaction confirmation steps, including the overview of the swap route and final confirmation through smart contracts. Provide insights on the expected transaction times due to the reliance on Stacks smart contracts and Bitcoin block speeds, and suggest best practices for users to optimize their swapping experience while minimizing risks associated with slippage and transaction fees.

    Current user input: {input}

    All available swaps in Alex:
    {allSwaps}

    Provide 5 concise recommendation points in markdown based on the user's input and the available swap options.

    {format_instructions}
  `);

  const formattedPrompt = await promptTemplate.partial({
    format_instructions: parser.getFormatInstructions(),
  });

  const chain = formattedPrompt.pipe(llm).pipe(parser);

  return async (input: string) => {
    const allSwaps = await fetchAllSwaps();

    const result = await chain.invoke({
      input,
      allSwaps: allSwaps,
    });

    return result;
  };
}
