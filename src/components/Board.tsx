'use client'
import React, { useState, useEffect } from 'react';
import Square from './Square';
import { initializeBoard } from '../utils/chessLogic';
import styles from '../styles/Chess.module.css';

const Board = () => {
  const [board, setBoard] = useState<(string | null)[][]>([]);

  useEffect(() => {
    setBoard(initializeBoard());
  }, []);

  const renderSquare = (row: number, col: number, piece: string | null) => {
    const isDark = (row + col) % 2 === 1;
    return <Square key={`${row}-${col}`} row={row} col={col} isDark={isDark} piece={piece} onClick={() => handleSquareClick(row, col)} />;
  };

  const handleSquareClick = (row: number, col: number) => {
    // Handle the square click event
    console.log(`Square clicked: row ${row}, col ${col}`);
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