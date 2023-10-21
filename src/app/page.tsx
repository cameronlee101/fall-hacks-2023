"use client";
import React, { useState, useEffect } from "react";
import OpenAI from "openai";

export enum MessageRole {
  USER = "user",
  ASSISTANT = "assistant",
  SYSTEM = "system",
  FUNCTION = "function",
}

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: MessageRole; content: string }[]>([]);

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  // Function to handle user input
  const handleUserInput = (event: any) => {
    setUserInput(event.target.value);
  };

  // Function to fetch OpenAI response
  const fetchOpenAIResponse = async () => {
    try {
      let inputMessage = {
        role: MessageRole.USER,
        content: userInput,
      };
      setChatHistory((prevHistory) => [...prevHistory, inputMessage]);
      setUserInput("");

      // Fetch OpenAI response
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          ...chatHistory, // Include the previous chat history
          {
            role: "user",
            content: userInput,
          },
        ],
        temperature: 0.8,
        max_tokens: 256,
      });

      let responseMessage = response.choices[0].message.content;
      if (responseMessage != null) {
        const systemMessage = {
          role: MessageRole.SYSTEM,
          content: responseMessage,
        };
        // Add OpenAI's response to the chat history
        setChatHistory((prevHistory) => [...prevHistory, systemMessage]);
      }
    } catch (error) {
      console.error("Error fetching OpenAI response:", error);
    }
  };


  return (
    <main className="h-screen">
      <div className="font-mono mb-28">
        <h1 className="m-4 object-contain text-3xl flex justify-center">Fall Hacks 2023 Text-based Adventure Game</h1>
      </div>
      <div className="font-mono flex flex-row">
        <table className="w-1/5 text-center border-2 border-black m-8 h-1">
          <thead><th className="border-2 border-black">Inventory</th></thead>
          <tbody>
            <tr>item</tr>
            <tr>item</tr>
            <tr>item</tr>
            <tr>item</tr>
            <tr>item</tr>
            <tr>item</tr>
            <tr>item</tr>
            <tr>item</tr>
          </tbody>
        </table>
        <div className="w-3/5">

          <div className="justify-center">
            <h2>Chat History:</h2>

            <ul>
              {chatHistory.map((message, index) => (
                <li
                  key={index}
                  className={`chat-message ${message.role === 'system' ? 'system-message' : 'user-message'}`}
                >
                  {message.content}
                </li>
              ))}
            </ul>


            <div>
              <input
                type="text"
                id="userInput"
                placeholder="Enter your text"
                value={userInput}
                onChange={handleUserInput}
              />
              <button onClick={fetchOpenAIResponse}>Submit</button>
            </div>
          </div>

        </div>
        <table className="w-1/5 text-center border-2 border-black m-8 h-1">
          <thead><th className="border-2 border-black">Stats</th></thead>
          <tbody>
            <tr>stat</tr>
            <tr>stat</tr>
            <tr>stat</tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}
