"use client";
import React, { useState, useEffect } from "react";
import OpenAI from "openai";
import {initialPrompt} from './prompts';
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
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Typing.');


  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  // Function to start the typing animation
  const startTypingAnimation = () => {
    let dots = 2;
    setIsLoading(true);

    const intervalId = setInterval(() => {
      setLoadingText('Typing' + '.'.repeat(dots));
      dots = (dots % 3) + 1;
    }, 500);

    return intervalId;
  };

  // Function to stop the typing animation
  const stopTypingAnimation = (intervalId: NodeJS.Timeout) => {
    clearInterval(intervalId);
    setIsLoading(false);
    setLoadingText('Typing.');
  };

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
      const intervalID = startTypingAnimation();
      let inputMessage = {
        role: MessageRole.USER,
        content: userInput,
      };
      setChatHistory((prevHistory) => [...prevHistory, inputMessage]);
      
      console.log(userInput)

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
      stopTypingAnimation(intervalID);
    } catch (error) {
      console.error("Error fetching OpenAI response:", error);
    }
  };

  useEffect(() => {
    setUserInput(initialPrompt)
    fetchOpenAIResponse()
  }, []);

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

        <div className="w-3/5 flex flex-col mr-2 ml-2 p-2">
          <div className="justify-center">
            <h2>Chat History:</h2>
            <div className="chat-history-container overflow-auto" style={{ height: "75vh" }}>
              <ul>
                {chatHistory.map((message, index) => (                  
                  <li
                    key={index}
                    className={`chat-message ${message.role === 'system' ? 'system-message' : 'user-message'}`}
                  >
                    <img
                      src={message.role === 'system' ? '../../public/icons/robot.png' : '../../public/icons/adventurer.png'}
                      alt="User or System Image"
                      style={{ borderRadius: '50%', width: '50px', height: '50px' }}
                    />
                    {message.content}
                  </li>
                ))}
                {isLoading && loadingText}
              </ul>
            </div>

            <div>
              {/* First scenario */}   
              <div style={{ display: "flex", justifyContent: "space-between", maxWidth: "600px", margin: "0 auto" }}>
                <button onClick={() => dragonScenario(0)} style={{ backgroundColor: "blue", margin: "20px" }}>Pick up a nearby sword and slay the dragon.</button>
                <button onClick={() => dragonScenario(1)} style={{ backgroundColor: "blue", margin: "20px" }}>Attempt to sooth the dragon by offering all your gold.</button>
                <button onClick={() => dragonScenario(2)} style={{ backgroundColor: "blue", margin: "20px" }}>Flee the scene.</button>
              </div>   
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
