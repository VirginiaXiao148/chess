export function initializeBoard() {
    const initialBoard = [
        ["rook-black", "knight-black", "bishop-black", "queen-black", "king-black", "bishop-black", "knight-black", "rook-black"],
        ["pawn-black", "pawn-black", "pawn-black", "pawn-black", "pawn-black", "pawn-black", "pawn-black", "pawn-black"],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        ["pawn-white", "pawn-white", "pawn-white", "pawn-white", "pawn-white", "pawn-white", "pawn-white", "pawn-white"],
        ["rook-white", "knight-white", "bishop-white", "queen-white", "king-white", "bishop-white", "knight-white", "rook-white"]
    ];

    return initialBoard;
}

export function isValidMove(pieceType: string, fromRow: number, fromCol: number, toRow: number, toCol: number, toSquare: string | null) {
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);

    // Prevent capturing own pieces
    if (toSquare && toSquare.includes(pieceType.split('-')[1])) {
        return false;
    }

    switch (pieceType.split('-')[0]) {
        case 'pawn':
            return isValidPawnMove(pieceType, fromRow, fromCol, toRow, toCol, toSquare);
        case 'rook':
            return isValidRookMove(fromRow, fromCol, toRow, toCol);
        case 'knight':
            return isValidKnightMove(rowDiff, colDiff);
        case 'bishop':
            return isValidBishopMove(rowDiff, colDiff);
        case 'queen':
            return isValidQueenMove(rowDiff, colDiff);
        case 'king':
            return isValidKingMove(rowDiff, colDiff);
        default:
            return false;
    }
}

function isValidPawnMove(pieceType: string, fromRow: number, fromCol: number, toRow: number, toCol: number, toSquare: string | null) {
    const direction = pieceType.includes('white') ? -1 : 1;
    const startRow = pieceType.includes('white') ? 6 : 1;

    // One square forward
    if (fromCol === toCol && toRow === fromRow + direction && !toSquare) {
        return true;
    }

    // Two squares forward from starting position
    if (fromCol === toCol && fromRow === startRow && toRow === fromRow + 2 * direction && !toSquare) {
        return true;
    }

    // Diagonal capture
    if (Math.abs(fromCol - toCol) === 1 && toRow === fromRow + direction && toSquare) {
        return true;
    }

    return false;
}

function isValidRookMove(fromRow: number, fromCol: number, toRow: number, toCol: number) {
    return fromRow === toRow || fromCol === toCol;
}

function isValidKnightMove(rowDiff: number, colDiff: number) {
    return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
}

function isValidBishopMove(rowDiff: number, colDiff: number) {
    return rowDiff === colDiff;
}

function isValidQueenMove(fromRow: number, fromCol: number, toRow: number, toCol: number) {
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);
    return isValidRookMove(fromRow, fromCol, toRow, toCol) || isValidBishopMove(rowDiff, colDiff);
}

function isValidKingMove(rowDiff: number, colDiff: number) {
    return rowDiff <= 1 && colDiff <= 1;
}

function isPathClear(fromRow, fromCol, toRow, toCol) {
    const rowStep = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0;
    const colStep = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0;

    let currentRow = fromRow + rowStep;
    let currentCol = fromCol + colStep;

    while (currentRow !== toRow || currentCol !== toCol) {
        const square = document.querySelector(
            `[data-row="${currentRow}"][data-col="${currentCol}"]`
        );
        if (square.hasAttribute('data-piece')) {
            return false; // Obstacle found
        }
        currentRow += rowStep;
        currentCol += colStep;
    }
    return true;
}