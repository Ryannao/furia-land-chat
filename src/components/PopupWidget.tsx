"use client";

import React, { useState } from "react";
import {
  Disclosure,
  Transition,
  DisclosurePanel,
  DisclosureButton,
} from "@headlessui/react";

type Message = {
  from: "user" | "bot";
  text: string;
};

const comandosDisponiveis = ["oi", "olá", "ajuda", "tchau"];

export function PopupWidget() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sugestoes, setSugestoes] = useState<string[]>([]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSugestoes([]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();

      if (!data.reply) {
        throw new Error("Invalid response format: 'reply' field is missing");
      }

      const botMsg: Message = { from: "bot", text: data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Error sending message:", err);

      const errMsg: Message = {
        from: "bot",
        text: "Erro no servidor. Tente novamente mais tarde.",
      };
      setMessages((prev) => [...prev, errMsg]);
    }
  };

  return (
    <div>
      <Disclosure>
        {({ open }) => (
          <>
            <DisclosureButton className="fixed z-40 flex items-center justify-center transition duration-300 bg-indigo-500 rounded-full shadow-lg right-5 bottom-5 w-14 h-14 focus:outline-none hover:bg-indigo-600 focus:bg-indigo-600 ease">
              <span className="sr-only">Open Chat Widget</span>
              <Transition
                show={!open}
                enter="transition duration-200 transform ease"
                enterFrom="opacity-0 -rotate-45 scale-75"
                leave="transition duration-100 transform ease"
                leaveTo="opacity-0 -rotate-45"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute w-6 h-6 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </Transition>

              <Transition
                show={open}
                enter="transition duration-200 transform ease"
                enterFrom="opacity-0 rotate-45 scale-75"
                leave="transition duration-100 transform ease"
                leaveTo="opacity-0 rotate-45"
                className="absolute w-6 h-6 text-white"
                as={"div"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </Transition>
            </DisclosureButton>

            <Transition
              className="fixed z-50 bottom-[100px] top-0 right-0 left-0 sm:top-auto sm:right-5 sm:left-auto"
              enter="transition duration-200 transform ease"
              enterFrom="opacity-0 translate-y-5"
              leave="transition duration-200 transform ease"
              leaveTo="opacity-0 translate-y-5"
              as="div"
            >
              <DisclosurePanel className="relative flex flex-col overflow-hidden left-0 h-full w-full sm:w-[350px] min-h-[250px] sm:h-[600px] border border-gray-300 dark:border-gray-800 bg-white shadow-2xl rounded-md sm:max-h-[calc(100vh-120px)]">
                <div className="flex flex-col items-center justify-center h-32 p-5 bg-indigo-600">
                  <h3 className="text-lg text-white">Chat with us</h3>
                  <p className="text-white opacity-50">
                    We are here to help you!
                  </p>
                </div>
                <div className="flex-grow h-full p-6 overflow-auto bg-gray-50 dark:bg-gray-800">
  <div className="flex flex-col space-y-3">
    {messages.map((message, index) => (
      <div
        key={index}
        className={`p-3 rounded-md max-w-xs ${
          message.from === "user"
            ? "bg-indigo-500 text-white self-end"
            : "bg-indigo-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 self-start"
        }`}
      >
        {message.text}
      </div>
    ))}
  </div>
</div>

<div className="p-4 border-t border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 relative">
  <div className="flex items-center space-x-2">
    <input
      type="text"
      value={input}
      onChange={(e) => {
        const valor = e.target.value;
        setInput(valor);

        if (valor.startsWith("/")) {
          const termo = valor.slice(1).toLowerCase();
          const filtrados = comandosDisponiveis.filter((cmd) =>
            cmd.startsWith(termo)
          );
          setSugestoes(filtrados);
        } else {
          setSugestoes([]);
        }
      }}
      placeholder="Type your message..."
      className="flex-grow px-3 py-2 text-gray-600 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-500 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring focus:border-indigo-600"
    />
    <button
      onClick={handleSendMessage}
      className="px-4 py-2 text-white bg-indigo-500 rounded-md focus:outline-none hover:bg-indigo-600"
    >
      Send
    </button>
  </div>

  {/* Sugestões */}
  {sugestoes.length > 0 && (
    <div className="absolute bottom-16 left-4 right-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-md z-50 max-h-40 overflow-y-auto">
      {sugestoes.map((sugestao, index) => (
        <div
          key={index}
          className="px-4 py-2 hover:bg-indigo-100 dark:hover:bg-gray-700 cursor-pointer"
          onClick={() => {
            setInput(sugestao);
            setSugestoes([]);
          }}
        >
          {sugestao}
        </div>
      ))}
    </div>
  )}
</div>
              </DisclosurePanel>
            </Transition>
          </>
        )}
      </Disclosure>
    </div>
  );
}
