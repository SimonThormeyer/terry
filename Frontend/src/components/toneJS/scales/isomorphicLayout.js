export class IsomorphicLayout {

    //All rows need to have the same length!

    constructor() {

        this.lydian = [
            ["F#6", "G6", "A6", "B6", "C7", "D7", "E7", "F#7"],
            ["C6", "D6", "E6", "F#6", "G6", "A6", "B6", "C7"],
            ["G5", "A5", "B5", "C6", "D6", "E6", "F#6", "G6"],
            ["D5", "E5", "F#5", "G5", "A5", "B5", "C6", "D6"],
            ["A4", "B4", "C5", "D5", "E5", "F#5", "G5", "A5"],
            ["E4", "F#4", "G4", "A4", "B4", "C5", "D5", "E5"],
            ["B3", "C4", "D4", "E4", "F#4", "G4", "A4", "B4"],
            ["F#3", "G3", "A3", "B3", "C4", "D4", "E4", "F#4"],
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
            ["G5", "A5", "C6", "E6", "G6", "A6", "C7", "E7"],
            ["E5", "G5", "A5", "C6", "E6", "G6", "A6", "C7"],
            ["C5", "E5", "G5", "A5", "C6", "E6", "G6", "A6"],
            ["G4", "A4", "C5", "E5", "G5", "A5", "C6", "E6"],
            ["E4", "G4", "A4", "C5", "E5", "G5", "A5", "C6"],
            ["C4", "E4", "G4", "A4", "C5", "E5", "G5", "A5"],
            ["G3", "A3", "C4", "E4", "G4", "A4", "C5", "E5"],
            ["E3", "G3", "A3", "C4", "E4", "G4", "A4", "C5"],
            ["C3", "E3", "G3", "A3", "C4", "E4", "G4", "A4"]
        ]

        this.fourth = [
            ["D5", "G6", "C6", "F#6", "B7", "E7", "A8", "D7"],
            ["C4", "F#4", "B4", "E5", "A5", "D6", "G6", "C7"],
            ["B5", "E5", "A5", "D6", "G6", "C7", "F#7", "B8"],
            ["A4", "D5", "G5", "C5", "F#6", "B6", "E7", "A7"],
            ["G3", "C4", "F#4", "B4", "E5", "A5", "D6", "G6"],
            ["F#4", "B4", "E4", "A5", "D5", "G6", "C6", "F#7"],
            ["E3", "A3", "D4", "G4", "C5", "F#5", "B5", "E6"],
            ["D3", "G3", "C4", "F#4", "B5", "E5", "A5", "D6"],
            ["C3", "F#3", "B3", "E4", "A4", "D5", "G5", "C6"]
        ]

        //switch(mood){
        //    case major:
                this.scales = [this.fourth, this.major6, this.penta1, this.lydian];
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
        this.controlValue = 0;
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
    }

    changeOctave(value) {
        let normalizeInvertedValue = 1 - (value + 1)/2;
        let highestNoteInArray = Math.round(normalizeInvertedValue * 5);
        let n = 0;
        if(this.controlValue !== highestNoteInArray) {
            this.controlValue = highestNoteInArray;
            for(let i = highestNoteInArray; i < (highestNoteInArray + 5); i++) {
                this.currentArray[n] = this.scale[i]; 
                n++;
            }
        }
    }
}