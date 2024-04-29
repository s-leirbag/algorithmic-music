import { useState, SetStateAction } from 'react';
import './App.css';

import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { PlayCircle, PauseCircle, StopCircle, ReplayCircleFilled } from '@mui/icons-material';
import { InputSlider } from './Input';

import Grid from './Grid';

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
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) =>
          theme.unstable_sx({
            p: 2,
            gap: 2,
          }),
      },
    },
  },
});


const defaultInterval = 1000;

function App() {
  // status play, pause, stop
  const [status, setStatus] = useState('stop');
  const [speed, setSpeed] = useState(5);

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
        <Paper sx={{ display: 'flex', alignItems: 'end' }} elevation={4}>
          <Typography variant='h3' component='h4' sx={{ mr: 4 }} >Musical Game of Life</Typography>
          <Typography variant='body1' component='p' sx={{ mb: 1, mr: 1 }}>
            Make some tunes! -Gabriel Shiu
          </Typography>
          <Typography variant='body1' component='p' sx={{ mb: 1, ml: 'auto', mr: 2 }}>
            GitHub repo: <Link href='https://github.com/s-leirbag/algorithmic-music/' target="_blank" rel="noopener">click</Link>
          </Typography>
        </Paper>

        <Paper sx={{ display: 'flex' }} elevation={4}>
            {playPauseButton}
            {stopButton}
            <InputSlider
              name='Speed'
              value={speed}
              step={0.25}
              min={0.25}
              max={10}
              width='300px'
              onChange={(n: SetStateAction<number>) => setSpeed(n)}
            />
        </Paper>

        <Stack direction='row' spacing={2}>
          <Grid
            name='Melody'
            defaultInterval={defaultInterval}
            speed={speed}
            status={status}
          />
          <Grid
            name='Drums'
            defaultInterval={defaultInterval}
            speed={speed}
            status={status}
            defaultVolume={25}
          />
        </Stack>
      </div>
    </ThemeProvider>
  );
}

export default App;
