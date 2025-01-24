'use client'
import React, { useState, useEffect } from 'react';
import Square from './Square';
import { initializeBoard, isValidMove, isCheckmate, isStalemate, isThreefoldRepetition, isFiftyMoveRule, makeAIMove, setLastMove, resetHalfMoveClock, incrementHalfMoveClock, setKingMoved, setRookMoved } from '../utils/chessLogic';
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

        // Handle castling
        if (piece.includes('king') && Math.abs(col - selectedPiece.col) === 2) {
          if (col === 6) { // Short castling
            newBoard[row][5] = `rook-${currentPlayer}`;
            newBoard[row][7] = null;
          } else if (col === 2) { // Long castling
            newBoard[row][3] = `rook-${currentPlayer}`;
            newBoard[row][0] = null;
          }
        }

        // Update moved pieces
        if (piece.includes('king')) {
          setKingMoved(currentPlayer);
        } else if (piece.includes('rook')) {
          setRookMoved(currentPlayer, selectedPiece.col);
        }

        setSelectedPiece(null);

        // Reset half-move clock if a pawn moves or a capture is made
        if (piece.includes('pawn') || board[row][col]) {
          resetHalfMoveClock();
        } else {
          incrementHalfMoveClock();
        }

        // Check for checkmate
        if (isCheckmate(newBoard, currentPlayer === 'white' ? 'black' : 'white')) {
          setGameOver(true);
          alert(`${currentPlayer} wins!`);
        } else if (isStalemate(newBoard, currentPlayer === 'white' ? 'black' : 'white')) {
          setGameOver(true);
          alert('Stalemate!');
        } else if (isThreefoldRepetition(newBoard)) {
          setGameOver(true);
          alert('Draw by threefold repetition!');
        } else if (isFiftyMoveRule()) {
          setGameOver(true);
          alert('Draw by fifty-move rule!');
        } else {
          setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
          // Make AI move
          const aiBoard = makeAIMove(newBoard, 'black');
          setBoard(aiBoard);

          // Check for checkmate after AI move
          if (isCheckmate(aiBoard, 'white')) {
            setGameOver(true);
            alert(`black wins!`);
          } else if (isStalemate(aiBoard, 'white')) {
            setGameOver(true);
            alert('Stalemate!');
          } else if (isThreefoldRepetition(aiBoard)) {
            setGameOver(true);
            alert('Draw by threefold repetition!');
          } else if (isFiftyMoveRule()) {
            setGameOver(true);
            alert('Draw by fifty-move rule!');
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