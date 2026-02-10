import { Tabs, TabsList, TabsTrigger } from "@repo/ui/components/tabs";
import { Brush, Cog, Layers2, LucideIcon } from "lucide-react";
import { useState } from "react";

type TabName = "colors" | "settings" | "layers";

const tabs: readonly { name: TabName; icon: LucideIcon }[] = [
  { name: "colors", icon: Brush },
  { name: "settings", icon: Cog },
  { name: "layers", icon: Layers2 },
];

const RightSidebar = () => {
  const [selectedTab, setSelectedTab] = useState<TabName>("colors");
  return (
    <div className="block p-1">
      <Tabs
        value={selectedTab}
        onValueChange={(value) => setSelectedTab(value as TabName)}
      >
        <TabsList className="w-full rounded-none">
          {tabs.map(({ name, icon: Icon }) => (
            <TabsTrigger key={name} value={name}>
              <Icon />
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="mt-3">
        {selectedTab && "colors" && (
          <div className="bg-muted p-2"> colors </div>
        )}
      </div>
    </div>
  );
};

export default RightSidebar;
