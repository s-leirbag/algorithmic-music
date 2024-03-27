import { useCallback, useEffect, useState, SetStateAction } from 'react';
import './App.css';

import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { PlayCircle, PauseCircle, StopCircle } from '@mui/icons-material';
import { InputSlider } from './Input';
import { Typography } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#79F2E6',
      light: '#9c9c9c',
      dark: '#04588C',
    },
    text: {
      primary: '#79F2E6',
      secondary: '#9c9c9c',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        td {
          width: 4vh;
          height: 4vh;
        }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          border: '2px solid #63c4ba',
          "&:hover": {
            border: "2px solid #79F2E6", // Matches the default border style
          },
        },
      },
    },
  },
});


const SIZE = 12;

function Cell({active, onClick}: {active: boolean, onClick: () => void}) {
  return (
    <td onClick={(e) => onClick()}>
      <div className={`cell ${active ? 'active' : ''}`}/>
    </td>
  );
}

function App() {
  const [grid, setGrid] = useState(Array.from({ length: SIZE }).map(() => Array.from({ length: SIZE }).map(() => false)));
  // status play, pause, stop
  const [status, setStatus] = useState('stop');
  const [speed, setSpeed] = useState(1);

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
    let interval: NodeJS.Timeout;
    if (status === 'play') {
      interval = setInterval(() => {
        setGrid(getNextGrid());
      }, 1000 / speed);
    }
    return () => {
      clearInterval(interval);
    }
  }, [status, getNextGrid, speed]);

  const clearGrid = () => {
    const newGrid = grid.map((row) =>
      row.map(() => false)
    );
    setGrid(newGrid);
  }

  const fillGrid = () => {
    const newGrid = grid.map((row) =>
      row.map(() => true)
    );
    setGrid(newGrid);
  }

  const randomizeGrid = () => {
    const newGrid = grid.map((row) =>
      row.map(() => Math.random() < 0.5)
    );
    setGrid(newGrid);
  }

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

  const playPauseButton = status === 'play' ? (
    <Button variant='outlined' onClick={() => setStatus('pause')}><PauseCircle /></Button>
  ) : (
    <Button variant='outlined' onClick={() => setStatus('play')}><PlayCircle /></Button>
  );

  return (
    <ThemeProvider theme={theme}>
    <CssBaseline />
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
        <Button variant='outlined' onClick={clearGrid}>Clear</Button>
        <Button variant='outlined' onClick={fillGrid}>Fill</Button>
        <Button variant='outlined' onClick={randomizeGrid}>Randomize</Button>
        {playPauseButton}
        <Button variant='outlined' onClick={() => setStatus('stop')}><StopCircle /></Button>
        <div style={{width: '300px'}}>
          <InputSlider
            name='SPEED'
            value={speed}
            step={0.25}
            min={0}
            max={10}
            onChange={(n: SetStateAction<number>) => setSpeed(n)}
          />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
