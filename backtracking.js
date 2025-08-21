const N = 16; // Grid size
const BOX_SIZE = 4; // Sub-box size

/**
 * Checks if it's safe to place a number in a given cell.
 * @param {number[][]} grid The 16x16 Sudoku grid.
 * @param {number} row The row index.
 * @param {number} col The column index.
 * @param {number} num The number to check (1-16).
 * @returns {boolean} True if the placement is safe, false otherwise.
 */
function isSafe(grid, row, col, num) {
  // Check if 'num' is not already present in the current row
  for (let x = 0; x < N; x++) {
    if (grid[row][x] === num) {
      return false;
    }
  }

  // Check if 'num' is not already present in the current column
  for (let x = 0; x < N; x++) {
    if (grid[x][col] === num) {
      return false;
    }
  }

  // Check if 'num' is not already present in the current 4x4 sub-box
  const startRow = row - (row % BOX_SIZE);
  const startCol = col - (col % BOX_SIZE);
  for (let i = 0; i < BOX_SIZE; i++) {
    for (let j = 0; j < BOX_SIZE; j++) {
      if (grid[i + startRow][j + startCol] === num) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Finds the first empty cell (represented by 0) in the grid.
 * @param {number[][]} grid The 16x16 Sudoku grid.
 * @returns {number[] | null} An array [row, col] of the empty cell, or null if no empty cell is found.
 */
function findEmptyCell(grid) {
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if (grid[i][j] === 0) {
        return [i, j];
      }
    }
  }
  return null; // No empty cell found, puzzle is solved
}

/**
 * Solves the Hexadoku puzzle using backtracking.
 * @param {number[][]} grid The 16x16 Sudoku grid, with 0 for empty cells.
 * @returns {boolean} True if a solution is found, false otherwise.
 */
function solveSudoku(grid) {
  const emptyCell = findEmptyCell(grid);

  if (!emptyCell) {
    return true; // Puzzle is solved
  }

  const [row, col] = emptyCell;

  // Try placing numbers 1 through 16
  for (let num = 1; num <= N; num++) {
    if (isSafe(grid, row, col, num)) {
      // Make a tentative assignment
      grid[row][col] = num;

      // Recur to solve the rest of the puzzle
      if (solveSudoku(grid)) {
        return true;
      }

      // If the assignment didn't lead to a solution, backtrack
      grid[row][col] = 0;
    }
  }

  return false; // This triggers backtracking
}

/**
 * A utility function to print the grid.
 * @param {number[][]} grid The 16x16 Sudoku grid.
 */
function printGrid(grid) {
  for (let i = 0; i < N; i++) {
    // Convert numbers to hex for better readability if desired
    const rowStr = grid[i]
      .map((num) => num.toString(16).toUpperCase())
      .join(" ");
    console.log(rowStr);
  }
}

// Example usage:
// const grid = [
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//     // ... fill in the rest of the 16x16 grid with 0s or initial numbers
// ];
//
// if (solveSudoku(grid)) {
//     console.log("Solution found:");
//     printGrid(grid);
// } else {
//     console.log("No solution exists.");
// }
