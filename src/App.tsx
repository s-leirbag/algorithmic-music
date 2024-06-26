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
      // primary: '#79F2E6',
      // secondary: '#9c9c9c',
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


function App() {
  // status play, pause, stop
  const [status, setStatus] = useState('stop');
  const [speed, setSpeed] = useState(90);

  const playPauseButton = status === 'play' ? (
    <Button size='large' variant='contained' onClick={() => setStatus('pause')}>
      <PauseCircle fontSize='large' sx={{mr: 1}}/>
      <Typography variant='h5' component='h4' >Pause</Typography>
    </Button>
  ) : (
    <Button size='large' variant='contained' onClick={() => setStatus('play')}>
      <PlayCircle fontSize='large' sx={{mr: 1}}/>
      <Typography variant='h5' component='h4' >Play</Typography>
    </Button>
  );

  const stopButton = status === 'play' ? (
    <Button size='large' variant='outlined' onClick={() => setStatus('stop')}>
      <StopCircle fontSize='large' sx={{mr: 1}}/>
      <Typography variant='h5' component='h4' >Stop</Typography>
    </Button>
  ) : (
    <Button size='large' variant='outlined' onClick={() => setStatus('stop')}>
      <ReplayCircleFilled fontSize='large' sx={{mr: 1}}/>
      <Typography variant='h5' component='h4' >Reset</Typography>
    </Button>
  );

  const onUnsyncEdit = () => {
    setStatus('stop');
    setTimeout(() => setStatus('play'), 25);
  };

  return (
    <ThemeProvider theme={theme}>
    <CssBaseline />
      <div className="App">
        <Paper sx={{ display: 'flex', alignItems: 'end' }} elevation={4}>
          <Typography color='white' variant='h3' component='h4' sx={{ mr: 'auto' }} >
            Musical Game of Life
            <Typography variant='body1' component='p' sx={{ mr: 2 }}>
              {/* Make some tunes! -Gabriel Shiu <br/> */}
              <Link color='secondary' href='https://github.com/s-leirbag/algorithmic-music/' target="_blank" rel="noopener">GitHub repo</Link>
            </Typography>
          </Typography>
          <InputSlider
            name='BPM'
            value={speed}
            step={10}
            min={40}
            max={200}
            width='300px'
            onChange={(n: SetStateAction<number>) => setSpeed(n)}
          />
          {playPauseButton}
          {stopButton}
        </Paper>

        <Stack direction='row' spacing={2} sx={{ height: 'calc(100vh - 48px - 112px)' }}>
          <Grid
            name='Melody'
            {...{speed, status, onUnsyncEdit}}
          />
          <Grid
            name='Drums'
            {...{speed, status, onUnsyncEdit}}
            defaultVolume={15}
          />
        </Stack>
      </div>
    </ThemeProvider>
  );
}

export default App;
