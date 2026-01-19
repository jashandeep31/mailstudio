"use client";
import React, { useState } from "react";
import InputArea from "@/components/chat/input-area";
import { useWebSocketContext } from "@/contexts/web-socket-context";
import { MailTemplateCard } from "@/components/mail-template-card";

const ClientView = () => {
  const { sendEvent } = useWebSocketContext();
  const [userPrompt, setUserPrompt] = useState("");

  const handleSubmit = (data: { mediaIds: string[]; brandKitId?: string }) => {
    sendEvent("event:new-chat", {
      message: userPrompt,
      media: data.mediaIds,
      brandKitId: data.brandKitId,
    });
  };

  return (
    <div className="mb-12">
      <div className="mt-12 flex items-center justify-center lg:mt-36">
        <div className="min-w-[50%]">
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
          <MailTemplateCard />
          <MailTemplateCard />
          <MailTemplateCard />
          <MailTemplateCard />
        </div>
      </div>
    </div>
  );
};

export default ClientView;
