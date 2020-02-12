export default class PointHashGridNode {
    constructor(rKey, cKey, point) {
        this.rKey = rKey;
        this.cKey = cKey;
        this.point = point;
        this.next = null;
    }

    getRKey() {
        return this.rKey;
    }

    getCKey() {
        return this.cKey;
    }

    getPoint() {
        return this.point;
    }

    equalsPoint(point) {
        return (
            this.point.getLatitude() == point.getLatitude()
            && this.point.getLongitude() == point.getLongitude()
        );
    }
}