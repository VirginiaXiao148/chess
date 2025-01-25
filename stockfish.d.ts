declare module 'stockfish' {
    const Stockfish: () => {
      postMessage: (message: string) => void;
      onmessage: (message: string) => void;
    };
    export default Stockfish;
  }