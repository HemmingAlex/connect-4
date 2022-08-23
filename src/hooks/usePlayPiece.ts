import { boardRows } from "const";
import { useRecoilState } from "recoil";
import { boardState, gameOverState, playerState } from "state";

const testWin = (arr: number[]): boolean => /1{4}|2{4}/.test(arr.join(""));

const usePlayPiece = () => {
  const [board, setBoard] = useRecoilState(boardState);
  const [player, setPlayerTurn] = useRecoilState(playerState);
  const [gameOver, setGameOver] = useRecoilState(gameOverState);

  return (col: number) => {
    // Prevent adding a piece when the game is over
    if (gameOver) {
      return;
    }

    // Prevent adding a piece when the column is full
    if (board[col].length === boardRows) {
      return;
    }

    // Play piece (non mutating)
    const newBoard = board.map((column, i) =>
      i === col ? [...column, player] : column
    );
    // col is x row is y
    const row = newBoard[col].length - 1;
    // items in current row are the length of the array,
    //as the array has nothign in it without anything being chosem
    //reduced array to specific indexes value

    let topPositiveDiagonal = [];
    let bottomPositiveDiagonal = [];
    let topNegativeDiagonal = [];
    let bottomNegativeDiagonal = [];

    const width = 6;
    const height = 5;

    if (row + col > 5) {
      for (let x = 0; x <= height + width - col - row; x++) {
        // use for loop as diagonal distance is variable
        // top negative line
        // starting point = y - (7-x) or y + x - 7 , max length =  7 - y + x - 7, or y + x
        topNegativeDiagonal.push(newBoard[col + row - height + x][height - x]);
      }
    } else {
      for (let x = 0; x <= col + row; x++) {
        // bottom negative line
        bottomNegativeDiagonal.push(newBoard[x][row + col - x]);
      }
    }

    if (row > col) {
      for (let x = 0; x < 7 - row + col; x++) {
        // lower positive one
        // starting point  = x - y, max length =  7 - (x - y)
        topPositiveDiagonal.push(newBoard[x][x + row - col]);
      }
    } else {
      for (let x = 0; x < 7 - col + row; x++) {
        bottomPositiveDiagonal.push(newBoard[col - row + x][x]);
      }
    }

    if (
      //test each col as having 4 in a row
      testWin(newBoard[col]) || // Did win vertically
      //test of only the currently selected row
      testWin(newBoard.map((col) => col[row] || 0)) ||
      testWin(topPositiveDiagonal) ||
      testWin(bottomPositiveDiagonal) ||
      testWin(topNegativeDiagonal) ||
      testWin(bottomNegativeDiagonal)
    ) {
      setGameOver(true);
    } else {
      setPlayerTurn(player === 1 ? 2 : 1);
    }

    setBoard(newBoard);
  };
};

export default usePlayPiece;
