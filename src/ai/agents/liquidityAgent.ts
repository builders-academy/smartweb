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
): Promise<(input: string) => Promise<{ recommendations: string }>> {
  const llm = new ChatOpenAI({
    model: modelName,
    temperature: 0.3,
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    streaming: true,
  });

  console.log("Initializing SmartWallet AI");

  const outputSchema = z.object({
    recommendations: z
      .string()
      .describe(
        "Markdown-formatted string containing 5 liquidity pool recommendations"
      ),
  });

  const parser = StructuredOutputParser.fromZodSchema(outputSchema);

  const promptTemplate = ChatPromptTemplate.fromTemplate(`
    You are a Liquidity Analysis Agent that provides personalized insights and recommendations for liquidity provision on the ALEX decentralized exchange. Your task is to analyze the user's input and the available liquidity options to suggest the most beneficial strategies for providing liquidity.

    Current user input (including any relevant balance or preference information): {input}
    All available liquidity options on ALEX:
    {allLiquidity}

    Based on the user's input and available liquidity options, provide 5 liquidity pool recommendations in the following Markdown format:

    # Liquidity Pool Recommendations

    ## 1. Pool Token [X] (Price: [Y])

    - **Est. Returns**: [Brief description of APY]
    - **Risk**: [Brief risk assessment]
    - **Market Fit**: [Suitable market conditions]
    - **Why**: [Short explanation]
    - **Action**: [Provide liquidity on ALEX](https://app.alexlab.co/pool)

    [Repeat the above structure for recommendations 2-5]

    > **Note**: Remember to diversify your liquidity provision and manage risks. Always conduct your own research before making investment decisions.

    Ensure each recommendation is concise, informative, and tailored to the user's input. If the user hasn't provided sufficient information, kindly ask for more details to provide more accurate recommendations.

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
