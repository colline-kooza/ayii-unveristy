"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

const userAvatar =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop";
const aiAvatar =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop";

interface Message {
  id: number;
  type: "user" | "ai";
  text: string;
  button?: {
    text: string;
    icon?: boolean;
  };
}

const messageSequence: Message[] = [
  {
    id: 1,
    type: "ai",
    text: "Hi! Ready to boost your semester grades? 🎓",
  },
  {
    id: 2,
    type: "user",
    text: "Yes, how do I find past papers?",
  },
  {
    id: 3,
    type: "ai",
    text: "I can help with that! Found 15+ verified papers for you.",
    button: {
      text: "View Resources",
      icon: true,
    },
  },
];

const MessageBubble: React.FC<{ message: Message; isVisible: boolean }> = ({
  message,
  isVisible,
}) => {
  return (
    <div
      className={`transition-all duration-500 ${
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
    >
      {message.type === "ai" ? (
        <div className="flex justify-start items-end gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={aiAvatar}
              alt="AI Avatar"
              width={32}
              height={32}
              className="object-cover"
            />
          </div>
          <div className="bg-[#283593] text-white px-6 py-4 rounded-3xl rounded-tl-sm shadow-xl max-w-xs flex flex-col gap-3 border border-white/10">
            <div className="text-sm font-medium leading-snug">
              {message.text}
            </div>
            {message.button && (
              <button className="bg-[#d946ef] text-gray-300 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-white transition-all duration-300 flex items-center justify-center gap-2 w-full">
                {message.button.text}
                {message.button.icon && (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex justify-end items-end gap-3">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-3xl rounded-tr-sm shadow-xl max-w-xs">
            <div className="text-sm font-medium leading-snug">
              {message.text}
            </div>
          </div>
          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={userAvatar}
              alt="User Avatar"
              width={32}
              height={32}
              className="object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
};

const ChatUI: React.FC = () => {
  const [currentCycle, setCurrentCycle] = useState(0);

  useEffect(() => {
    const totalMessages = messageSequence.length;
    const interval = setInterval(() => {
      setCurrentCycle((prev) => {
        const next = (prev + 1) % totalMessages;
        return next;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const displayedMessages = messageSequence.slice(0, currentCycle + 1);

  return (
    <div className="relative z-10 w-full max-w-sm h-[500px] flex flex-col rounded-2xl p-6 overflow-hidden">
      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-4 justify-end scrollbar-hide">
        {displayedMessages.map((message) => (
          <div
            key={`${currentCycle}-${message.id}`}
            className="animate-fade-in"
          >
            <MessageBubble message={message} isVisible={true} />
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.4s ease-out;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default ChatUI;
