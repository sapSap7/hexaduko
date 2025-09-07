export const N = 16; // Grid size
export const BOX_SIZE = 4; // Sub-box size

function isSafe(
  grid: (number | null)[][],
  row: number,
  col: number,
  num: number
) {
  for (let x = 0; x < N; x++) {
    if (grid[row][x] === num || grid[x][col] === num) return false;
  }

  const startRow = row - (row % BOX_SIZE);
  const startCol = col - (col % BOX_SIZE);
  for (let i = 0; i < BOX_SIZE; i++) {
    for (let j = 0; j < BOX_SIZE; j++) {
      if (grid[startRow + i][startCol + j] === num) return false;
    }
  }

  return true;
}

function findEmptyCell(grid: (number | null)[][]): [number, number] | null {
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if (grid[i][j] === 0 || grid[i][j] === null) return [i, j];
    }
  }
  return null;
}

// Fisher-Yates shuffle
function shuffleArray(array: number[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function solveSudoku(grid: (number | null)[][]): boolean {
  const emptyCell = findEmptyCell(grid);
  if (!emptyCell) return true;

  const [row, col] = emptyCell;

  // shuffle numbers 1–16 for randomness
  const numbers = shuffleArray([...Array(N).keys()].map((x) => x + 1));

  for (let num of numbers) {
    if (isSafe(grid, row, col, num)) {
      grid[row][col] = num;
      if (solveSudoku(grid)) return true;
      grid[row][col] = 0;
    }
  }

  return false;
}

// Generate a solved 16x16 board
function generateSolvedBoard(): number[][] {
  const grid: (number | null)[][] = Array.from({ length: N }, () =>
    Array(N).fill(null)
  );
  solveSudoku(grid);
  return grid as number[][];
}

// Remove random cells to create a puzzle
function removeCells(grid: number[][], emptyCells = 160): (number | null)[][] {
  const puzzle = grid.map((row) => [...row]) as (number | null)[][]; // deep copy
  let removed = 0;

  while (removed < emptyCells) {
    const i = Math.floor(Math.random() * N);
    const j = Math.floor(Math.random() * N);

    if (puzzle[i][j] !== 0 && puzzle[i][j] !== null) {
      puzzle[i][j] = null;
      removed++;
    }
  }

  return puzzle;
}

// === NEW VALIDATION HELPERS ===

// Check if a row is filled correctly
export function isRowCorrect(
  board: (number | null)[][],
  solution: number[][],
  row: number
): boolean {
  return board[row].every(
    (cell, c) => cell !== null && cell === solution[row][c]
  );
}

// Check if a column is filled correctly
export function isColCorrect(
  board: (number | null)[][],
  solution: number[][],
  col: number
): boolean {
  return board.every(
    (row, r) => row[col] !== null && row[col] === solution[r][col]
  );
}

// Check if a box is filled correctly
export function isBoxCorrect(
  board: (number | null)[][],
  solution: number[][],
  row: number,
  col: number
): boolean {
  const startRow = row - (row % BOX_SIZE);
  const startCol = col - (col % BOX_SIZE);

  for (let i = 0; i < BOX_SIZE; i++) {
    for (let j = 0; j < BOX_SIZE; j++) {
      const r = startRow + i;
      const c = startCol + j;
      if (board[r][c] === null || board[r][c] !== solution[r][c]) {
        return false;
      }
    }
  }
  return true;
}

// Check if the entire board is solved
export function isBoardSolved(
  board: (number | null)[][],
  solution: number[][]
): boolean {
  return board.every((row, r) =>
    row.every((cell, c) => cell !== null && cell === solution[r][c])
  );
}

// Main function: generate puzzle + solution
export function generateSudoku(emptyCells = 160) {
  const solved = generateSolvedBoard();
  const puzzle = removeCells(solved, emptyCells);
  return { puzzleBoard: puzzle, solvedBoard: solved };
}
