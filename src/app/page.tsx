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
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: MessageRole; content: string }[]>([]);
  const [inventory, setInventory] = useState(["item1", "item2", "item3"]); // Initial inventory array
  const [stats, setStats] = useState(["stat1", "stat2", "stat3"]); // Initial stats array

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

  // Function for Scenario 1
  const dragonScenario = (selection: number) => {
    setUserInput(dragonPrompts[selection])

    console.log(userInput)

    fetchOpenAIResponse()
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
              <tr key={index}>{item}</tr>
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

            <div>
              {/* Game start text */}
              <p>You are a bored office worker looking to turn over a new leaf. One day, thinking aloud, you say 
                “I wish I could start a new adventure.” Suddenly, your wish comes true, and you are transported to a new world.</p>
              <p>Your adventure begins in a village under attack by a dragon...</p>
              
              <div style={{ display: "flex", justifyContent: "space-between", maxWidth: "600px", margin: "0 auto" }}>
                <button onClick={() => dragonScenario(0)} style={{ backgroundColor: "white", margin: "20px" }}>Pick up a nearby sword and slay the dragon.</button>
                <button onClick={() => dragonScenario(1)} style={{ backgroundColor: "white", margin: "20px" }}>Attempt to sooth the dragon by offering all your gold.</button>
                <button onClick={() => dragonScenario(2)} style={{ backgroundColor: "white", margin: "20px" }}>Flee the scene.</button>
              </div>   
            </div>
          </div>
        </div>

        <table className="w-1/5 text-center border-2 border-black m-8 h-1">
          <thead>
            <th className="border-2 border-black">Stats</th>
          </thead>
          <tbody>
            {stats.map((stat, index) => (
              <tr key={index}>{stat}</tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
