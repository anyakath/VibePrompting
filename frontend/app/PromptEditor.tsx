"use client";

import { FileText } from "lucide-react";

const PromptEditor = () => {
  const promptContent = `{
  "name": "Booking Agent",
  "description": "An agent that can book flights and hotels.",
  "system_prompt": "You are an expert travel agent. Your goal is to help the user book a flight and hotel for their trip. Be friendly and efficient.",
  "steps": [
    {
      "name": "get_flight_details",
      "prompt": "First, I need to get the flight details from the user. What is your departure city, destination city, and desired travel date?"
    },
    {
      "name": "get_hotel_details",
      "prompt": "Great. Now, what are your check-in and check-out dates for the hotel?"
    },
    {
      "name": "confirm_details",
      "prompt": "Please confirm if the following details are correct. Once you confirm, I will proceed with the booking."
    },
    {
      "name": "make_booking",
      "prompt": "I am now making the booking. Please wait a moment."
    },
    {
      "name": "booking_complete",
      "prompt": "Your booking is complete! You will receive a confirmation email shortly."
    },
    {
      "name": "another_step",
      "prompt": "This is another step to make the content longer."
    },
    {
      "name": "yet_another_step",
      "prompt": "This is yet another step to ensure the content overflows."
    },
    {
      "name": "one_more_step",
      "prompt": "Just one more step to be sure."
    },
    {
      "name": "final_step_for_scrolling",
      "prompt": "This should definitely be enough to cause a scrollbar."
    }
  ]
}`;

  return (
    <div className="p-6 bg-background/30">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold text-foreground">agent.json</h2>
        <div className="flex-1" />
        <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
          JSON
        </div>
      </div>
      <div className="rounded-lg border border-border/50 bg-card/50 p-6 overflow-x-auto">
        <pre className="text-sm leading-relaxed whitespace-pre">
          <code className="text-muted-foreground font-mono">{promptContent}</code>
        </pre>
      </div>
    </div>
  );
};

export default PromptEditor;
