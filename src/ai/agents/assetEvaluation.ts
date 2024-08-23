import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { createOpenAIFunctionsAgent, AgentExecutor } from "langchain/agents";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";

export const tavilyTool = new TavilySearchResults({
  apiKey: process.env.TAVILY_API_KEY,
});

export async function getAgentExecutor() {
  const model = new ChatOpenAI({
    apiKey: process.env.OPEANAI_API_KEY,
    streaming: true,
    temperature: 0.3,
  });

  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `You are a DeFi Investment Agent tasked with evaluating assets and providing investment strategies.
      Your responsibilities include:
      1. Analyzing the user's asset portfolio
      2. Recommending platforms for asset utilization
      3. Providing investment strategies for DeFi services
      4. Assessing risks and opportunities
      5. Educating the user on recommended platforms and strategies

      Provide detailed recommendations based on the user's assets and preferences.
      If the user provides feedback or asks for clarification, respond with revised or more detailed information.`,
    ],
    ["human", "{input}"],
    new MessagesPlaceholder("agent_scratchpad"),
  ]);

  const tools = [tavilyTool];

  const agent = await createOpenAIFunctionsAgent({
    llm: model,
    prompt,
    tools,
  });

  return new AgentExecutor({
    agent,
    tools,
  });
}
