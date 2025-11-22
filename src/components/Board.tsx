'use client';

import React, { useState } from 'react';
import { initializeBoard, isValidMove, makeAIMove, isCheckmate, setLastMove, resetHalfMoveClock, incrementHalfMoveClock, setKingMoved, setRookMoved } from '../utils/chessLogic';
import styles from '../styles/Chess.module.css';
import Square from './Square';

const Board: React.FC = () => {
  const [board, setBoard] = useState<(string | null)[][]>(initializeBoard());
  const [selectedPiece, setSelectedPiece] = useState<{ row: number, col: number } | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<'white' | 'black'>('white');
  const [promotion, setPromotion] = useState<{ row: number, col: number, color: 'white' | 'black' } | null>(null);

  const resetGame = () => {
    setBoard(initializeBoard());
    setSelectedPiece(null);
    setCurrentPlayer('white');
    setPromotion(null);
  };

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

        // Actualizar el estado de enroque si es necesario
        if (newBoard[row][col]?.includes('king') && Math.abs(col - fromCol) === 2) {
            const isKingSide = col > fromCol;
            const rookCol = isKingSide ? 7 : 0;
            const newRookCol = isKingSide ? col - 1 : col + 1;
            
            // Mover la torre automáticamente
            newBoard[row][newRookCol] = newBoard[row][rookCol];
            newBoard[row][rookCol] = null;
        }
        // Marcar rey y torre como movidos
        if (newBoard[row][col]?.includes('king')) {
            setKingMoved(currentPlayer);
        }

        if (newBoard[row][col]?.includes('rook')) {
            setRookMoved(currentPlayer, fromCol as 0 | 7);
        }

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
          resetGame(); // Reiniciar el juego después de aceptar el mensaje
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