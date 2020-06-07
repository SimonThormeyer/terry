export class IsomorphicLayout {

    //All rows need to have the same length!

    constructor() {

        this.lydian = [
            ["G5", "A5", "B5", "C6", "D6", "E6", "F#6", "G6"],
            ["E5", "F#5", "G5", "A5", "B5", "C6", "D6", "E6"],
            ["C5", "D5", "E5", "F#5", "G5", "A5", "B5", "C6"],
            ["G4", "A4", "B4", "C5", "D5", "E5", "F#5", "G5"],
            ["E4", "F#4", "G4", "A4", "B4", "C5", "D5", "E5"],
            ["C4", "D4", "E4", "F#4", "G4", "A4", "B4", "C5"],
            ["G3", "A3", "B3", "C4", "D4", "E4", "F#4", "G4"],
            ["E3", "F#3", "G3", "A3", "B3", "C4", "D4", "E4"],
            ["C3", "D3", "E3", "F#3", "G3", "A3", "B3", "C4"]
        ]

        this.penta1 = [
            ["G5", "A5", "C6", "D6", "E6", "G6", "A6", "C7"],
            ["E5", "G5", "A5", "C6", "D6", "E6", "G6", "A6"],
            ["C5", "D5", "E5", "G5", "A5", "C6", "D6", "E6"],
            ["G4", "A4", "C5", "D5", "E5", "G5", "A5", "C6"],
            ["E4", "G4", "A4", "C5", "D5", "E5", "G5", "A5"],
            ["C4", "D4", "E4", "G4", "A4", "C5", "D5", "E5"],
            ["G3", "A3", "C4", "D4", "E4", "G4", "A4", "C5"],
            ["E3", "G3", "A3", "C4", "D4", "E4", "G4", "A4"],
            ["C3", "D3", "E3", "G3", "A3", "C4", "D4", "E4"]
        ]

        this.major6 = [
            ["C4", "E4", "G4", "A4", "C5", "E5", "G5", "A5"],
            ["G3", "A3", "C4", "E4", "G4", "A4", "C5", "E5"],
            ["E3", "G3", "A3", "C4", "E4", "G4", "A4", "C5"],
            ["C3", "E3", "G3", "A3", "C4", "E4", "G4", "A4"],
            ["G2", "A2", "C3", "E3", "G3", "A3", "C4", "E4"],
            ["E2", "G2", "A2", "C3", "E3", "G3", "A3", "C4"],
            ["C2", "E2", "G2", "A2", "C3", "E3", "G3", "A3"],
            ["G1", "A1", "C2", "E2", "G2", "A2", "C3", "E3"],
            ["E1", "G1", "A1", "C2", "E2", "G2", "A2", "C3"]
        ]

        this.major7 = [
            ["C4", "E4", "G4", "B4", "C5", "E5", "G5", "B5"],
            ["G3", "B3", "C4", "E4", "G4", "B4", "C5", "E5"],
            ["E3", "G3", "B3", "C4", "E4", "G4", "B4", "C5"],
            ["C3", "E3", "G3", "B3", "C4", "E4", "G4", "B4"],
            ["G2", "B2", "C3", "E3", "G3", "B3", "C4", "E4"],
            ["E2", "G2", "B2", "C3", "E3", "G3", "B3", "C4"],
            ["C2", "E2", "G2", "B2", "C3", "E3", "G3", "B3"],
            ["G1", "B1", "C2", "E2", "G2", "B2", "C3", "E3"],
            ["E1", "G1", "B1", "C2", "E2", "G2", "B2", "C3"]
        ]

        //switch(mood){
        //    case major:
                this.scales = [this.major7, this.major6, this.penta1, this.lydian];
        //    break;
        //    case minor:
        //        this.scales = [this.minor7, this.minor6, this.penta2, this.dorian]
        //    break;
        //    case fourth:
        //        this.scales = [this.fourth1, this.fourth2, this.fourth3, this.fourth4]
        //    break;
        //    default:
        //        this.scales = [this.major7, this.major6, this.penta1, this.lydian];
        //}

        this.currentArray = [
            ["E4", "G4", "A4", "C5", "D5", "E5", "G5", "A5"],
            ["A3", "C4", "D4", "E4", "G4", "A4", "C4", "D4"],
            ["D3", "E3", "G3", "A3", "C4", "D4", "E4", "G4"],
            ["G2", "A2", "C3", "D3", "E3", "G3", "A3", "C4"],
            ["C2", "D2", "E2", "G2", "A2", "C3", "D3", "E3"]
        ]

        this.scale = this.currentArray;

    }

    coordinateToNote(valueX, valueY) {
        // swapping X&Y to map values to scale
        this.coordY = valueX
        this.coordX = valueY

        this.rows = this.currentArray.length
        this.collumns = this.currentArray[0].length
        this.x = Math.round((this.rows - 1) * (this.coordX))
        this.y = Math.round((this.collumns - 1) * (this.coordY))

        return this.currentArray[this.x][this.y]
    }

    changeScale(value) {
        let lengthOfScales = this.scales.length - 1;
        let normalizeValue = (value + 1) / 2;
        this.scale = this.scales[Math.round(normalizeValue * lengthOfScales)];
        console.log("Scale: " + this.scale);
    }

    changeOctave(value) {
        let normalizeInvertedValue = 1 - (value + 1)/2;
        let highestNoteInArray = Math.round(normalizeInvertedValue * 5);
        let n = 0;
        for(let i = highestNoteInArray; i < (highestNoteInArray + 5); i++) {
            this.currentArray[n] = this.scale[i]; 
            n++;
        }
        console.log("Array: " + this.currentArray);
    }
}