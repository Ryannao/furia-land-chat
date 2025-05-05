"use client";

import React, { useState } from "react";
import Linkify from "react-linkify";
import {
  Disclosure,
  Transition,
  DisclosurePanel,
  DisclosureButton,
} from "@headlessui/react";

const comandosDisponiveis = ["Quem é o capitão do time?", "Contra quem a FURIA jogou no último campeonato?", "Quem tem a mira mais afiada do time?"];

type Message = {
  from: "user" | "bot";
  text: string;
};

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      if (!data.reply) throw new Error("Invalid response: missing 'reply'");

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
            <DisclosureButton className="fixed z-40 flex items-center justify-center w-14 h-14 transition duration-300 bg-blue-900 rounded-full shadow-lg right-5 bottom-5 hover:bg-blue-800 focus:outline-none">
              <span className="sr-only">Abrir chat</span>
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
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
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
                as="div"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
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
              <DisclosurePanel className="relative flex flex-col overflow-hidden left-0 h-full w-full sm:w-[350px] min-h-[250px] sm:h-[600px] border border-blue-800 bg-blue-950 shadow-2xl rounded-md sm:max-h-[calc(100vh-120px)]">
                <div className="flex flex-col items-center justify-center h-32 p-5 bg-blue-900">
                  <h3 className="text-lg text-white">Chat Furioso</h3>
                  <p className="text-white opacity-75">Manda a call aí, torcedor!</p>
                </div>

                <div className="flex-grow h-full p-6 overflow-auto bg-blue-950">
                  <div className="flex flex-col space-y-3">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-md max-w-xs whitespace-pre-wrap break-words ${
                          message.from === "user"
                            ? "bg-blue-900 text-white self-end"
                            : "bg-blue-800 text-white self-start"
                        }`}
                      >
                        <Linkify
                          componentDecorator={(
                            href: string,
                            text: React.ReactNode,
                            key: number
                          ) => (
                            <a
                              href={href}
                              key={key}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline hover:text-blue-300"
                            >
                              {text}
                            </a>
                          )}
                        >
                          {message.text}
                        </Linkify>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 border-t border-blue-800 bg-blue-950 relative">
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
                      placeholder="Digite sua mensagem..."
                      className="flex-grow px-3 py-2 text-white placeholder-blue-400 bg-blue-900 border border-blue-800 rounded-md focus:outline-none focus:ring focus:ring-blue-700"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="px-4 py-2 text-white bg-blue-700 rounded-md hover:bg-blue-600 focus:outline-none"
                    >
                      Enviar
                    </button>
                  </div>

                  {sugestoes.length > 0 && (
                    <div className="absolute bottom-16 left-4 right-4 bg-blue-900 border border-blue-800 rounded-md shadow-md z-50 max-h-40 overflow-y-auto">
                      {sugestoes.map((sugestao, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 hover:bg-blue-800 cursor-pointer text-white"
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
