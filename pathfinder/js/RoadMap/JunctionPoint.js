export default class JunctionPoint {
    constructor(point, road) {
        this.point = point;
        this.road = road;
    }

    isPointEqual(point) {
        if (point.getId() == this.point.getId()) {
            return true;
        }
        else {
            return false;
        }
    }

    getPoint() {
        return this.point;
    }

    getRoad() {
        return this.road;
    }
}