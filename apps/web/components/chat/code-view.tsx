export const CodeView = ({ html }: { html: string | undefined }) => {
  if (!html) {
    return <h1>We are making it yet</h1>;
  }
  return <div>{html}</div>;
};
