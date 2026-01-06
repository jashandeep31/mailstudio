export const MailTemplatePreviewer = ({
  html,
}: {
  html: string | undefined;
}) => {
  if (!html) {
    return (
      <h1>
        We are building it yet and we forget to add the building animation here
        sorry:(
      </h1>
    );
  }
  return (
    <div className="bg-muted flex h-full flex-1 justify-center p-4">
      <iframe srcDoc={html} className="h-full w-[400px] border"></iframe>
    </div>
  );
};
