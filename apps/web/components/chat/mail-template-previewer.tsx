import { Resizable } from "re-resizable";

interface MailTemplatePreviewer {
  html: string | undefined;
  width: number;
  setWidth: React.Dispatch<React.SetStateAction<number>>;
  isStreaming?: boolean;
  streamingMessage?: string;
}
export const MailTemplatePreviewer = ({
  html,
  width,
  setWidth,
  isStreaming = false,
  streamingMessage,
}: MailTemplatePreviewer) => {
  if (isStreaming) {
    return (
      <div className="bg-muted/40 flex h-full flex-1 flex-col items-center justify-center">
        <div className="bg-background w-full max-w-3xl rounded-lg border shadow-sm">
          <div className="flex items-center justify-between border-b px-4 py-2">
            <span className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
              Live build
            </span>
            <span className="flex items-center gap-2 text-xs font-medium text-emerald-600">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              Rendering
            </span>
          </div>
          <div className="flex h-64 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="text-muted-foreground text-sm">
              We&apos;re building your template...
            </div>
            <div className="flex w-40 flex-col gap-2">
              <div className="bg-muted h-2 rounded-full" />
              <div className="bg-muted/70 h-2 rounded-full" />
              <div className="bg-muted/50 h-2 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!html) {
    return (
      <div className="bg-muted/30 flex h-full flex-1 flex-col items-center justify-center rounded-xl border border-dashed text-center">
        <p className="text-lg font-semibold">No version selected yet</p>
        <p className="text-muted-foreground max-w-sm text-sm">
          Pick a version or wait for the builder to finish streaming to preview
          the template.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-muted flex h-full flex-1 flex-col justify-center overflow-x-auto rounded-xl border">
      <p className="text-muted-foreground pb-2 text-center text-sm">
        Canvas width: {width}px
      </p>
      <div className="flex w-full flex-1 justify-center">
        <Resizable
          size={{ width: width, height: "100%" }}
          enable={{
            right: true,
          }}
          onResizeStop={(e, _direction, _ref, delta) => {
            setWidth((prev) => prev + delta.width);
          }}
        >
          <iframe
            srcDoc={html}
            className="h-full w-full rounded-lg border bg-white shadow-lg"
          ></iframe>
        </Resizable>
      </div>
    </div>
  );
};
