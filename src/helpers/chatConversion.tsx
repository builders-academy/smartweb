import ReactMarkdown from "react-markdown";

const Message = ({ content }: { content: string }) => {
  return <ReactMarkdown className="prose prose-sm">{content}</ReactMarkdown>;
};

export default Message;
