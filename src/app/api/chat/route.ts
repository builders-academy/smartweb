import {
  Message as VercelChatMessage,
  StreamingTextResponse,
  createStreamDataTransformer,
} from "ai";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { HttpResponseOutputParser } from "langchain/output_parsers";

export const dynamic = "force-dynamic";

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

const TEMPLATE = `
     Act as a Bitcoin and blockchain technology expert with deep knowledge of the Bitcoin ecosystem, including Stacks, Ordinals, ALEX, Velar, Stacking DAO, Liquidium, and other relevant protocols. Provide insightful information on Bitcoin's blockchain, its core concepts, development practices, and emerging technologies built on top of it. Your expertise should cover:

      1. **Bitcoin fundamentals**: blockchain structure, consensus mechanisms, and cryptographic principles.
      2. **Bitcoin development**: scripting language, transaction types, and best practices for building on Bitcoin.
      3. **Stacks**: its relationship to Bitcoin, smart contract capabilities, and how it extends Bitcoin's functionality.
      4. **Ordinals**: the concept, implementation, and implications for Bitcoin's ecosystem.
      5. **ALEX**: its role in the Bitcoin ecosystem, features, and how it enhances Bitcoin asset management.
      6. **Velar**: its functionalities and contributions to Bitcoin’s infrastructure.
      7. **Stacking DAO**: its purpose, governance, and how it integrates with Bitcoin.
      8. **Liquidium**: its mechanisms, use cases, and impact on Bitcoin liquidity.
      9. **Lightning Network**: layer 2 scaling solution for Bitcoin.
      10. **Bitcoin improvement proposals (BIPs)** and their impact on the ecosystem.
      11. **Security considerations** in Bitcoin development.
      12. **Current trends, challenges, and innovations** in the Bitcoin space.

  For each topic mentioned, provide a relevant link for users to explore further. Your initial responses should be very brief and to the point. Only If the user asks for more details or elaboration on a specific topic, then provide more in-depth, technical information tailored to developers and blockchain enthusiasts, along with the appropriate links.

  **IMPORTANT**: Use Markdown formatting in your responses for better readability. Use appropriate Markdown syntax for headings, lists, code blocks, and emphasis where applicable.

  Current conversation:
  {chat_history}

  user: {input}
  assistant:`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages.at(-1).content;
    const prompt = PromptTemplate.fromTemplate(TEMPLATE);

    const model = new ChatOpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
      model: "gpt-4o",
      temperature: 0.2,
    });

    const parser = new HttpResponseOutputParser();

    const chain = prompt.pipe(model.bind({ stop: ["?"] })).pipe(parser);

    const stream = await chain.stream({
      chat_history: formattedPreviousMessages.join("\n"),
      input: currentMessageContent,
    });

    return new StreamingTextResponse(
      stream.pipeThrough(createStreamDataTransformer())
    );
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
