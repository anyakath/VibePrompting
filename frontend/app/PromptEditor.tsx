"use client";

import { ScrollArea } from "@/components/ui/scroll-area";

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
    <div className="p-4 border-t border-gray-200 h-full flex flex-col">
      <h2 className="text-sm font-semibold mb-2">prompt.py</h2>
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full rounded-md border bg-gray-50">
          <pre className="p-4 text-sm">
            <code>{promptContent}</code>
          </pre>
        </ScrollArea>
      </div>
    </div>
  );
};

export default PromptEditor; 