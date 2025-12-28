import { Button } from "@repo/ui/components/button";
import { Plus } from "lucide-react";
import React from "react";

interface InputArea {
  userPrompt: string;
  setUserPrompt: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: () => void;
}

export default function InputArea({
  userPrompt,
  setUserPrompt,
  handleSubmit,
}: InputArea) {
  return (
    <div className="rounded-md border p-3">
      <textarea
        value={userPrompt}
        onChange={(e) => {
          setUserPrompt(e.target.value);
        }}
        style={{ minHeight: "100px" }}
        className="w-full resize-none border-0 outline-0 focus:border-0"
        placeholder="Create the mail template"
      ></textarea>
      <div className="flex items-center justify-between">
        <Button variant={"ghost"}>
          <Plus />{" "}
        </Button>
        <Button disabled={!userPrompt} onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
}
