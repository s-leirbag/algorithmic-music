import { useCallback, useEffect, useState } from 'react';
import './App.css';

const SIZE = 30;

function Cell({active, onClick}: {active: boolean, onClick: () => void}) {
  return (
    <td onClick={(e) => onClick()}>
      <div className={`cell ${active ? 'active' : ''}`}/>
    </td>
  );
}

function App() {
  const [grid, setGrid] = useState(Array.from({ length: SIZE }).map(() => Array.from({ length: SIZE }).map(() => false)));

  const getNextGrid = useCallback(() => {
    const getNeighborCount = (i: number, j: number) => {
      let count = 0;
      for (let x = i - 1; x <= i + 1; x++) {
        for (let y = j - 1; y <= j + 1; y++) {
          if (x >= 0 && x < SIZE && y >= 0 && y < SIZE && !(x === i && y === j)) {
            if (grid[x][y]) {
              count++;
            }
          }
        }
      }
      return count;
    }
  
    const getNextCellState = (i: number, j: number) => {
      const count = getNeighborCount(i, j);
      if (grid[i][j]) {
        return count === 2 || count === 3;
      } else {
        return count === 3;
      }
    }

    return grid.map((row, rowIndex) =>
      row.map((cell, cellIndex) => getNextCellState(rowIndex, cellIndex))
    );
  }, [grid]);

  useEffect(() => {
    const interval = setInterval(() => {
      setGrid(getNextGrid());
    }, 1000);
    return () => clearInterval(interval);
  }, [getNextGrid]);

  const handleToggle = (i: number, j: number) => {
    const newGrid = grid.map((row, rowIndex) =>
      row.map((cell, cellIndex) => {
        if (rowIndex === i && cellIndex === j) {
          return !cell;
        }
        return cell;
      })
    );
    setGrid(newGrid);
  }

  return (
    <div className="App">
      <table>
        <tbody>
          {Array.from({ length: SIZE }).map((_, i) => (
            <tr key={i}>
              {Array.from({ length: SIZE }).map((_, j) => (
                <Cell key={j} active={grid[i][j]} onClick={() => {handleToggle(i, j)}} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
