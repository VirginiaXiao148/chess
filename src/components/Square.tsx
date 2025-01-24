import React from 'react';
import Piece from './Piece';
import styles from '../styles/Chess.module.css';

interface SquareProps {
  row: number;
  col: number;
  isDark: boolean;
  piece: string | null;
  onClick: (row: number, col: number) => void;
}

const Square: React.FC<SquareProps> = ({ row, col, isDark, piece, onClick }) => {
  const handleClick = () => {
    onClick(row, col);
  };

  return (
    <div
      className={`${styles.square} ${isDark ? styles.darkSquare : styles.lightSquare}`}
      onClick={handleClick}
    >
      {piece && <Piece type={piece.split('-')[0]} color={piece.split('-')[1] as 'white' | 'black'} onClick={handleClick} />}
    </div>
  );
};

export default Square;