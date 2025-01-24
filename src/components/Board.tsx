'use client'
import React, { useState, useEffect } from 'react';
import Square from './Square';
import { initializeBoard, isValidMove, isCheckmate, makeAIMove, setLastMove } from '../utils/chessLogic';
import styles from '../styles/Chess.module.css';

const Board = () => {
  const [board, setBoard] = useState<(string | null)[][]>([]);
  const [selectedPiece, setSelectedPiece] = useState<{ row: number, col: number } | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<'white' | 'black'>('white');
  const [gameOver, setGameOver] = useState<boolean>(false);

  useEffect(() => {
    setBoard(initializeBoard());
  }, []);

  const handleSquareClick = (row: number, col: number) => {
    if (gameOver) return;

    if (selectedPiece) {
      const piece = board[selectedPiece.row][selectedPiece.col];
      if (piece && isValidMove(board, piece, selectedPiece.row, selectedPiece.col, row, col, board[row][col])) {
        const newBoard = board.map(row => row.slice());
        newBoard[row][col] = piece;
        newBoard[selectedPiece.row][selectedPiece.col] = null;
        setBoard(newBoard);
        setLastMove({ piece, fromRow: selectedPiece.row, fromCol: selectedPiece.col, toRow: row, toCol: col });
        setSelectedPiece(null);

        // Check for checkmate
        if (isCheckmate(newBoard, currentPlayer === 'white' ? 'black' : 'white')) {
          setGameOver(true);
          alert(`${currentPlayer} wins!`);
        } else {
          setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
          // Make AI move
          const aiBoard = makeAIMove(newBoard, 'black');
          setBoard(aiBoard);

          // Check for checkmate after AI move
          if (isCheckmate(aiBoard, 'white')) {
            setGameOver(true);
            alert(`black wins!`);
          } else {
            setCurrentPlayer('white');
          }
        }
      } else {
        setSelectedPiece(null);
      }
    } else if (board[row][col] && board[row][col]?.includes(currentPlayer)) {
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