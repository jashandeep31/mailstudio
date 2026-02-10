import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";
import { Brush, Cog } from "lucide-react";
import { useState } from "react";

const tabs = ["colors", "settings"] as const;
const RightSidebar = () => {
  const [selectedTab, setSelectedTab] =
    useState<(typeof tabs)[number]>("colors");
  return (
    <div className="block p-2">
      <Tabs defaultValue="colors">
        <TabsList>
          <TabsTrigger value="colors">
            <Brush />
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Cog />
          </TabsTrigger>
        </TabsList>
        <TabsContent value="colors" className="block">
          <div>Make changes to your account here.</div>
        </TabsContent>
        <TabsContent value="settings">
          <div>Change your password here.</div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RightSidebar;
