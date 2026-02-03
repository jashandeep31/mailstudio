"use client";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import "./code-view.css";

export const CodeView = ({ html }: { html: string | undefined }) => {
  if (!html) {
    return <h1>We are making it yet</h1>;
  }

  const markdown = `\`\`\`html
${html}
\`\`\``;
  return (
    <div className="grid overflow-hidden">
      <div className="grid h-[100vh] overflow-auto bg-black pb-48">
        <Markdown rehypePlugins={[rehypeHighlight]}>{markdown}</Markdown>
      </div>
    </div>
  );
};
