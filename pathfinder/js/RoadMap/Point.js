export default class Point {
    constructor(id, latitude, longitude) {
        this.id = id;
        this.latitude = latitude;
        this.longitude = longitude;
        this.containingRoad = null;
    }

    getId() {
        return this.id;
    }

    getLatitude() {
        return this.latitude;
    }

    getLongitude() {
        return this.longitude;
    }

    getContainingRoad() {
        return this.containingRoad;
    }

    setContainingRoad(containingRoad) {
        this.containingRoad = containingRoad;
    }

    equals(point) {
        if (this.id == point.getId() && this.latitude == point.getLatitude() && this.longitude == point.getLongitude()) {
            return true;
        }
        else {
            return false;
        }
    }
}