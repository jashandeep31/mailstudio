"use client";
import InputArea from "@/components/chat/input-area";
import { useWebSocketContext } from "@/contexts/web-socket-context";
import React, { useState } from "react";

export default function ClientView() {
  const { sendEvent } = useWebSocketContext();

  const [userPrompt, setUserPrompt] = useState("");
  const handleSumbmit = () => {
    sendEvent("event:new-chat", {
      message: userPrompt,
      media: [],
    });
  };
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="min-w-[50%]">
        <InputArea
          userPrompt={userPrompt}
          setUserPrompt={setUserPrompt}
          handleSubmit={handleSumbmit}
        />
      </div>
    </div>
  );
}
