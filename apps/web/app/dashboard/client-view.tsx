"use client";
import React, { useState } from "react";
import InputArea from "@/components/chat/input-area";
import { useWebSocketContext } from "@/contexts/web-socket-context";
import { MailTemplateCard } from "@/components/mail-template-card";
import { useMarketplaceTemplates } from "@/hooks/use-marketplace";

const ClientView = () => {
  const { sendEvent } = useWebSocketContext();
  const { data } = useMarketplaceTemplates({});
  const [userPrompt, setUserPrompt] = useState("");

  const handleSubmit = (data: { mediaIds: string[]; brandKitId?: string }) => {
    sendEvent("event:new-chat", {
      message: userPrompt,
      media: data.mediaIds,
      brandKitId: data.brandKitId,
    });
    setUserPrompt("");
  };

  return (
    <div className="mb-12">
      <div className="mt-12 flex items-center justify-center lg:mt-36">
        <div className="w-full min-w-[50%] px-3 md:w-auto">
          <div className="mb-6">
            <h1 className="text-center text-lg font-bold md:text-2xl lg:text-3xl">
              What do you want to create?
            </h1>
          </div>
          <InputArea
            userPrompt={userPrompt}
            setUserPrompt={setUserPrompt}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
      <div className="container mt-12 lg:mt-36">
        <h2 className="text-md font-bold md:text-lg lg:text-xl">
          Explore Templates
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {data?.map((template) => (
            <MailTemplateCard key={template.id} template={template} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientView;
