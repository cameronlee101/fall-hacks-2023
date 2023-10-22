"use client";
import React, { useState, useEffect, useRef } from "react";
import OpenAI from "openai";
import { allPrompts, deathPrompt } from "./prompts";
import Image from 'next/image';

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

  const chatContainerRef = useRef(null);


  const [chatHistory, setChatHistory] = useState<{ role: MessageRole; content: string }[]>([]);
  const [promptHistor, setPromptHistory] = useState<{ role: MessageRole; content: string }[]>([]);
  const [inventory, setInventory] = useState([new InventoryItem("Gold", 5)]); // Initial inventory array
  const [stats, setStats] = useState([new PlayerStat("Health", 3), new PlayerStat("Strength", 3)]); // Initial stats array
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Typing.');
  const [stage, setStage] = useState<number>(0)


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

  const getOpenAIResponse = async (userInput: any) => {
    let inputPrompt = {
      role: MessageRole.USER,
      content: userInput.gpt,
    };

    let inputMessage = {
      role: MessageRole.USER,
      content: userInput.user,
    };

    await setPromptHistory((prevHistory) => [...prevHistory, inputPrompt])
    await setChatHistory((prevHistory) => [...prevHistory, inputMessage]);
    await fetchOpenAIResponse(inputPrompt);
  }

  // Function to fetch OpenAI response
  const fetchOpenAIResponse = async (userMessage: any) => {
    try {
      const intervalID = startTypingAnimation();
      // Fetch OpenAI response
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [...chatHistory, userMessage],
        temperature: 0.8,
        max_tokens: 256,
      });

      let responseMessage = response.choices[0].message.content;
      if (responseMessage != null) {
        const systemMessage = {
          role: MessageRole.SYSTEM,
          content: responseMessage,
        };

        await setChatHistory((prevHistory) => [...prevHistory, systemMessage]);
      }
      stopTypingAnimation(intervalID);
    } catch (error) {
      console.error("Error fetching OpenAI response:", error);
    }
  };

  function scenario() {
    return (
      <div style={{ display: "flex", justifyContent: "center", maxWidth: "600px", margin: "0 auto" }}>
        <div>
          {allPrompts[stage].map((prompt, index) => (
            <button
              key={index}
              onClick={() => dragonScenarioLogic(prompt.option)}
              style={{ backgroundColor: "lightgray", margin: "5px" }}
            >
              {prompt.user}
            </button>
          ))}
        </div>
      </div>
    );
  }

  useEffect(() => {
    const chatContainer = chatContainerRef.current as HTMLDivElement | null;
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [chatHistory]);

  // Function for Scenario 1
  const dragonScenarioLogic = (selection: number) => {

    let healthStat = findPlayerStat("Health");
    let strengthStat = findPlayerStat("Strength");

    if (allPrompts[stage][selection].health !== undefined) {
      if (healthStat) {
        healthStat.quantity += allPrompts[stage][selection].health as number;

        if(healthStat.quantity <= 0){
          // death condition
          getOpenAIResponse(deathPrompt[0])
        }
      }
    }

    if (allPrompts[stage][selection].strength !== undefined) {
      if (strengthStat) {
        strengthStat.quantity += allPrompts[stage][selection].strength as number;
      }
    }

    if (healthStat) {
      if (healthStat.quantity > 1) {
        getOpenAIResponse(allPrompts[stage][selection])
        if (stage < (allPrompts.length - 1)) {
          setStage(stage + 1);
        }
      }
    }
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

        <div className="w-3/5 flex flex-col mr-2 ml-2 ">
          <div className="justify-center">
            <h2>Chat History:</h2>
            <div className="chat-history-container custom-scrollbar p-5" style={{ height: "65vh" }} ref={chatContainerRef}>
              <ul>
                {chatHistory.map((message, index) => (
                  <li
                    key={index}
                    className={`chat-message ${message.role === 'system' ? 'system-message' : 'user-message'}`}
                  >
                    <Image
                      src={message.role === 'system' ? '/icons/robot.png' : '/icons/adventurer.png'}
                      alt="User or System Image"
                      className={`chat-message ${message.role === 'system' ? 'system-message' : 'user-message'}`}
                      width={50}
                      height={50}
                      style={message.role === 'system' ? { borderRadius: '50%' } : { borderRadius: '50%', marginLeft: 730 }}
                    />
                    {message.content}
                  </li>
                ))}
                {isLoading && loadingText}
              </ul>
            </div>
            {!isLoading && (findPlayerStat("Health")?.quantity ?? 0) > 1 && scenario()}
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
