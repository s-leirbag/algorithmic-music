export const DRUMS = {
    crash: '/Drums - One Shots/Cymbals/Crashes/Cymatics - Lofi Crash 1.wav',
    open: '/Drums - One Shots/Cymbals/Open Hihats/Cymatics - Lofi Open Hihat 1.wav',
    snare: '/Drums - One Shots/Snares/Cymatics - Lofi Snare 1 - Csharp.wav',
    kick: '/Drums - One Shots/Kicks/Cymatics - Lofi Kick 1 - C.wav',
    closed: '/Drums - One Shots/Cymbals/Closed Hihats/Cymatics - Lofi Closed Hihat 1.wav',
    ride: '/Drums - One Shots/Cymbals/Rides/Cymatics - Lofi Ride 1.wav',
    perc: '/Drums - One Shots/Percussion/Cymatics - Lofi Percussion 1.wav',
    clap: '/Drums - One Shots/Claps/Cymatics - Lofi Clap 1.wav',
}



const MIDI_SHARP_NAMES = [
    'B#_0',  'C#_1', 'Cx_1', 'D#_1',   'E_1',  'E#_1',  'F#_1', 'Fx_1',  'G#_1', 'Gx_1', 'A#_1', 'B_1',
    'B#_1', 'C#0', 'Cx0', 'D#0', 'E0', 'E#0', 'F#0', 'Fx0', 'G#0', 'Gx0', 'A#0', 'B0',
    'B#0', 'C#1', 'Cx1', 'D#1', 'E1', 'E#1', 'F#1', 'Fx1', 'G#1', 'Gx1', 'A#1', 'B1',
    'B#1', 'C#2', 'Cx2', 'D#2', 'E2', 'E#2', 'F#2', 'Fx2', 'G#2', 'Gx2', 'A#2', 'B2',
    'B#2', 'C#3', 'Cx3', 'D#3', 'E3', 'E#3', 'F#3', 'Fx3', 'G#3', 'Gx3', 'A#3', 'B3',
    'B#3', 'C#4', 'Cx4', 'D#4', 'E4', 'E#4', 'F#4', 'Fx4', 'G#4', 'Gx4', 'A#4', 'B4',
    'B#4', 'C#5', 'Cx5', 'D#5', 'E5', 'E#5', 'F#5', 'Fx5', 'G#5', 'Gx5', 'A#5', 'B5',
    'B#5', 'C#6', 'Cx6', 'D#6', 'E6', 'E#6', 'F#6', 'Fx6', 'G#6', 'Gx6', 'A#6', 'B6',
    'B#6', 'C#7', 'Cx7', 'D#7', 'E7', 'E#7', 'F#7', 'Fx7', 'G#7', 'Gx7', 'A#7', 'B7',
    'B#7', 'C#8', 'Cx8', 'D#8', 'E8', 'E#8', 'F#8', 'Fx8', 'G#8', 'Gx8', 'A#8', 'B8',
    'B#8', 'C#9', 'Cx9', 'D#9', 'E9', 'E#9', 'F#9', 'Fx9'
];
                          

const MIDI_FLAT_NAMES = [
    'C_1', 'Db_1', 'D_1', 'Eb_1', 'Fb_1', 'F_1', 'Gb_1', 'G_1', 'Ab_1', 'A_1', 'Bb_1', 'Cb0',
    'C0', 'Db0', 'D0', 'Eb0', 'Fb0', 'F0', 'Gb0', 'G0', 'Ab0', 'A0', 'Bb0', 'Cb1',
    'C1', 'Db1', 'D1', 'Eb1', 'Fb1', 'F1', 'Gb1', 'G1', 'Ab1', 'A1', 'Bb1', 'Cb2',
    'C2', 'Db2', 'D2', 'Eb2', 'Fb2', 'F2', 'Gb2', 'G2', 'Ab2', 'A2', 'Bb2', 'Cb3',
    'C3', 'Db3', 'D3', 'Eb3', 'Fb3', 'F3', 'Gb3', 'G3', 'Ab3', 'A3', 'Bb3', 'Cb4',
    'C4', 'Db4', 'D4', 'Eb4', 'Fb4', 'F4', 'Gb4', 'G4', 'Ab4', 'A4', 'Bb4', 'Cb5',
    'C5', 'Db5', 'D5', 'Eb5', 'Fb5', 'F5', 'Gb5', 'G5', 'Ab5', 'A5', 'Bb5', 'Cb6',
    'C6', 'Db6', 'D6', 'Eb6', 'Fb6', 'F6', 'Gb6', 'G6', 'Ab6', 'A6', 'Bb6', 'Cb7',
    'C7', 'Db7', 'D7', 'Eb7', 'Fb7', 'F7', 'Gb7', 'G7', 'Ab7', 'A7', 'Bb7', 'Cb8',
    'C8', 'Db8', 'D8', 'Eb8', 'Fb8', 'F8', 'Gb8', 'G8', 'Ab8', 'A8', 'Bb8', 'Cb9',
    'C9', 'Db9', 'D9', 'Eb9', 'Fb9', 'F9', 'Gb9', 'G9'
];

