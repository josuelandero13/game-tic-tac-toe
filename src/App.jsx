import { useState } from "react"
import confetti from "canvas-confetti"
import { TURNS } from "./constants.js"
import { checkWinnerFrom } from "./logic/board.js"
import { saveGameToStorage, resetGameToStorage } from "./logic/storage/index.js"
import { Square } from "./components/Square.jsx"
import { WinnerModal } from "./components/WinnerModal.jsx"
import { Board } from "./components/Board.jsx"

function App() {
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem("board")
    if (boardFromStorage) return JSON.parse(boardFromStorage)

    // si no hay partida guardada, iniciar nueva partida
    return Array(9).fill(null)
  })

  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem("turn")

    return turnFromStorage ?? TURNS.x
  })

  const [winner, setWinner] = useState(null)

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.x)
    setWinner(null)

    resetGameToStorage()
  }

  const checkEndGame = (newBoard) => {
    return newBoard.every((square) => square != null)
  }

  const updateBoard = (index) => {
    // no se actualiza la posición
    // si ya tiene algo
    if (board[index] || winner) return

    // actualizar el tablero
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)

    // cambiar el turno
    const newTurn = turn === TURNS.x ? TURNS.o : TURNS.x
    setTurn(newTurn)

    // guardar aqui la partida en curso
    saveGameToStorage({
      board: newBoard,
      turn: newTurn
    })

    // comprobar si hay un ganador
    const newWinner = checkWinnerFrom(newBoard)
    if (newWinner) {
      confetti()
      setWinner(newWinner)
    } else if (checkEndGame(newBoard)) {
      setWinner(false)
    }
  }

  return (
    <main className="board">
      <h1>Tic tac toe</h1>

      <button onClick={resetGame}>
        Reiniciar el juego!
      </button>

      <section className="game">
        <Board board={board} updateBoard={updateBoard}/>
      </section>

      <section className="turn">
        <Square isSelected={turn === TURNS.x}>
          {TURNS.x}
        </Square>

        <Square isSelected={turn === TURNS.o}>
          {TURNS.o}
        </Square>
      </section>

      <WinnerModal resetGame={resetGame} winner={winner} />
    </main>
  )
}

export default App
