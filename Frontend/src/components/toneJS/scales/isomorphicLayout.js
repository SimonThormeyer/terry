export class IsomorphicLayout {

    //All rows need to have the same length!


    constructor() {
        this.penta1 = [
            ["E4", "G4", "A4", "C5", "D5", "E5", "G5", "A5"],
            ["A3", "C4", "D4", "E4", "G4", "A4", "C4", "D4"],
            ["D3", "E3", "G3", "A3", "C4", "D4", "E4", "G4"],
            ["G2", "A2", "C3", "D3", "E3", "G3", "A3", "C4"],
            ["C2", "D2", "E2", "G2", "A2", "C3", "D3", "E3"]
        ]

        this.lydian = [
            ["E4", "F#4", "G4", "A4", "B4", "C5", "D5", "E5"],
            ["A3", "B3", "C4", "D4", "E4", "F#4", "G4", "A4"],
            ["D3", "E3", "F#3", "G3", "A3", "B3", "C4", "D4"],
            ["G2", "A2", "B2", "C3", "D3", "E3", "F#3", "G3"],
            ["C2", "D2", "E2", "F#2", "G2", "A2", "B2", "C3"]
        ]

        this.major7 = [
            ["E4", "G4", "B4", "C5", "E5", "G5", "B5", "C6"],
            ["B3", "C4", "E4", "G4", "B4", "C5", "E5", "G5"],
            ["E3", "G3", "B3", "C4", "E4", "G4", "B4", "C5"],
            ["G2", "B2", "C3", "E3", "G3", "B3", "C4", "E4"],
            ["C2", "E2", "G2", "B2", "C3", "E3", "G3", "B3"]
        ]
        
        this.major6 = [
            ["E4", "G4", "A4", "C5", "E5", "G5", "A5", "C6"],
            ["A3", "C4", "E4", "G4", "A4", "C5", "E5", "G5"],
            ["E3", "G3", "A3", "C4", "E4", "G4", "A4", "C5"],
            ["G2", "A2", "C3", "E3", "G3", "A3", "C4", "E4"],
            ["C2", "E2", "G2", "A2", "C3", "E3", "G3", "A3"]
        ]

        this.scales = [this.major7, this.major6, this.penta1, this.lydian]

        this.scale = this.penta1;
    }

    coordinateToNote(valueX, valueY) {
        // swapping X&Y to map values to scale
        this.coordY = valueX
        this.coordX = valueY

        this.rows = this.scale.length
        this.collumns = this.scale[0].length
        this.x = Math.round((this.rows - 1) * ( this.coordX))
        this.y = Math.round((this.collumns - 1) * (this.coordY))

        return this.scale[this.x][this.y]
    }

    changeScale(value) {
        let lengthOfScales = this.scales.length - 1;
        let normalizeValue = (value + 1) / 2;
        this.scale = this.scales[Math.round(normalizeValue * lengthOfScales)];
    }
}