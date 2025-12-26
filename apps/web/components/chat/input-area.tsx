import { Button } from "@repo/ui/components/button";
import { Plus } from "lucide-react";
import React from "react";

export default function InputArea() {
  return (
    <div className="rounded-md border p-3">
      <textarea
        style={{ minHeight: "100px" }}
        className="w-full resize-none border-0 outline-0 focus:border-0"
      ></textarea>
      <div className="flex items-center justify-between">
        <Button variant={"ghost"}>
          <Plus />{" "}
        </Button>
        <Button>Submit</Button>
      </div>
    </div>
  );
}
