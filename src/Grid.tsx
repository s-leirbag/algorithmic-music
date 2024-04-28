import { useEffect, useState } from 'react';
import './App.css';

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography';

import * as Tone from 'tone';
import { Howl } from 'howler';

import { InputSlider } from './Input';

import { gridToString, presets, presetNames, resizeGrid, getNextGrid, diagGrid, clearGrid, fillGrid, randGrid } from './GameUtil';
import { getChord, progs, progNames, randProgName, DRUMS } from './SoundUtil';

const synth = new Tone.PolySynth(Tone.Synth).toDestination();

type Note = {
  note: string;
  time: number;
  length: number;
}

function Cell({active, playing, onClick}: {active: boolean, playing: boolean, onClick: () => void}) {
  return (
    <td onClick={(e) => onClick()}>
      <div className={`cell ${active ? 'active' : ''} ${playing ? 'playing' : ''}`}/>
    </td>
  );
}

interface GridProps {
  name: string,
  defaultNRows?: number,
  defaultNCols?: number,
  defaultInterval: number,
  speed: number,
  status: string,
}

export default function Grid({ name, defaultNRows, defaultNCols, defaultInterval, speed, status }: GridProps) {
  const [nRows, setNRows] = useState(defaultNRows || 5);
  const [nCols, setNCols] = useState(defaultNCols || 8);
  const [grid, setGrid] = useState(randGrid(nRows, nCols));
  const [colToPlay, setColToPlay] = useState(0);
  const [notesToPlay, setNotesToPlay] = useState<Note[][]>([]);
  const [progName, setProgName] = useState<string>(randProgName());
  const [progChords, setProgChords] = useState<string[]>(progs.get(progName) as string[]);
  const [chordInd, setChordInd] = useState<number>(0);
  const [mode, setMode] = useState<string>(name === 'Melody' ? 'step' : 'instant');
  const [volume, setVolume] = useState<number>(50);

  // Write notes
  // And if on instant mode, play
  useEffect(() => {
    const rawNotes: Note[][] = Array.from({ length: nCols }).map(() => []);
    const now = Tone.now()
    const secInterval = defaultInterval / speed / 1000;

    if (mode === 'step') {
      grid.forEach((row, i) => {
        let start = null;
        for (let j = 0; j <= row.length; j++) {
          if (start && (j === row.length || !row[j])) {
            const note = getChord(progChords[chordInd], 'major')[i % 3];
            const drum = Object.values(DRUMS)[i % Object.values(DRUMS).length];
            rawNotes[start].push({
              note: name === 'Melody' ? note : drum,
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
    } else {
      // mode === 'instant'
      grid.forEach((row, i) => {
        if (row.reduce((acc, b) => acc || b, false)) {
          const note = getChord(progChords[chordInd], 'major')[i % 3];
          const drum = Object.values(DRUMS)[i];
          rawNotes[0].push({
            note: name === 'Melody' ? note : drum,
            time: now,
            length: secInterval,
          });
        }
      });
    }

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
    if (mode === 'instant') {
      playNotes(uniqueNotes[0]);
    }
  }, [grid, speed]);

  useEffect(() => {
    const SYNTH_MIN = -12;
    const SYNTH_MAX = 5;
    synth.volume.value = SYNTH_MIN + (SYNTH_MAX - SYNTH_MIN) * volume / 100;
  }, [volume])

  // play given notes
  const playNotes = (notes: Note[]) => {
    if (volume === 0) return;

    notes.forEach((note) => {
      if (name === 'Melody') {
        synth.triggerAttackRelease(note.note, note.length);
      }
      else {
        const sound = new Howl({
          src: [note.note],
          volume: volume / 100,
        })
        setTimeout(() => {
          sound.play();
        }, 100);
      }
    });
  }

  // Play notes when colToPlay changes
  useEffect(() => {
    if (status !== 'play' || mode !== 'step') return;

    playNotes(notesToPlay[colToPlay])
  }, [colToPlay, status]);

  // Change state, set colToPlay interval based on speed
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'play') {
      if (mode === 'step') {
        interval = setInterval(() => {
          setColToPlay((c) => {
            let newC = (c + 1) % nCols;
            if (newC === nCols - 1) {
              setTimeout(() => {
                setGrid((g) => getNextGrid(g));
                setChordInd((c) => (c + 1) % 3);
              }, defaultInterval / speed / 2);
            }
            return newC;
          });
        }, defaultInterval / speed);
      } else {
        // mode === 'instant'
        interval = setInterval(() => {
          setGrid((g) => getNextGrid(g));
          setChordInd((c) => (c + 1) % 3);
        }, defaultInterval / speed);
      }
    }
    else if (status === 'stop') {
      setColToPlay(0);
    }

    return () => clearInterval(interval);
  }, [status, speed, nCols]);

  // Toggle a cell
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
    <Paper sx={{ display: 'flex', flexDirection: 'column' }} elevation={4}>
      <Typography variant='h5' component='h5' width='100%' align='center' >{name}</Typography>
      <table>
        <tbody>
          {Array.from({ length: nRows }).map((_, i) => (
            <tr key={i}>
              {Array.from({ length: nCols }).map((_, j) => (
                <Cell key={j} active={grid[i][j]} playing={mode === 'step' ? j === colToPlay : grid[i][j]} onClick={() => {handleToggle(i, j)}} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <ButtonGroup variant="contained" aria-label="Basic button group" sx={{marginX: 'auto'}}>
        <Button variant='outlined' onClick={() => setGrid(clearGrid(nRows, nCols))}>Clear</Button>
        <Button variant='outlined' onClick={() => setGrid(fillGrid(nRows, nCols))}>Fill</Button>
        <Button variant='outlined' onClick={() => setGrid(randGrid(nRows, nCols, 0.3))}>Randomize</Button>
      </ButtonGroup>
      <Stack direction='row' spacing={2} alignItems="center" justifyContent='center'>
        <Typography variant='body1' component='p' align='center' >Use Preset: </Typography>
        <Select
          defaultValue={'Preset'}
          onChange={(e) => {
            const res = presets.get(e.target.value)?.call({}, nRows, nCols);
            if (res) {
              if (res.newNCols) {
                setNCols(res.newNCols);
              }
              if (res.newNRows) {
                setNRows(res.newNRows);
              }
              setGrid(res.grid);
            }
          }}
        >
          <MenuItem value='Preset' disabled>
            <em>None</em>
          </MenuItem>
          {presetNames.map((name) => <MenuItem value={name} key={name}>{name}</MenuItem>)}
        </Select>
      </Stack>
      <Button variant='outlined' onClick={() => console.log(gridToString(grid))}>Log Grid</Button>
      <InputSlider
        name='Rows'
        value={nRows}
        min={1}
        max={32}
        onChange={(n: number) => {setGrid(resizeGrid(grid, n, nCols)); setNRows(n);}}
      />
      <InputSlider
        name='Columns'
        value={nCols}
        min={1}
        max={32}
        onChange={(n: number) => {setGrid(resizeGrid(grid, nRows, n)); setNCols(n)}}
      />
      <InputSlider
        name='Volume'
        value={volume}
        min={0}
        max={100}
        onChange={(n: number) => setVolume(n)}
      />
      {name === 'Melody' ? (
        <>
          <Typography variant='body1' component='p' width='100%' align='center' >Chord: {progChords[chordInd]}</Typography>
          <Stack direction='row' spacing={2} alignItems="center" justifyContent='center'>
            <Typography variant='body1' component='p' align='center' >Progression: </Typography>
            <Select
              value={progName}
              onChange={(e) => {setProgName(e.target.value); setProgChords(progs.get(e.target.value) as string[])}}
            >
              {progNames.map((name) => <MenuItem value={name} key={name}>{name}</MenuItem>)}
            </Select>
          </Stack>
        </>
      ) : ''}
    </Paper>
  );
}