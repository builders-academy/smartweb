import React from "react";

function formatMessage(content) {
  return content.split("\n").map((line, index) => {
    // Handle bold text
    line = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Handle numbered list items
    if (/^\d+\./.test(line)) {
      return <li key={index} dangerouslySetInnerHTML={{ __html: line }} />;
    }

    // Regular lines
    return <p key={index} dangerouslySetInnerHTML={{ __html: line }} />;
  });
}

function Message({ content }) {
  const formattedContent = formatMessage(content);

  return (
    <div className="text-sm">
      {formattedContent.map((element, index) => {
        if (element.type === "li") {
          // If we encounter a list item, wrap it and subsequent list items in an ol
          const listItems = [];
          while (
            index < formattedContent.length &&
            formattedContent[index].type === "li"
          ) {
            listItems.push(formattedContent[index]);
            index++;
          }
          return <ol key={`list-${index}`}>{listItems}</ol>;
        }
        return element;
      })}
    </div>
  );
}

export default Message;
