import { useEffect, useState } from 'react';
import './App.css';

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import * as Tone from 'tone';
import { Howl } from 'howler';

import { getNextGrid, diagGrid, clearGrid, fillGrid, randGrid } from './GameUtil';

import { getChord, chordProgressions, DRUMS } from './SoundUtil';

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
  nRows: number,
  nCols: number,
  defaultInterval: number,
  speed: number,
  status: string,
}

export default function Grid({ name, nRows, nCols, defaultInterval, speed, status }: GridProps) {
  const [grid, setGrid] = useState(diagGrid(nRows, nCols));
  const [colToPlay, setColToPlay] = useState(0);
  const [notesToPlay, setNotesToPlay] = useState<Note[][]>([]);
  const [chordProg] = useState<string[]>(chordProgressions["I-IV-V-I"]);
  const [chord, setChord] = useState<number>(0);

  useEffect(() => {
    const rawNotes: Note[][] = Array.from({ length: nCols }).map(() => []);
    const now = Tone.now()
    grid.forEach((row, i) => {
      let start = null;
      for (let j = 0; j <= row.length; j++) {
        if (start && (j === row.length || !row[j])) {
          const secInterval = defaultInterval / speed / 1000;
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
    
    notesToPlay[colToPlay].forEach((note) => {
      const sound = new Howl({
        src: [DRUMS['kick']]
      })
      sound.play()
    });

  }, [colToPlay, status]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'play') {
      interval = setInterval(() => {
        setColToPlay((c) => {
          let newC = (c + 1) % nCols;
          if (newC === nCols - 1) {
            setTimeout(() => {
              setGrid((g) => getNextGrid(g));
              setChord((c) => (c + 1) % 3);
            }, defaultInterval / speed / 2);
          }
          return newC;
        });
      }, defaultInterval / speed);
    }
    else if (status === 'stop') {
      setColToPlay(0);
    }

    return () => {
      clearInterval(interval);
    }
  }, [status, speed]);

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
    <Paper sx={{ display: 'flex', flexDirection: 'column', alignItems: 'end' }} elevation={4}>
      <Typography variant='h4' component='h5' width='100%' align='center' >{name}</Typography>
      <table>
        <tbody>
          {Array.from({ length: nRows }).map((_, i) => (
            <tr key={i}>
              {Array.from({ length: nCols }).map((_, j) => (
                <Cell key={j} active={grid[i][j]} playing={j === colToPlay} onClick={() => {handleToggle(i, j)}} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <ButtonGroup variant="contained" aria-label="Basic button group">
        <Button variant='outlined' onClick={() => setGrid(clearGrid(nRows, nCols))}>Clear</Button>
        <Button variant='outlined' onClick={() => setGrid(fillGrid(nRows, nCols))}>Fill</Button>
        <Button variant='outlined' onClick={() => setGrid(randGrid(nRows, nCols, 0.3))}>Randomize</Button>
      </ButtonGroup>
    </Paper>
  );
}