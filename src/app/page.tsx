"use client";
import React, { useState, useEffect } from "react";
import OpenAI from "openai";
import {dragonPrompts} from './prompts';

export enum MessageRole {
  USER = "user",
  ASSISTANT = "assistant",
  SYSTEM = "system",
  FUNCTION = "function",
}

export default function Home() {
  class InventoryItem {
    name: string;
    quantity: number;

    constructor(name: string, quantity: number) {
      this.name = name;
      this.quantity = quantity
    }
  }

  class PlayerStat {
    name: string;
    quantity: number;

    constructor(name: string, quantity: number) {
      this.name = name;
      this.quantity = quantity
    }
  }

  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: MessageRole; content: string }[]>([]);
  const [inventory, setInventory] = useState([new InventoryItem("Gold", 5)]); // Initial inventory array
  const [stats, setStats] = useState([new PlayerStat("Health", 5), new PlayerStat("Strength", 3)]); // Initial stats array

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  // Functions related to finding and removing inventory and player stats
  function findInventoryItem(name: string): InventoryItem | undefined {
    return inventory.find((item) => item.name === name);
  }
  function findPlayerStat(name: string): InventoryItem | undefined {
    return stats.find((item) => item.name === name);
  }
  function removeInventoryItem(name: string): void {
    const indexToRemove = inventory.findIndex((item) => item.name === name);
    if (indexToRemove !== -1) {
      inventory.splice(indexToRemove, 1);
    }
  }

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

  // Function for Scenario 1
  const dragonScenario = (selection: number) => {
    setUserInput(dragonPrompts[selection])
    fetchOpenAIResponse()
  };

  return (
    <main className="flex flex-col h-screen">
      <div className="font-mono mb-12">
        <h1 className="m-2 object-contain text-2xl flex justify-center">Fall Hacks 2023 Text-based Adventure Game</h1>
      </div>

      <div className="font-mono flex flex-row flex-1">
        <table className="w-1/5 text-center border-2 border-black m-8 h-1">
          <thead>
            <tr className="border-2 border-black">Inventory</tr>
          </thead>
          <tbody>
            {inventory.map((item, index) => (
              <tr key={index}>{item.quantity} {item.name}</tr>
            ))}
          </tbody>
        </table>

        <div className="w-3/5 flex flex-col">
          <div className="justify-center">
            <h2>Chat History:</h2>
            <div className="chat-history-container overflow-auto h-96">
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
            </div>
          </div>

          <div className="flex items-center justify-center font-mono mb-10">
            <input
              type="text"
              id="userInput"
              placeholder="Enter your text"
              value={userInput}
              onChange={handleUserInput}
            />
            <button onClick={fetchOpenAIResponse}>Submit</button>

            <div>
              {/* Game start text */}
              <p>You are a bored office worker looking to turn over a new leaf. One day, thinking aloud, you say 
                “I wish I could start a new adventure.” Suddenly, your wish comes true, and you are transported to a new world.</p>
              <p>Your adventure begins in a village under attack by a dragon...</p>
              
              <div style={{ display: "flex", justifyContent: "space-between", maxWidth: "600px", margin: "0 auto" }}>
                <button onClick={() => dragonScenario(0)} style={{ backgroundColor: "blue", margin: "20px" }}>Pick up a nearby sword and slay the dragon.</button>
                <button onClick={() => dragonScenario(1)} style={{ backgroundColor: "blue", margin: "20px" }}>Attempt to sooth the dragon by offering all your gold.</button>
                <button onClick={() => dragonScenario(2)} style={{ backgroundColor: "blue", margin: "20px" }}>Flee the scene.</button>
              </div>   
            </div>
          </div>
        </div>

        <table className="w-1/5 text-center border-2 border-black m-8 h-1">
          <thead>
            <tr className="border-2 border-black">Stats</tr>
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
