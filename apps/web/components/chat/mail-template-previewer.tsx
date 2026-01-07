import { Resizable } from "re-resizable";
interface MailTemplatePreviewer {
  html: string | undefined;
  width: number;
  setWidth: React.Dispatch<React.SetStateAction<number>>;
}
export const MailTemplatePreviewer = ({
  html,
  width,
  setWidth,
}: MailTemplatePreviewer) => {
  console.log(width);
  if (!html) {
    return (
      <h1>
        We are building it yet and we forget to add the building animation here
        sorry:(
      </h1>
    );
  }
  return (
    <div className="bg-muted flex h-full flex-1 flex-col justify-center overflow-x-auto">
      <p className="pb-2 text-center">Size:{width}px </p>
      <div className="flex w-full flex-1 justify-center">
        <Resizable
          size={{ width: width, height: "100%" }}
          enable={{
            right: true,
          }}
          onResizeStop={(e, direction, ref, delta) => {
            setWidth((prev) => prev + delta.width);
          }}
        >
          <iframe srcDoc={html} className="h-full w-full border-2"></iframe>
        </Resizable>
      </div>
    </div>
  );
};
