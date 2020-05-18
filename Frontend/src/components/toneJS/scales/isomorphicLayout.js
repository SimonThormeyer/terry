

export class IsomorphicLayout{

    constructor() {
    this.scale = [
        ["C5","D5","E5","G5","A5"],
        ["C4","D4","E4","G4","A4"],
        ["C3","D3","E3","G3","A3"],
        ["C2","D2","E2","G2","A2"],
        ["C1","D1","E1","G1","A1"]
    ]
     }

    coordinateToNote(valueX, valueY){
        this.rows = this.scale.length
        this.collumns = this.scale[0].length

        this.x = Math.round((this.rows-1)* valueX)
        this.y = Math.round((this.collumns-1) * valueY)

        this.note = String(this.scale[this.y][this.x])
        return this.note
    }
}