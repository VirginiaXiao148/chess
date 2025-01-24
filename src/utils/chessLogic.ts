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

export function isValidMove(board: (string | null)[][], pieceType: string, fromRow: number, fromCol: number, toRow: number, toCol: number, toSquare: string | null) {
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);

    // Prevent capturing own pieces
    if (toSquare && toSquare.includes(pieceType.split('-')[1])) {
        return false;
    }

    let isValid = false;
    switch (pieceType.split('-')[0]) {
        case 'pawn':
            isValid = isValidPawnMove(pieceType, fromRow, fromCol, toRow, toCol, toSquare);
            break;
        case 'rook':
            isValid = isValidRookMove(fromRow, fromCol, toRow, toCol) && isPathClear(board, fromRow, fromCol, toRow, toCol);
            break;
        case 'knight':
            isValid = isValidKnightMove(rowDiff, colDiff);
            break;
        case 'bishop':
            isValid = isValidBishopMove(rowDiff, colDiff) && isPathClear(board, fromRow, fromCol, toRow, toCol);
            break;
        case 'queen':
            isValid = isValidQueenMove(fromRow, fromCol, toRow, toCol) && isPathClear(board, fromRow, fromCol, toRow, toCol);
            break;
        case 'king':
            isValid = isValidKingMove(rowDiff, colDiff);
            break;
        default:
            isValid = false;
    }

    if (!isValid) {
        return false;
    }

    // Check if the move would put the player's own king in check
    const newBoard = board.map(row => row.slice());
    newBoard[toRow][toCol] = pieceType;
    newBoard[fromRow][fromCol] = null;
    const playerColor = pieceType.split('-')[1] as 'white' | 'black';
    if (isKingInCheck(newBoard, playerColor)) {
        return false;
    }

    return true;

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

    // En passant capture
    if (Math.abs(fromCol - toCol) === 1 && toRow === fromRow + direction && !toSquare) {
        const lastMove = getLastMove();
        if (lastMove && lastMove.piece.includes('pawn') && Math.abs(lastMove.fromRow - lastMove.toRow) === 2) {
            if (lastMove.toRow === fromRow && Math.abs(lastMove.toCol - fromCol) === 1) {
                return true;
            }
        }
    }

    return false;
}

let lastMove: { piece: string, fromRow: number, fromCol: number, toRow: number, toCol: number } | null = null;

export function getLastMove() {
    return lastMove;
}

export function setLastMove(move: { piece: string, fromRow: number, fromCol: number, toRow: number, toCol: number }) {
    lastMove = move;
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

// Rule of 50 moves
let positionHistory: string[] = [];
let halfMoveClock: number = 0;

export function isThreefoldRepetition(board: (string | null)[][]): boolean {
    const boardString = board.map(row => row.join(',')).join(';');
    positionHistory.push(boardString);

    const occurrences = positionHistory.filter(position => position === boardString).length;
    return occurrences >= 3;
}

export function isFiftyMoveRule(): boolean {
    return halfMoveClock >= 50;
}

export function resetHalfMoveClock() {
    halfMoveClock = 0;
}

export function incrementHalfMoveClock() {
    halfMoveClock++;
}

export function isKingInCheck(board: (string | null)[][], kingColor: 'white' | 'black'): boolean {
    const kingPosition = findKing(board, kingColor);
    if (!kingPosition) return false;

    const [kingRow, kingCol] = kingPosition;
    const opponentColor = kingColor === 'white' ? 'black' : 'white';

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece && piece.includes(opponentColor)) {
                if (isValidMove(board, piece, row, col, kingRow, kingCol, board[kingRow][kingCol])) {
                    return true;
                }
            }
        }
    }

    return false;
}

export function isCheckmate(board: (string | null)[][], kingColor: 'white' | 'black'): boolean {
    if (!isKingInCheck(board, kingColor)) return false;

    const kingPosition = findKing(board, kingColor);
    if (!kingPosition) return false;

    const [kingRow, kingCol] = kingPosition;

    // Check if the king can move to a safe position
    for (let rowDiff = -1; rowDiff <= 1; rowDiff++) {
        for (let colDiff = -1; colDiff <= 1; colDiff++) {
            const newRow = kingRow + rowDiff;
            const newCol = kingCol + colDiff;
            if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                const newSquare = board[newRow][newCol];
                if (isValidMove(board, `king-${kingColor}`, kingRow, kingCol, newRow, newCol, newSquare)) {
                    const newBoard = board.map(row => row.slice());
                    newBoard[newRow][newCol] = `king-${kingColor}`;
                    newBoard[kingRow][kingCol] = null;
                    if (!isKingInCheck(newBoard, kingColor)) {
                        return false;
                    }
                }
            }
        }
    }

    // Check if any piece can block the check or capture the attacking piece
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece && piece.includes(kingColor)) {
                for (let newRow = 0; newRow < 8; newRow++) {
                    for (let newCol = 0; newCol < 8; newCol++) {
                        const newSquare = board[newRow][newCol];
                        if (isValidMove(board, piece, row, col, newRow, newCol, newSquare)) {
                            const newBoard = board.map(row => row.slice());
                            newBoard[newRow][newCol] = piece;
                            newBoard[row][col] = null;
                            if (!isKingInCheck(newBoard, kingColor)) {
                                return false;
                            }
                        }
                    }
                }
            }
        }
    }

    return true;
}

export function isStalemate(board: (string | null)[][], kingColor: 'white' | 'black'): boolean {
    if (isKingInCheck(board, kingColor)) return false;

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece && piece.includes(kingColor)) {
                for (let newRow = 0; newRow < 8; newRow++) {
                    for (let newCol = 0; newCol < 8; newCol++) {
                        const newSquare = board[newRow][newCol];
                        if (isValidMove(board, piece, row, col, newRow, newCol, newSquare)) {
                            return false;
                        }
                    }
                }
            }
        }
    }

    return true;
}

function findKing(board: (string | null)[][], kingColor: 'white' | 'black'): [number, number] | null {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (board[row][col] === `king-${kingColor}`) {
                return [row, col];
            }
        }
    }
    return null;
}

export function makeAIMove(board: (string | null)[][], aiColor: 'white' | 'black'): (string | null)[][] {
    const opponentColor = aiColor === 'white' ? 'black' : 'white';

    for (let fromRow = 0; fromRow < 8; fromRow++) {
        for (let fromCol = 0; fromCol < 8; fromCol++) {
            const piece = board[fromRow][fromCol];
            if (piece && piece.includes(aiColor)) {
                for (let toRow = 0; toRow < 8; toRow++) {
                    for (let toCol = 0; toCol < 8; toCol++) {
                        if (isValidMove(board, piece, fromRow, fromCol, toRow, toCol, board[toRow][toCol])) {
                            const newBoard = board.map(row => row.slice());
                            newBoard[toRow][toCol] = piece;
                            newBoard[fromRow][fromCol] = null;
                            if (!isKingInCheck(newBoard, aiColor)) {
                                setLastMove({ piece, fromRow, fromCol, toRow, toCol });
                                return newBoard;
                            }
                        }
                    }
                }
            }
        }
    }

    return board;
}

function isPathClear(board: (string | null)[][], fromRow: number, fromCol: number, toRow: number, toCol: number): boolean {
    const rowStep = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0;
    const colStep = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0;

    let currentRow = fromRow + rowStep;
    let currentCol = fromCol + colStep;

    while (currentRow !== toRow || currentCol !== toCol) {
        if (board[currentRow][currentCol] !== null) {
            return false; // Obstacle found
        }
        currentRow += rowStep;
        currentCol += colStep;
    }
    return true;
}