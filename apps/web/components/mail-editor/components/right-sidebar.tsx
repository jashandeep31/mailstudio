import { Tabs, TabsList, TabsTrigger } from "@repo/ui/components/tabs";
import { Brush, Cog, Layers2, LucideIcon } from "lucide-react";
import { useState } from "react";

type TabName = "selector" | "settings" | "layers";

const tabs: readonly { name: TabName; icon: LucideIcon }[] = [
  { name: "selector", icon: Brush },
  { name: "settings", icon: Cog },
  { name: "layers", icon: Layers2 },
];

const RightSidebar = () => {
  const [selectedTab, setSelectedTab] = useState<TabName>("selector");
  return (
    <div className="block p-1">
      <Tabs
        value={selectedTab}
        onValueChange={(value) => setSelectedTab(value as TabName)}
      >
        <TabsList className="w-full rounded-none">
          {tabs.map(({ name, icon: Icon }) => (
            <TabsTrigger key={name} value={name}>
              <Icon className={selectedTab === name ? "text-foreground" : ""} />
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="mt-3">
        {selectedTab && "selector" && (
          <div className="bg-muted p-2"> selector </div>
        )}
      </div>
    </div>
  );
};

export default RightSidebar;
