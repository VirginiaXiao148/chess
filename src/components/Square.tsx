import React from 'react';
import styles from '../styles/Chess.module.css';
import Piece from './Piece';

interface SquareProps {
    row: number;
    col: number;
    piece: string | null;
    isDark: boolean;
    onClick: (row: number, col: number) => void;
}

const Square: React.FC<SquareProps> = ({ row, col, piece, isDark, onClick }) => {
    const handleClick = () => {
        onClick(row, col);
    };

    return (
        <div
            className={`${styles.square} ${isDark ? styles.darkSquare : styles.lightSquare}`}
            onClick={handleClick}
            data-row={row}
            data-col={col}
        >
            {piece && (
                <Piece type={piece.split('-')[0]} color={piece.split('-')[1] as 'white' | 'black'} onClick={handleClick} />
            )}
        </div>
    );
};

export default Square;