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

export async function getAgentExecutor(
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
      .describe("List of 5 recommendation points"),
  });

  const parser = StructuredOutputParser.fromZodSchema(outputSchema);

  const promptTemplate = ChatPromptTemplate.fromTemplate(`
    You are SmartWallet AI, an intelligent assistant that provides insights about swap options. You should make informed decisions by analyzing the potential benefits, fees, and risks associated with each swap option.

    Current user input: {input}

    All available swaps in Alex:
    {allSwaps}

    Provide 5 concise recommendation points based on the user's input and the available swap options.

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
