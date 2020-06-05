export class IsomorphicLayout {

    //All rows need to have the same length!

    constructor() {
        this.penta1 = [
            ["C8", "D8", "E8", "G8", "A8", "C8", "D8", "E8"],
            ["E7", "G7", "A7", "C8", "D8", "E8", "G8", "A8"],
            ["A6", "C7", "D7", "E7", "G7", "A7", "C8", "D8"],
            ["D6", "E6", "G6", "A6", "C7", "D7", "E7", "G7"],
            ["G5", "A5", "C6", "D6", "E6", "G6", "A6", "C7"],
            ["C5", "D5", "E5", "G5", "A5", "C6", "D6", "E6"],
            ["E4", "G4", "A4", "C5", "D5", "E5", "G5", "A5"],
            ["A3", "C4", "D4", "E4", "G4", "A4", "C4", "D4"],
            ["D3", "E3", "G3", "A3", "C4", "D4", "E4", "G4"],
            ["G2", "A2", "C3", "D3", "E3", "G3", "A3", "C4"],
            ["C2", "D2", "E2", "G2", "A2", "C3", "D3", "E3"],
            ["E1", "G1", "A1", "C2", "D2", "E2", "G2", "A2"],
            ["A0", "C1", "D1", "E1", "G1", "A1", "C2", "D2"]
        ]

        this.lydian = [
            ["C4", "D4", "E4", "F#4", "G4", "A4", "B4", "C5"],
            ["G3", "A3", "B3", "C4", "D4", "E4", "F#4", "G4"],
            ["E3", "F#3", "G3", "A3", "B3", "C4", "D4", "E4"],
            ["C3", "D3", "E3", "F#3", "G3", "A3", "B3", "C4"],
            ["G2", "A2", "B2", "C3", "D3", "E3", "F#3", "G3"],
            ["E2", "F#2", "G2", "A2", "B2", "C3", "D3", "E3"],
            ["C2", "D2", "E2", "F#2", "G2", "A2", "B2", "C3"],
            ["G1", "A1", "B1", "C2", "D2", "E2", "F#2", "G2"],
            ["E1", "F#1", "G1", "A1", "B1", "C2", "D2", "E2"],
            ["C1", "D1", "E1", "F#1", "G1", "A1", "B1", "C2"],
            ["G0", "A0", "B0", "C1", "D1", "E1", "F#1", "G1"],
            ["E0", "F#0", "G0", "A0", "B0", "C1", "D1", "E1"],
            ["C0", "D0", "E0", "F#0", "G0", "A0", "B0", "C1"]
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
            ["E1", "G1", "B1", "C2", "E2", "G2", "B2", "C3"],
            ["C1", "E1", "G1", "B1", "C2", "E2", "G2", "B2"],
            ["G0", "B0", "C1", "E1", "G1", "B1", "C2", "E2"],
            ["E0", "G0", "B0", "C1", "E1", "G1", "B1", "C2"],
            ["C0", "E0", "G0", "B0", "C1", "E1", "G1", "B1"]
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
            ["E1", "G1", "A1", "C2", "E2", "G2", "A2", "C3"],
            ["C1", "E1", "G1", "A1", "C2", "E2", "G2", "A2"],
            ["G0", "A0", "C1", "E1", "G1", "A1", "C2", "E2"],
            ["E0", "G0", "A0", "C1", "E1", "G1", "A1", "C2"],
            ["C0", "E0", "G0", "A0", "C1", "E1", "G1", "A1"]
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
        //      
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

        this.rows = this.scale.length
        this.collumns = this.scale[0].length
        this.x = Math.round((this.rows - 1) * (this.coordX))
        this.y = Math.round((this.collumns - 1) * (this.coordY))

        return this.scale[this.x][this.y]
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
        for(let i = highestNoteInArray; i < (highestNoteInArray + 5); i++) {
            this.currentArray[n] = this.lydian[i]; 
            n++;
        }
        console.log(this.currentArray);
    }
}