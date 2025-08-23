const N = 16; // Grid size
const BOX_SIZE = 4; // Sub-box size

function isSafe(grid, row, col, num) {
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

function findEmptyCell(grid) {
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if (grid[i][j] === 0) return [i, j];
    }
  }
  return null;
}

// Fisher-Yates shuffle
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function solveSudoku(grid) {
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
function generateSolvedBoard() {
  const grid = Array.from({ length: N }, () => Array(N).fill(0));
  solveSudoku(grid);
  return grid;
}

// Remove random cells to create a puzzle
function removeCells(grid, emptyCells = 160) {
  const puzzle = grid.map((row) => [...row]); // deep copy
  let removed = 0;

  while (removed < emptyCells) {
    const i = Math.floor(Math.random() * N);
    const j = Math.floor(Math.random() * N);

    if (puzzle[i][j] !== 0) {
      puzzle[i][j] = 0;
      removed++;
    }
  }

  return puzzle;
}

// Main function: generate puzzle + solution
export function generateSudoku(emptyCells = 160) {
  const solved = generateSolvedBoard();
  const puzzle = removeCells(solved, emptyCells);
  return { puzzleBoard: puzzle, solvedBoard: solved };
}
