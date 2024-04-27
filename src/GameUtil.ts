const getNeighborCount = (i: number, j: number, grid: boolean[][]) => {
  let count = 0;
  for (let row = i - 1; row <= i + 1; row++) {
    for (let col = j - 1; col <= j + 1; col++) {
      const wrapRow = (row + grid.length) % grid.length;
      const wrapCol = (col + grid[0].length) % grid[0].length;
      if (!(wrapRow === i && wrapCol === j)) {
        if (grid[wrapRow][wrapCol]) {
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

export const resizeGrid = (grid: boolean[][], nRows: number, nCols: number, noShrink: boolean = false) => {
  if (grid.length < nRows) {
    grid = grid.concat(Array.from({ length: nRows - grid.length }).map(() => []));
  }
  else if (!noShrink) {
    grid = grid.slice(0, nRows);
  }

  return grid.map((row) => {
    if (row.length < nCols) {
      return row.concat(Array.from({ length: nCols - row.length }).map(() => false));
    }
    else if (!noShrink) {
      return row.slice(0, nCols);
    }
    else {
      return row;
    }
  });
}

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

export const randGrid = (nRows: number, nCols: number, threshold: number = 0.3) => {
  return Array.from({ length: nRows }).map(() => Array.from({ length: nCols }).map(() => Math.random() < threshold));
}

const presetsRaw = new Map([
  ['glider',
    `
      010
      001
      111
    `
  ],
  ['blinker',
    `
      000
      111
      000
    `
  ],
  ['toad',
    `
      0111
      1110
    `
  ],
  ['beacon',
    `
      1100
      1100
      0011
      0011
    `
  ],
]);

function processBinaryString(inputString: string, buffer: boolean = false) {
  const rows = inputString.trim().split('\n');
  const matrix = [];
  let nCols = 0;

  for (let row of rows) {
      const rowData = row.trim().split('');
      const boolRow = rowData.map(char => char === '1');
      if (buffer) {
        boolRow.unshift(false);
        boolRow.push(false);
      }
      nCols = boolRow.length;
      matrix.push(boolRow);
  }

  if (buffer) {
    matrix.unshift(Array(nCols).fill(false));
    matrix.push(Array(nCols).fill(false));
  }

  return matrix;
}

const presetsArrays = new Map<string, boolean[][]>();
presetsRaw.forEach((raw, name) => {
  presetsArrays.set(name, processBinaryString(raw, true));
})

export const presets = new Map<string, (nRows: number, nCols: number) => { grid: boolean[][]; newNRows: number | undefined; newNCols: number | undefined; }>();
presetsArrays.forEach((grid, name) => {
  presets.set(name, (nRows: number, nCols: number) => {
    return {
      grid: resizeGrid(grid, nRows, nCols, true),
      newNRows: grid.length > nRows ? grid.length : undefined,
      newNCols: grid[0].length > nCols ? grid[0].length : undefined,
    }
  })
})

export const presetNames = Array.from(presetsRaw.keys())
