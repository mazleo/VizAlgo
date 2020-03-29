export default class Edge {
    constructor(id, endPoints, consecutivePoints) {
        this.id = id;
        this.endPoints = endPoints;
        this.consecutivePoints = consecutivePoints;
        this.distance = consecutivePoints.length - 1;
        this.points = this.generatePointsMap();
    }

    generatePointsMap() {
        var pointsKeyValueArray = this.generatePointsKeyValueArrayFromConsecutivePoints();
        var newPointsMap = new Map(pointsKeyValueArray);

        return newPointsMap;
    }

    generatePointsKeyValueArrayFromConsecutivePoints() {
        var pointsKeyValueArray = new Array();
        for (var index = 0; index < this.consecutivePoints.length; index++) {
            var currentPoint = this.consecutivePoints[index]
            var newKeyValuePair = this.generatePointsKeyValuePairFromPoint(currentPoint);
            pointsKeyValueArray.push(newKeyValuePair);
        }
        return pointsKeyValueArray;
    }

    generatePointsKeyValuePairFromPoint(point) {
        var keyValuePair = new Array();
        keyValuePair[0] = point.getId();
        keyValuePair[1] = point;

        return keyValuePair;
    }

    getId() {
        return this.id;
    }

    getEndPoints() {
        return this.endPoints;
    }

    getConsecutivePoints() {
        return this.consecutivePoints;
    }

    getPoints() {
        return this.points;
    }

    getDistance() {
        return this.distance;
    }

    setId(id) {
        this.id = id;
    }

    setEndPoints(endPoints) {
        this.endPoints = endPoints;
    }

    setConsecutivePoints(consecutivePoints) {
        this.consecutivePoints = consecutivePoints;
        this.updateDistance();
        this.updatePoints();
    }

    updateDistance() {
        this.distance = this.consecutivePoints.length - 1;
    }

    updatePoints() {
        this.points = this.generatePointsMap();
    }

    /*
    getPointFromLocation(latitude, longitude) {
        return this.points.get(latitude + longitude);
    }

    getIntersection(point) {
        if (this.intersections[0].equalsPoint(point)) {
            return this.intersections[0];
        }
        else if (this.intersections[1].equalsPoint(point)) {
            return this.intersections[1];
        }
        else {
            return null;
        }
    }

    hasIntersection(intersection) {
        if (this.intersections[0].equalsPoint(intersection) || this.intersections[1].equalsPoint(intersection)) {
            return true;
        }
        else {
            return false;
        }
    }
    */

    hasPoint(point) {
        return this.points.has(point.getId());
    }
}