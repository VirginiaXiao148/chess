'use client';

import React, { useState } from 'react';
import Square from './Square';
import { initializeBoard, isValidMove, setLastMove, isCheckmate, resetHalfMoveClock, incrementHalfMoveClock, makeAIMove } from '../utils/chessLogic';
import styles from '../styles/Chess.module.css';

const Board: React.FC = () => {
  const [board, setBoard] = useState(initializeBoard());
  const [selectedPiece, setSelectedPiece] = useState<{ row: number, col: number } | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<'white' | 'black'>('white');
  const [promotion, setPromotion] = useState<{ row: number, col: number, color: 'white' | 'black' } | null>(null);

  const handleSquareClick = (row: number, col: number) => {
    if (promotion) return; // Prevent moves during promotion

    const piece = board[row][col];
    if (selectedPiece) {
      const { row: fromRow, col: fromCol } = selectedPiece;
      if (isValidMove(board, board[fromRow][fromCol]!, fromRow, fromCol, row, col, piece)) {
        const newBoard = board.map(row => row.slice());
        newBoard[row][col] = board[fromRow][fromCol];
        newBoard[fromRow][fromCol] = null;
        setBoard(newBoard);
        setLastMove({ piece: board[fromRow][fromCol]!, fromRow, fromCol, toRow: row, toCol: col });

        if (newBoard[row][col]?.includes('pawn') && (row === 0 || row === 7)) {
          setPromotion({ row, col, color: currentPlayer });
        } else {
          setSelectedPiece(null);
          setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
        }

        if (newBoard[row][col]?.includes('pawn') || piece) {
          resetHalfMoveClock();
        } else {
          incrementHalfMoveClock();
        }

        if (isCheckmate(newBoard, currentPlayer === 'white' ? 'black' : 'white')) {
          alert(`${currentPlayer} wins by checkmate!`);
        } else {
          // IA move
          if (currentPlayer === 'white') {
            const aiBoard = makeAIMove(newBoard, 'black');
            setBoard(aiBoard);
            setCurrentPlayer('white');
          }
        }
      } else {
        setSelectedPiece(null);
      }
    } else if (piece && piece.includes(currentPlayer)) {
      setSelectedPiece({ row, col });
    }
  };

  const handlePromotion = (newPiece: string) => {
    if (promotion) {
      const newBoard = board.map(row => row.slice());
      newBoard[promotion.row][promotion.col] = `${newPiece}-${promotion.color}`;
      setBoard(newBoard);
      setPromotion(null);
      setSelectedPiece(null);
      setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');

      // IA move after promotion
      if (currentPlayer === 'white') {
        const aiBoard = makeAIMove(newBoard, 'black');
        setBoard(aiBoard);
        setCurrentPlayer('white');
      }
    }
  };

  return (
    <div>
      <div className={styles.board}>
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => (
            <Square
              key={`${rowIndex}-${colIndex}`}
              row={rowIndex}
              col={colIndex}
              isDark={(rowIndex + colIndex) % 2 === 1}
              piece={piece}
              onClick={handleSquareClick}
            />
          ))
        )}
      </div>
      {promotion && (
        <div className={styles.promotion}>
          {['queen', 'rook', 'bishop', 'knight'].map(piece => (
            <button key={piece} onClick={() => handlePromotion(piece)}>
              {piece}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Board;