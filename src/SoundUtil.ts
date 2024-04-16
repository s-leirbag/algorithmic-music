export const SCALE_REV = ['B4', 'A4', 'G4', 'F4', 'E4', 'D4', 'C4'];
export const SCALE = SCALE_REV.reverse();

// Function to get the notes for a chord based on its root note
export function getChord(root: string, type: string) {
    const rootIndex = SCALE.indexOf(root);
    if (rootIndex === -1) {
        console.error("Root note not found in the scale!");
        return [];
    }

    let notes = [];
    switch (type) {
        case 'major':
            notes.push(SCALE[rootIndex]);
            notes.push(SCALE[(rootIndex + 2) % SCALE.length]);
            notes.push(SCALE[(rootIndex + 4) % SCALE.length]);
            break;
        case 'minor':
            notes.push(SCALE[rootIndex]);
            notes.push(SCALE[(rootIndex + 1) % SCALE.length]);
            notes.push(SCALE[(rootIndex + 4) % SCALE.length]);
            break;
        case 'diminished':
            notes.push(SCALE[rootIndex]);
            notes.push(SCALE[(rootIndex + 1) % SCALE.length]);
            notes.push(SCALE[(rootIndex + 3) % SCALE.length]);
            break;
        // Add more chord types as needed
        default:
            console.error("Invalid chord type!");
            return [];
    }
    return notes;
}

// Function to play a chord
function playChord(chord: string[]) {
    for (let note of chord) {
        console.log("Playing", note);
        // Code to play the note (e.g., using a music library or hardware)
    }
}

// Chord progressions
export const chordProgressions = {
    "I-IV-V-I": ["C4", "F4", "G4", "C4"],
    "I-vi-IV-V": ["C4", "A4", "F4", "G4"],
    "ii-V-I": ["D4", "G4", "C4"],
    "I-IV-vi-V": ["C4", "F4", "A4", "G4"],
    "vi-IV-I-V": ["A4", "F4", "C4", "G4"]
};

// Function to play a chord progression
function playChordProgression(progression: string[]) {
    for (let chord of progression) {
        const notes = getChord(chord, 'major');
        // console.log(notes);
        playChord(notes);
    }
}

// Example usage
// console.log("Playing chord progression 'I-IV-V-I'");
// playChordProgression(chordProgressions["I-IV-V-I"]);

export const DRUMS = {
    kick: '/Drums - One Shots/Kicks/Cymatics - Lofi Kick 1 - C.wav',
    clap: '/Drums - One Shots/Claps/Cymatics - Lofi Clap 1.wav',
    closed: '/Drums - One Shots/Cymbals/Closed Hihats/Cymatics - Lofi Closed Hihat 1.wav',
    crash: '/Drums - One Shots/Cymbals/Crashes/Cymatics - Lofi Crash 1.wav',
    open: '/Drums - One Shots/Cymbals/Open Hihats/Cymatics - Lofi Open Hihat 1.wav',
    ride: '/Drums - One Shots/Cymbals/Rides/Cymatics - Lofi Ride 1.wav',
    snare: '/Drums - One Shots/Snares/Cymatics - Lofi Snare 1 - C#.wav',
    perc: '/Drums - One Shots/Percussion/Cymatics - Lofi Percussion 1.wav',
}