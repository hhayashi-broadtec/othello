"use client"

import { useOthello } from "./hooks/useOthello"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function Othello() {
  const { board, currentPlayer, scores, makeMove, resetGame, toggleAI, isAIEnabled } = useOthello()
  const [humanPlayer, setHumanPlayer] = useState<"black" | "white">("black")

  const choosePlayer = (player: "black" | "white") => {
    setHumanPlayer(player)
    resetGame()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">オセロゲーム</h1>
      <div className="mb-4">
        <span className="mr-4">黒: {scores.black}</span>
        <span>白: {scores.white}</span>
      </div>
      <div className="mb-4">
        現在のプレイヤー: <span className="font-bold">{currentPlayer === "black" ? "黒" : "白"}</span>
      </div>
      <div className="grid grid-cols-8 gap-1 bg-green-700 p-2">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              className="w-12 h-12 bg-green-600 flex items-center justify-center"
              onClick={() => makeMove(rowIndex, colIndex)}
              disabled={isAIEnabled && currentPlayer !== humanPlayer}
            >
              {cell && <div className={`w-10 h-10 rounded-full ${cell === "black" ? "bg-black" : "bg-white"}`} />}
            </button>
          )),
        )}
      </div>
      <Button onClick={resetGame} className="mt-8">
        ゲームをリセット
      </Button>
      <Button onClick={toggleAI} className="mt-4">
        {isAIEnabled ? "AIを無効にする" : "AIを有効にする"}
      </Button>
      <div className="mt-4">
        <Button onClick={() => choosePlayer("black")} className="mr-2">
          黒を選択
        </Button>
        <Button onClick={() => choosePlayer("white")}>
          白を選択
        </Button>
      </div>
    </div>
  )
}
