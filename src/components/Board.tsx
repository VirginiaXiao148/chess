'use client'
import React, { useState, useEffect } from 'react';
import Square from './Square';
import { initializeBoard, isValidMove } from '../utils/chessLogic';
import styles from '../styles/Chess.module.css';

const Board = () => {
  const [board, setBoard] = useState<(string | null)[][]>([]);
  const [selectedPiece, setSelectedPiece] = useState<{ row: number, col: number } | null>(null);

  useEffect(() => {
    setBoard(initializeBoard());
  }, []);

  const handleSquareClick = (row: number, col: number) => {
    if (selectedPiece) {
      const piece = board[selectedPiece.row][selectedPiece.col];
      if (piece && isValidMove(piece, selectedPiece.row, selectedPiece.col, row, col, board[row][col])) {
        const newBoard = board.map(row => row.slice());
        newBoard[row][col] = piece;
        newBoard[selectedPiece.row][selectedPiece.col] = null;
        setBoard(newBoard);
        setSelectedPiece(null);
      } else {
        setSelectedPiece(null);
      }
    } else if (board[row][col]) {
      setSelectedPiece({ row, col });
    }
  };

  const renderSquare = (row: number, col: number, piece: string | null) => {
    const isDark = (row + col) % 2 === 1;
    return <Square key={`${row}-${col}`} row={row} col={col} isDark={isDark} piece={piece} onClick={handleSquareClick} />;
  };

  return (
    <div className={styles.board}>
      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) => renderSquare(rowIndex, colIndex, piece))
      )}
    </div>
  );
};

export default Board;