const getNeighborCount = (i: number, j: number, grid: boolean[][]) => {
  let count = 0;
  for (let row = i - 1; row <= i + 1; row++) {
    for (let col = j - 1; col <= j + 1; col++) {
      if (row >= 0 && row < grid.length && col >= 0 && col < grid[0].length && !(row === i && col === j)) {
        if (grid[row][col]) {
          count++;
        }
      }
    }
  }
  return count;
};

const getNextCellState = (i: number, j: number, grid: boolean[][]) => {
  const count = getNeighborCount(i, j, grid);
  if (grid[i][j]) {
    return count === 2 || count === 3;
  } else {
    return count === 3;
  }
};

export const getNextGrid = (grid: boolean[][]) => {
  return grid.map((row, rowIndex) =>
    row.map((cell, cellIndex) => getNextCellState(rowIndex, cellIndex, grid))
  );
};

export const diagGrid = (nRows: number, nCols: number) => {
  let grid = Array.from({ length: nRows }).map(() => Array.from({ length: nCols }).map(() => false));
  grid.forEach((row, i) => {
      row[i] = true;
  });
  return grid;
}
export const clearGrid = (nRows: number, nCols: number) => {
  return Array.from({ length: nRows }).map(() => Array.from({ length: nCols }).map(() => false));
}

export const fillGrid = (nRows: number, nCols: number) => {
  return Array.from({ length: nRows }).map(() => Array.from({ length: nCols }).map(() => true));
}

export const randGrid = (nRows: number, nCols: number, threshold: number) => {
  return Array.from({ length: nRows }).map(() => Array.from({ length: nCols }).map(() => Math.random() < threshold));
}