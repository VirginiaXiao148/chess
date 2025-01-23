import React from 'react';

interface PieceProps {
    type: string; // e.g., 'pawn', 'rook', 'knight', etc.
    color: 'white' | 'black';
    onClick: () => void; // Function to handle piece click
}

const Piece: React.FC<PieceProps> = ({ type, color, onClick }) => {
    const pieceSymbol = `${type}-${color}`;

    return (
        <div className={`piece ${pieceSymbol}`} onClick={onClick}>
            {pieceSymbol}
        </div>
    );
};

export default Piece;