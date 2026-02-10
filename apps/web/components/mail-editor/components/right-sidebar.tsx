import { Tabs, TabsList, TabsTrigger } from "@repo/ui/components/tabs";
import { Brush, Cog, LucideIcon } from "lucide-react";
import { useState } from "react";

type TabName = "colors" | "settings";

const tabs: readonly { name: TabName; icon: LucideIcon }[] = [
  { name: "colors", icon: Brush },
  { name: "settings", icon: Cog },
];

const RightSidebar = () => {
  const [selectedTab, setSelectedTab] = useState<TabName>("colors");
  return (
    <div className="block p-2">
      <Tabs
        value={selectedTab}
        onValueChange={(value) => setSelectedTab(value as TabName)}
      >
        <TabsList>
          {tabs.map(({ name, icon: Icon }) => (
            <TabsTrigger key={name} value={name}>
              <Icon />
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div>{selectedTab === "colors" ? "Colors" : "Settings"}</div>
    </div>
  );
};

export default RightSidebar;
