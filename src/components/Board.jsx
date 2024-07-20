import { Square } from "./Square.jsx"

export function Board({ board, updateBoard }) {
  return (
    board.map((square_empty, index) => {

      return (
        <Square
          key={index}
          index={index}
          updateBoard={updateBoard}
        >
          {board[index]}
        </Square>
      )
    })
  )
}
