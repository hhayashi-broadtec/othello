"use client"

import { useState, useCallback } from "react"

type Player = "black" | "white"
type Cell = Player | null
type Board = Cell[][]

const BOARD_SIZE = 8

const initialBoard: Board = Array(BOARD_SIZE)
  .fill(null)
  .map(() => Array(BOARD_SIZE).fill(null))
initialBoard[3][3] = initialBoard[4][4] = "white"
initialBoard[3][4] = initialBoard[4][3] = "black"

const DIRECTIONS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
]

export function useOthello() {
  const [board, setBoard] = useState<Board>(initialBoard)
  const [currentPlayer, setCurrentPlayer] = useState<Player>("black")
  const [scores, setScores] = useState({ black: 2, white: 2 })
  const [isAIEnabled, setIsAIEnabled] = useState(false)
  const [humanPlayer, setHumanPlayer] = useState<Player>("black")

  const isValidMove = useCallback(
    (row: number, col: number): boolean => {
      if (board[row][col] !== null) return false

      for (const [dx, dy] of DIRECTIONS) {
        let x = row + dx
        let y = col + dy
        let foundOpponent = false

        while (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE) {
          if (board[x][y] === null) break
          if (board[x][y] === currentPlayer) {
            if (foundOpponent) return true
            break
          }
          foundOpponent = true
          x += dx
          y += dy
        }
      }

      return false
    },
    [board, currentPlayer],
  )

  const makeMove = useCallback(
    (row: number, col: number) => {
      if (!isValidMove(row, col)) return

      const newBoard = board.map((row) => [...row])
      newBoard[row][col] = currentPlayer

      for (const [dx, dy] of DIRECTIONS) {
        let x = row + dx
        let y = col + dy
        const toFlip: [number, number][] = []

        while (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE) {
          if (newBoard[x][y] === null) break
          if (newBoard[x][y] === currentPlayer) {
            for (const [fx, fy] of toFlip) {
              newBoard[fx][fy] = currentPlayer
            }
            break
          }
          toFlip.push([x, y])
          x += dx
          y += dy
        }
      }

      setBoard(newBoard)
      updateScores(newBoard)
      setCurrentPlayer(currentPlayer === "black" ? "white" : "black")

      if (isAIEnabled && currentPlayer !== humanPlayer) {
        makeAIMove()
      }
    },
    [board, currentPlayer, isValidMove, isAIEnabled, humanPlayer],
  )

  const makeAIMove = useCallback(() => {
    // Simple AI logic to make a move
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (isValidMove(row, col)) {
          makeMove(row, col)
          return
        }
      }
    }
  }, [isValidMove, makeMove])

  const updateScores = (newBoard: Board) => {
    const newScores = { black: 0, white: 0 }
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (newBoard[row][col] === "black") newScores.black++
        if (newBoard[row][col] === "white") newScores.white++
      }
    }
    setScores(newScores)
  }

  const resetGame = () => {
    setBoard(initialBoard)
    setCurrentPlayer("black")
    setScores({ black: 2, white: 2 })
  }

  const toggleAI = () => {
    setIsAIEnabled(!isAIEnabled)
    resetGame()
  }

  const choosePlayer = (player: Player) => {
    setHumanPlayer(player)
    resetGame()
  }

  return { board, currentPlayer, scores, makeMove, resetGame, toggleAI, isAIEnabled, humanPlayer, choosePlayer }
}
