"use client";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import "./code-view.css";

export const CodeView = ({
  code,
  type,
}: {
  code: string | undefined;
  type: "html" | "mjml";
}) => {
  if (!code) {
    return <h1>We are making it yet</h1>;
  }

  const markdown = `\`\`\`${type === "mjml" ? "xml" : "html"}
${code}
\`\`\``;
  return (
    <div className="grid h-full min-h-0 overflow-hidden">
      <div className="grid min-h-0 flex-1 overflow-auto bg-black pb-12">
        <Markdown rehypePlugins={[rehypeHighlight]}>{markdown}</Markdown>
      </div>
    </div>
  );
};
