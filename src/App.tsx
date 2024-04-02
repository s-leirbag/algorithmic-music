import { useEffect, useState, SetStateAction } from 'react';
import './App.css';

import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { PlayCircle, PauseCircle, StopCircle, ReplayCircleFilled } from '@mui/icons-material';
import { InputSlider } from './Input';

import * as Tone from 'tone';

const synth = new Tone.PolySynth(Tone.Synth).toDestination();

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


const SIZE = 7;
const DEFAULT_INTERVAL = 1000;

function Cell({active, playing, onClick}: {active: boolean, playing: boolean, onClick: () => void}) {
  return (
    <td onClick={(e) => onClick()}>
      <div className={`cell ${active ? 'active' : ''} ${playing ? 'playing' : ''}`}/>
    </td>
  );
}

type Note = {
  note: string;
  time: number;
}

function App() {
  const defaultGrid = Array.from({ length: SIZE }).map(() => Array.from({ length: SIZE }).map(() => false));
  defaultGrid.forEach((row, i) => {
    row[i] = true;
  });
  const [grid, setGrid] = useState(defaultGrid);
  // status play, pause, stop
  const [status, setStatus] = useState('stop');
  const [speed, setSpeed] = useState(1);
  const [colToPlay, setColToPlay] = useState(0);
  const [notesToPlay, setNotesToPlay] = useState<Note[][]>([]);

  useEffect(() => {
    const newNotesToPlay: Note[][] = Array.from({ length: SIZE }).map(() => []);
    const now = Tone.now()
    const SCALE = ['B4', 'A4', 'G4', 'F4', 'E4', 'D4', 'C4'];
    grid.forEach((row, i) => {
      row.forEach((_, j) => {
        if (!grid[i][j]) {
          return;
        }
        const secInterval = DEFAULT_INTERVAL / speed / 1000;
        newNotesToPlay[j].push({
          note: SCALE[i],
          time: now + secInterval * j
        });
      });
    });

    setNotesToPlay(newNotesToPlay);
  }, [grid, speed]);

  useEffect(() => {
    if (status !== 'play') {
      return;
    }

    notesToPlay[colToPlay].forEach((note) => {
      synth.triggerAttackRelease(note.note, '8n');
    });
  }, [colToPlay, status]);

  useEffect(() => {
    const getNeighborCount = (i: number, j: number, grid: boolean[][]) => {
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
    };
  
    const getNextCellState = (i: number, j: number, grid: boolean[][]) => {
      const count = getNeighborCount(i, j, grid);
      if (grid[i][j]) {
        return count === 2 || count === 3;
      } else {
        return count === 3;
      }
    };

    const getNextGrid = (grid: boolean[][]) => {
      // console.log('getNextGrid');
      // console.log(grid.map((row, rowIndex) =>
      //   row.map((cell, cellIndex) => getNextCellState(rowIndex, cellIndex, grid))
      // ));
      return grid.map((row, rowIndex) =>
        row.map((cell, cellIndex) => getNextCellState(rowIndex, cellIndex, grid))
      );
    };
    
    let interval: NodeJS.Timeout;
    if (status === 'play') {
      interval = setInterval(() => {
        setColToPlay((c) => {
          let newC = (c + 1) % SIZE;
          if (newC === SIZE - 1) {
            setTimeout(() => setGrid((g) => getNextGrid(g)), DEFAULT_INTERVAL / speed / 2);
          }
          return newC;
        });
      }, DEFAULT_INTERVAL / speed);
    }
    else if (status === 'stop') {
      setColToPlay(0);
    }

    return () => {
      clearInterval(interval);
    }
  }, [status, speed]);

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

  const stopButton = status === 'play' ? (
    <Button variant='outlined' onClick={() => setStatus('stop')}><StopCircle /></Button>
  ) : (
    <Button variant='outlined' onClick={() => setStatus('stop')}><ReplayCircleFilled /></Button>
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
                  <Cell key={j} active={grid[i][j]} playing={j === colToPlay} onClick={() => {handleToggle(i, j)}} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <Button variant='outlined' onClick={clearGrid}>Clear</Button>
        <Button variant='outlined' onClick={fillGrid}>Fill</Button>
        <Button variant='outlined' onClick={randomizeGrid}>Randomize</Button>
        {playPauseButton}
        {stopButton}
        <div style={{width: '300px'}}>
          <InputSlider
            name='SPEED'
            value={speed}
            step={0.25}
            min={0.25}
            max={10}
            onChange={(n: SetStateAction<number>) => setSpeed(n)}
          />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
