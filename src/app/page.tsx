"use client";
import React, { useState, useEffect } from "react";
import OpenAI from "openai";

export default function Home() {
  const [userInput, setUserInput] = useState(""); // State to hold user input
  const [responseText, setResponseText] = useState(""); // State to hold the response text

  const openAIBearerToken = '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';
  const openai = new OpenAI({
    apiKey: openAIBearerToken,
    dangerouslyAllowBrowser: true,
  });

  let messages: any = [];

  // Function to handle user input
  const handleUserInput = (event: any) => {
    setUserInput(event.target.value);
  };

  // Function to fetch OpenAI response
  const fetchOpenAIResponse = async () => {
    try {
      messages.push({
        role: "system",
        content: "You",
      });
      messages.push({
        role: "user",
        content: userInput,
      });

      // Fetch OpenAI response
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
        temperature: 0.8,
        max_tokens: 256,
      });

      // Set the response text in the component state
      let responseMessage = response.choices[0].message.content
      if (responseMessage != null) {
        setResponseText(responseMessage)
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
          <p className="text-center">game here</p>
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
