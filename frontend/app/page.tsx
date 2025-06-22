"use client";
import Chat from "@/app/Chat";
import History from "@/app/History";
import React from "react";

export default function Home() {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="overflow-auto flex-1 bg-slate-200">
        <History />
      </div>
      <div className="w-[400px]">
        <Chat />
      </div>
    </div>
  );
}
