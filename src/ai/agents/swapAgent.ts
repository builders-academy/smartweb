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
): Promise<(input: string) => Promise<{ recommendations: string }>> {
  const llm = new ChatOpenAI({
    model: modelName,
    temperature: 0.3,
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    streaming: true,
  });

  const outputSchema = z.object({
    recommendations: z
      .string()
      .describe("Markdown-formatted string containing 5 swap recommendations"),
  });

  const parser = StructuredOutputParser.fromZodSchema(outputSchema);

  const promptTemplate = ChatPromptTemplate.fromTemplate(`
    You are a Swap Analysis Agent that provides personalized insights and recommendations for token swaps on the ALEX decentralized exchange. Your task is to analyze the user's provided wallet balance and the available swap options to suggest the most beneficial trades.

    Current user input (including wallet balance): {input}
    All available swaps on ALEX:
    {allSwaps}

    Based on the user's input (including their wallet balance) and available swap options, provide 5 swap recommendations in the following Markdown format:

    # Swap Recommendations

    ## 1. [Token From] to [Token To]

    - **Pair**: [Token From]/[Token To]
    - **Est. Returns**: [Amount From] ≈ [Amount To]
    - **Why**: [Brief reason for the swap]
    - **Action**: [Swap on ALEX](https://app.alexlab.co/swap)

    [Repeat the above structure for recommendations 2-5]

    > **Note**: ALEX offers benefits such as competitive rates, high liquidity, and a user-friendly interface. Always conduct your own research before making trading decisions.

    Ensure each recommendation is concise, informative, and tailored to the user's input. Consider factors such as potential returns, liquidity, slippage, and relevant market trends. If the user hasn't provided sufficient balance information, kindly ask for more details to provide more accurate recommendations.

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
