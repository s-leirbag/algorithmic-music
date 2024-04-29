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
  [
    'glider',
    `
      010
      001
      111
    `
  ],
  [
    'blinker',
    `
      000
      111
      000
    `
  ],
  [
    'toad',
    `
      0000
      0111
      1110
    `
  ],
  [
    'beacon',
    `
      1100
      1100
      0011
      0011
    `
  ],
  [
    '4 boats',
    `
      00010000
      00101000
      01011000
      10100110
      01100101
      00011010
      00010100
      00001000
    `
  ],
  [
    'kickback',
    `
    00100
    01000
    01110
    00000
    00000
    00110
    01010
    00010
    `
  ],
  [
    'blinker + loop',
    `
      010000
      010000
      010000
      000000
      000110
      001001
      000110
    `
  ],
  [
    'almosymmetric',
    `
    000010000
    110010100
    101000000
    000000011
    010000000
    100000010
    110101000
    000001000
    `
  ],
  [
    'ants',
    // `
    // 1100011000110001100
    // 0011000110001100011
    // 0011000110001100011
    // 1100011000110001100
    // `
    // `
    // 000000000000000000000
    // 011000110001100011000
    // 000110001100011000110
    // 000110001100011000110
    // 011000110001100011000
    // 000000000000000000000
    // `
    `
    0000000000000000
    0110001100011000
    0001100011000110
    0001100011000110
    0110001100011000
    0000000000000000
    `
  ],
  [
    'Achim\'s p8',
    `
    011000000
    100000000
    010001000
    010001100
    000101000
    001100010
    000100010
    000000001
    000000110
    `
  ],
  [
    '25P3H1V0.1 Vertical',
    `
    010000
    101000
    101000
    001000
    001100
    010100
    000000
    001110
    001010
    010100
    000110
    000000
    000100
    010100
    010100
    001000
    `
  ],
  [
    '25P3H1V0.1 Horizontal',
    `
    0000000000000000
    0000000110100000
    0000110101101110
    0111100110000001
    1000010001000110
    0110000000000000
    `
  ],
  [
    'Achim\'s p16',
    `
    000000000000000
    000000001100000
    000000001010000
    000100001011000
    001100000100000
    010010000000000
    011100000000000
    000000000000000
    000000000001110
    000000000010010
    000001000001100
    000110100001000
    000010100000000
    000001100000000
    000000000000000
    `
  ],
  [
    'A for all',
    `
    0000110000
    0001001000
    0001111000
    0101001010
    1000000001
    1000000001
    0101001010
    0001111000
    0001001000
    0000110000
    `
  ],
  [
    '4-8-12 diamond',
    `
    00000000000000
    00000000000000
    00000111100000
    00000000000000
    00011111111000
    00000000000000
    01111111111110
    00000000000000
    00011111111000
    00000000000000
    00000111100000
    00000000000000
    00000000000000
    `
  ],
]);

function stringToGrid(inputString: string, buffer: boolean = false) {
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

export function gridToString(array: boolean[][]): string {
  return array.map(row => row.map(cell => cell ? '1' : '0').join('')).join('\n');
}

const presetsArrays = new Map<string, boolean[][]>();
presetsRaw.forEach((raw, name) => {
  presetsArrays.set(name, stringToGrid(raw, true));
})

export const presets = new Map<string, (nRows: number, nCols: number) => { grid: boolean[][]; newNRows?: number; newNCols?: number; }>();
presetsArrays.forEach((grid, name) => {
  presets.set(name, (nRows: number, nCols: number) => {
    return {
      grid: grid,
      newNRows: grid.length,
      newNCols: grid[0].length,
    }
    // return {
    //   grid: resizeGrid(grid, nRows, nCols, true),
    //   newNRows: grid.length > nRows ? grid.length : undefined,
    //   newNCols: grid[0].length > nCols ? grid[0].length : undefined,
    // }
  })
})
presets.set('Diagonal', (nRows: number, nCols: number) => {
  return {
    grid: diagGrid(nRows, nCols),
  }
});

export const presetNames = Array.from(presets.keys())
