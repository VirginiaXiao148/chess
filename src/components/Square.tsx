import React from 'react';
import styles from '../styles/Chess.module.css';

interface SquareProps {
    row: number;
    col: number;
    piece: string | null;
    onClick: (row: number, col: number) => void;
}

const Square: React.FC<SquareProps> = ({ row, col, piece, onClick }) => {
    const handleClick = () => {
        onClick(row, col);
    };

    return (
        <div
            className={`${styles.square} ${((row + col) % 2 === 0) ? styles.light : styles.dark}`}
            onClick={handleClick}
            data-piece={piece}
            data-row={row}
            data-col={col}
        >
            {piece}
        </div>
    );
};

export default Square;