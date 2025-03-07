"use client";
import React, { useRef, useState } from "react";

const Game = () => {
  const [value, setValue] = useState("");
  const [valid, setValid] = useState<boolean>(false);
  const [result1, setResult1] = useState<number>(0);
  const [result2, setResult2] = useState<number>(0);
  const [activePlayer, setActivePlayer] = useState<string>("one");
  const [wordList] = useState<string[]>([]);
  const [lastLetter, setLastLetter] = useState("");
  const firstInput = useRef(null);
  const secondInput = useRef(null);
  const [seeAll, setSeeAll] = useState(false);

  const apiCall = async (value: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${value}`
      );
      const data = await response.json();

      if (data && data[0]?.word) {
        setValid(true);
        return true;
      } else {
        setValid(false);
        return false;
      }
    } catch (error) {
      console.error("API error:", error);
      setValid(false);
      return false;
    }
  };

  const handleEntry = async (player: string) => {
    if (value.length >= 4) {
      const firstLetter = value.toLowerCase().charAt(0);
      const newWordLastLetter = value.toLowerCase().slice(-1);
      const existWord = wordList.includes(value);
      const isValidWord = await apiCall(value);
      console.log("valid", valid);
      if (
        isValidWord &&
        ((!existWord && lastLetter === firstLetter) || lastLetter === "")
      ) {
        wordList.push(value);
        if (player === "one") {
          setResult1(result1 + 1);
          setActivePlayer("two");
        } else {
          setResult2(result2 + 1);
          setActivePlayer("one");
        }
        setValue("");
        setLastLetter(newWordLastLetter);
      } else {
        if (existWord) {
          alert(
            `The word "${value}" already exists. ${
              player === "one" ? "Player 1" : "Player 2"
            } gets a minus point.`
          );
        } else if (lastLetter !== firstLetter) {
          alert(
            `The first letter of "${value}" does not match the last letter of the previous word. ${
              player === "one" ? "Player 1" : "Player 2"
            } gets a minus point.`
          );
        } else {
          alert(`"${value}" is not a valid English word.`);
        }
        if (player === "one") {
          setResult1(result1 - 1);
          setActivePlayer("two");
        } else {
          setResult2(result2 - 1);
          setActivePlayer("one");
        }
        setValue("");
      }
    } else {
      alert("You must enter at least a 4-letter word.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-10">
      <h1 className="text-xl font-semibold">Shiritori Game</h1>
      <div className="w-full grid grid-cols-2 p-10">
        <div className="player-div">
          <h1>Player 1</h1>
          <h1>
            Point : <span>{result1}</span>
          </h1>
          <input
            type=""
            className={`input-css ${
              activePlayer === "one" ? "border-blue-500" : "border-red-500"
            }`}
            placeholder="Enter Player One Word"
            disabled={activePlayer !== "one"}
            value={value}
            ref={firstInput}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleEntry("one");
              }
            }}
          />
          <>
            {activePlayer === "one" && (
              <h1 className="text-lg font-semibold text-green-700">
                Your Turn
              </h1>
            )}
          </>
        </div>
        <div className="player-div">
          <h1>Player 2</h1>
          <h1>
            Point : <span>{result2}</span>
          </h1>
          <input
            type="text"
            className={`input-css ${
              activePlayer === "two" ? "border-blue-500" : "border-red-500"
            }`}
            placeholder="Enter Player two Word"
            disabled={activePlayer !== "two"}
            minLength={4}
            ref={secondInput}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleEntry("two");
              }
            }}
          />
          <>
            {activePlayer === "two" && (
              <h1 className="text-lg font-semibold text-green-700">
                Your Turn
              </h1>
            )}
          </>
        </div>
      </div>
      <div>
        <h1 onClick={() => setSeeAll(!seeAll)}>See All Words</h1>
        {seeAll && (
          <div className="flex flex-col justify-center items-center">
            {wordList.map((word, index) => (
              <li key={index}>{word}</li>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
