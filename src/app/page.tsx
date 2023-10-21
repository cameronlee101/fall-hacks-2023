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
  class inventoryItem {
    name: string;
    quantity: number;

    constructor(name: string, quantity: number) {
      this.name = name;
      this.quantity = quantity
    }
  }

  class playerStat {
    name: string;
    quantity: number;

    constructor(name: string, quantity: number) {
      this.name = name;
      this.quantity = quantity
    }
  }

  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: MessageRole; content: string }[]>([]);
  const [inventory, setInventory] = useState([new inventoryItem("Gold", 5)]); // Initial inventory array
  const [stats, setStats] = useState([new playerStat("Health", 5), new playerStat("Strength", 3)]); // Initial stats array

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
          <thead>
            <th className="border-2 border-black">Inventory</th>
          </thead>
          <tbody>
            {inventory.map((item, index) => (
              <tr key={index}>{item.quantity} {item.name}</tr>
            ))}
          </tbody>
        </table>

        <div className="w-3/5">
          <div>
            <div className="justify-center">
              <h2>Chat History:</h2>
              <ul>
                {chatHistory.map((message, index) => (
                  <li key={index} className={message.role}>
                    {message.content}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <input
                type="text"
                placeholder="Enter your text"
                value={userInput}
                onChange={handleUserInput}
              />
              <button onClick={fetchOpenAIResponse}>Submit</button>
            </div>
          </div>
        </div>

        <table className="w-1/5 text-center border-2 border-black m-8 h-1">
          <thead>
            <th className="border-2 border-black">Stats</th>
          </thead>
          <tbody>
            {stats.map((stat, index) => (
              <tr key={index}>{stat.name}: {stat.quantity}</tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
