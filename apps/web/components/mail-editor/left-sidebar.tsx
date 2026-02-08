import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { EditableTag } from "./editor";
import React, { SetStateAction } from "react";

interface LeftSideBar {
  editableTags: EditableTag[];
  setEditableTags: React.Dispatch<SetStateAction<EditableTag[]>>;
}

const LeftSideBar = ({ editableTags, setEditableTags }: LeftSideBar) => {
  return (
    <div className="w-[20%] border-l p-2">
      {editableTags.map((tag) => (
        <div key={tag.name} className="mt-4 space-y-2">
          <Label className="text-muted-foreground">{tag.name}</Label>
          <Input
            value={tag.value}
            onChange={(e) => {
              setEditableTags((prev) =>
                prev.map((t) =>
                  t.name === tag.name ? { ...t, value: e.target.value } : t,
                ),
              );
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default LeftSideBar;
