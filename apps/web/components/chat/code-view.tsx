import Prism from "prismjs";
import "prismjs/themes/prism-solarizedlight.css";
import { useEffect } from "react";

export const CodeView = ({ html }: { html: string | undefined }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [html]);

  if (!html) {
    return <h1>We are making it yet</h1>;
  }

  return (
    <div className="grid overflow-hidden">
      <div className="Code">
        <pre className="m-0 h-full w-full overflow-auto">
          <code className={`language-html`}>{html}</code>
        </pre>
      </div>
    </div>
  );
};
