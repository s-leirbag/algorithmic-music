import { useEffect, useState, SetStateAction } from 'react';
import { getChord, chordProgressions } from './Util.mjs';
import './App.css';

import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
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


const NUM_ROWS = 7;
const NUM_COLS = 8;
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
  length: number;
}

function App() {
  const defaultGrid = Array.from({ length: NUM_ROWS }).map(() => Array.from({ length: NUM_COLS }).map(() => false));
  defaultGrid.forEach((row, i) => {
    row[i] = true;
  });

  const [grid, setGrid] = useState(defaultGrid);
  // status play, pause, stop
  const [status, setStatus] = useState('stop');
  const [speed, setSpeed] = useState(3);
  const [colToPlay, setColToPlay] = useState(0);
  const [notesToPlay, setNotesToPlay] = useState<Note[][]>([]);
  const [chordProg] = useState<string[]>(chordProgressions["I-IV-V-I"]);
  const [chord, setChord] = useState<number>(0);

  useEffect(() => {
    const rawNotes: Note[][] = Array.from({ length: NUM_COLS }).map(() => []);
    const now = Tone.now()
    grid.forEach((row, i) => {
      let start = null;
      for (let j = 0; j <= row.length; j++) {
        if (start && (j === row.length || !row[j])) {
          const secInterval = DEFAULT_INTERVAL / speed / 1000;
          rawNotes[start].push({
            note: getChord(chordProg[chord], 'major')[i % 3],
            time: now + secInterval * j,
            length: secInterval * (j - start),
          });
          start = null;
        }
        else if (!start && row[j]) {
          start = j;
        }
      }
    });

    const uniqueNotes = [];
    for (const col of rawNotes) {
      const map = new Map();
      for (const note of col) {
        if (!map.has(note.note) || map.get(note.note).length < note.length) {
          map.set(note.note, note);
        }
      }
      uniqueNotes.push(Array.from(map.values()));
    }

    setNotesToPlay(uniqueNotes);
  }, [grid, speed]);

  useEffect(() => {
    if (status !== 'play') {
      return;
    }

    notesToPlay[colToPlay].forEach((note) => {
      synth.triggerAttackRelease(note.note, note.length);
    });
  }, [colToPlay, status]);

  useEffect(() => {
    const getNeighborCount = (i: number, j: number, grid: boolean[][]) => {
      let count = 0;
      for (let row = i - 1; row <= i + 1; row++) {
        for (let col = j - 1; col <= j + 1; col++) {
          if (row >= 0 && row < NUM_ROWS && col >= 0 && col < NUM_COLS && !(row === i && col === j)) {
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

    const getNextGrid = (grid: boolean[][]) => {
      return grid.map((row, rowIndex) =>
        row.map((cell, cellIndex) => getNextCellState(rowIndex, cellIndex, grid))
      );
    };
    
    let interval: NodeJS.Timeout;
    if (status === 'play') {
      interval = setInterval(() => {
        setColToPlay((c) => {
          let newC = (c + 1) % NUM_COLS;
          if (newC === NUM_COLS - 1) {
            setTimeout(() => {
              setGrid((g) => getNextGrid(g));
              setChord((c) => (c + 1) % 3);
            }, DEFAULT_INTERVAL / speed / 2);
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
      row.map(() => Math.random() < 0.3)
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
        <Paper sx={{ m: 2, p: 2, display: 'flex', alignItems: 'end' }} elevation={4}>
          <Typography variant='h3' component='h4' sx={{ mr: 4 }} >Musical Game of Life</Typography>
          <Typography variant='body1' component='p' sx={{ mb: 1, mr: 1 }}>
            Make some tunes! -Gabriel Shiu
          </Typography>
          {/* <Typography variant='body1' component='p' sx={{ mb: 1 }}>
            HU 3900 Creating Algorithmic Music Capstone
          </Typography> */}
          <Typography variant='body1' component='p' sx={{ mb: 1, ml: 'auto', mr: 2 }}>
            GitHub repo: <Link href='https://github.com/s-leirbag/algorithmic-music/' target="_blank" rel="noopener">click</Link>
          </Typography>
        </Paper>
        <table>
          <tbody>
            {Array.from({ length: NUM_ROWS }).map((_, i) => (
              <tr key={i}>
                {Array.from({ length: NUM_COLS }).map((_, j) => (
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