function noteNameToMIDI(noteName: string)  {
    let i;
    let MIDInumber = -1; // default if not found
    // check both arrays for the noteName
    for(i=0; i < MIDI_SHARP_NAMES.length; i++) {
        if( noteName === MIDI_SHARP_NAMES[i] ||
                noteName === MIDI_FLAT_NAMES[i] ) {
            MIDInumber = i;  // found it
        }
    }
    return Number(MIDInumber); // it should be a number already, but...
}

const MAJOR_SCALE = [0,2,4,5,7,9,11];
const MINOR_SCALE = [0,2,3,5,7,8,10];

export function makeScale(keyNameAndOctave: string, type: string) {
	let ALPHA_NAMES = ['A','B','C','D','E','F','G'];
	let startingName = keyNameAndOctave;
	let offset = 0;
	for(let i=0; i<ALPHA_NAMES.length; i++) {
		if(startingName.includes(ALPHA_NAMES[i])) {
			offset = i;
			break;
		}
	}
	let startingNote = noteNameToMIDI(keyNameAndOctave);
	let myScaleFormula = type === 'major' ? MAJOR_SCALE : MINOR_SCALE;
	let myScale = [];
	for(let i=0; i < myScaleFormula.length; i++) {
		if(MIDI_SHARP_NAMES[myScaleFormula[i] + startingNote].includes(ALPHA_NAMES[(offset+i) % ALPHA_NAMES.length])) {
			myScale.push( MIDI_SHARP_NAMES[myScaleFormula[i] + startingNote] );
		} else if(MIDI_FLAT_NAMES[myScaleFormula[i] + startingNote].includes(ALPHA_NAMES[(offset+i) % ALPHA_NAMES.length])) {
			myScale.push( MIDI_FLAT_NAMES[myScaleFormula[i] + startingNote] );
		} else {
			myScale.push("C7"); // high note used to indicate error
		}
	}
	return myScale;
}

const chromaticScale = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const makeChromScale = (octave: number) => chromaticScale.map((note) => note + octave.toString());
export const chromaticNotes = makeChromScale(3).concat(makeChromScale(4));

// Function to get the notes for a chord based on its root note
export function getChord(root: string, scale: string[]) {
    const rootIndex = scale.indexOf(root);
    if (rootIndex === -1) {
        console.error("Root note not found in the scale!");
        return [];
    }

    let notes = [];
    notes.push(scale[rootIndex]);
    notes.push(scale[(rootIndex + 2) % scale.length]);
    notes.push(scale[(rootIndex + 4) % scale.length]);
    // notes.push(scale[(rootIndex + 6) % scale.length]);
    return notes;
}

const progsMaj = new Map([
    ["I-IV-V-I", [1, 4, 5, 1]],
    ["I-vi-IV-V", [1, 6, 4, 5]],
    ["ii-V-I", [2, 5, 1]],
    ["I-IV-vi-V", [1, 4, 6, 5]],
    ["vi-IV-I-V", [6, 4, 1, 5]],
    ["I-V-vi-IV", [1, 5, 6, 4]],
]);

const progsMin = new Map([
    ["i-VII-vi-iv", [1, 7, 6, 4]],
    ["i-vi-IV-V", [1, 6, 4, 5]],
    ["vi-VII-i", [6, 7, 1]],
    ["i-iv-V-i", [1, 4, 5, 1]],
    ["iv-i-VII-vi", [4, 1, 7, 6]],
    // ["iv-vi-i-iv-VII-vi", [4, 6, 1, 4, 7, 6]],
]);

export function getProg(name: string, scale: string[]): {
    root: string;
    notes: string[];
}[] {
    let prog;
    if (progsMaj.has(name)) {
        prog = progsMaj.get(name);
    }
    else {
        prog = progsMin.get(name);
    }
    
    if (!prog) {
        return [{root: '', notes: ['']}];
    }

    return prog.map((n) => {
        return {
            root: scale[n - 1],
            notes: getChord(scale[n - 1], scale),
        };
    });
}

export const progMajNames = Array.from(progsMaj.keys())
export const progMinNames = Array.from(progsMin.keys())

export function randProgName(type: string) {
    const names = type === 'major' ? progMajNames : progMinNames
    return names[Math.floor(Math.random() * names.length)];
}
