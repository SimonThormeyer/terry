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


        this.scale = this.penta1
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

}