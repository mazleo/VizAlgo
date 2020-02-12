export default class JunctionPoint {
    constructor(point, road) {
        this.point = point;
        this.road = road;
    }

    getPoint() {
        return this.point;
    }

    getRoad() {
        return this.road;
    }
}