import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import axios from "axios";

async function fetchLiquidity() {
  const loader = await axios.get("https://api.alexgo.io/v1/pool_token_stats");
  const response = loader.data;
  return JSON.stringify(response);
}

export async function liquidityAgent(
  modelName: string = "gpt-4o"
): Promise<(input: string) => Promise<{ recommendations: string[] }>> {
  const llm = new ChatOpenAI({
    model: modelName,
    temperature: 0.3,
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    streaming: true,
  });

  console.log("Initializing SmartWallet AI");

  const outputSchema = z.object({
    recommendations: z
      .array(z.string())
      .describe("List of 5 recommendation points for liquidity in ALEX."),
  });

  const parser = StructuredOutputParser.fromZodSchema(outputSchema);

  const promptTemplate = ChatPromptTemplate.fromTemplate(`
    You are Liquidity analysis agent that provides insights about liquidity options.Analyze the liquidity pools available on the ALEX decentralized exchange, focusing on key metrics such as trading volume, fee structures, and token pair volatility. Evaluate the potential earnings from transaction fees for liquidity providers and assess the risks, including impermanent loss and smart contract vulnerabilities. Compare the performance of various liquidity pools, particularly the STX/ALEX pool and any newly listed pools, against industry benchmarks. Provide insights on which pools may offer the best return on investment for liquidity providers and suggest strategies for maximizing earnings while minimizing risks in the current market conditions.

    Current user input: {input}

    All available liquidity options in Alex:
    {allLiquidity}

    Provide 5 concise recommendation points in markdown based on the user's input and the available liquidity options.


    {format_instructions}
  `);

  const formattedPrompt = await promptTemplate.partial({
    format_instructions: parser.getFormatInstructions(),
  });

  const chain = formattedPrompt.pipe(llm).pipe(parser);

  return async (input: string) => {
    const allLiquidity = await fetchLiquidity();

    const result = await chain.invoke({
      input,
      allLiquidity: allLiquidity,
    });

    return result;
  };
}
