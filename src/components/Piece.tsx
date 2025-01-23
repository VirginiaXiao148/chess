import React from 'react';
import styles from '../styles/Chess.module.css';

interface PieceProps {
    type: string; // e.g., 'pawn', 'rook', 'knight', etc.
    color: 'white' | 'black';
    onClick: () => void; // Function to handle piece click
}

const pieceSymbols: { [key: string]: { [key: string]: string } } = {
    pawn: { white: '♙', black: '♟' },
    rook: { white: '♖', black: '♜' },
    knight: { white: '♘', black: '♞' },
    bishop: { white: '♗', black: '♝' },
    queen: { white: '♕', black: '♛' },
    king: { white: '♔', black: '♚' },
};

const Piece: React.FC<PieceProps> = ({ type, color, onClick }) => {
    const pieceSymbol = pieceSymbols[type][color];

    return (
        <div className={styles.piece} onClick={onClick}>
            {pieceSymbol}
        </div>
    );
};

export default Piece;