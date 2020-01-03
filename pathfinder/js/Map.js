class Point {
    constructor(id, latitude, longitude) {
        this.id = id;
        this.latitude = latitude;
        this.longitude = longitude;
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
    equals(point) {
        if (this.id == point.getId() && this.latitude == point.getLatitude() && this.longitude == point.getLongitude()) {
            return true;
        }
        else {
            return false;
        }
    }
}
class Intersection extends Point {
    constructor(point) {
        super(point.getId(), point.getLatitude(), point.getLongitude());
    }
    setRoads(roads) {
        this.roads = roads;
    }
    getRoads() {
        return this.roads;
    }
    equalsPoint(point) {
        if (this.id == point.getId() && this.latitude == point.getLatitude() && this.longitude == point.getLongitude()) {
            return true;
        }
        else {
            return false;
        }
    }
}
class Edge {
    constructor(id, intersections, consecutivePoints) {
        this.id = id;
        this.intersections = intersections;
        this.consecutivePoints = consecutivePoints;
        this.distance = consecutivePoints.length;
        this.points = this.generatePointsMap();
    }
    generatePointsKeyValuePairFromPoint(point) {
        var keyValuePair = new Array();
        keyValuePair[0] = point.getLatitude() + point.getLongitude();
        keyValuePair[1] = point;

        return keyValuePair;
    }
    generatePointsKeyValueArrayFromConsecutivePoints() {
        var pointsKeyValueArray = new Array();
        for (var index = 0; index < this.distance; index++) {
            var currentPoint = this.consecutivePoints[index]
            var newKeyValuePair = this.generatePointsKeyValuePairFromPoint(currentPoint);
            pointsKeyValueArray.push(newKeyValuePair);
        }
        return pointsKeyValueArray;
    }
    generatePointsMap() {
        var pointsKeyValueArray = this.generatePointsKeyValueArrayFromConsecutivePoints();
        var newPointsMap = new Map(pointsKeyValueArray);

        return newPointsMap;
    }
    getId() {
        return this.id;
    }
    getIntersections() {
        return this.intersections;
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
    setIntersections(intersections) {
        this.intersections = intersections;
    }
    setConsecutivePoints(consecutivePoints) {
        this.consecutivePoints = consecutivePoints;
        this.updateDistance();
        this.updatePoints();
    }
    updateDistance() {
        this.distance = this.consecutivePoints.length;
    }
    updatePoints() {
        this.points = this.generatePointsMap();
    }
    hasIntersection(intersection) {
        if (this.intersections[0].equalsPoint(intersection) || this.intersections[1].equalsPoint(intersection)) {
            return true;
        }
        else {
            return false;
        }
    }
    hasPoint(point) {
        var targetPoint = this.points.get(point.getLatitude() + point.getLongitude());
        return targetPoint != null && targetPoint.equals(point) ? true : false;
    }
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
}
class Road {
    STARTING_EDGE_PROB = 0.8;
    TOP_STARTING_EDGE = 0;
    RIGHT_STARTING_EDGE = 1;
    BOTTOM_STARTING_EDGE = 2;
    LEFT_STARTING_EDGE = 3;
    LEFT_EDGE_LOWER_BOUND_ANGLE = -89;
    LEFT_EDGE_UPPER_BOUND_ANGLE = 89;
    TOP_EDGE_LOWER_BOUND_ANGLE = 1;
    TOP_EDGE_UPPER_BOUND_ANGLE = 179;
    RIGHT_EDGE_LOWER_BOUND_ANGLE = 91;
    RIGHT_EDGE_UPPER_BOUND_ANGLE = 269;
    BOTTOM_EDGE_LOWER_BOUND_ANGLE = 181;
    BOTTOM_EDGE_UPPER_BOUND_ANGLE = 259;
    ANGLE_LOWER_BOUND = 0;
    ANGLE_UPPER_BOUND = 359;
    constructor(id, map) {
        this.id = id;
        this.isStartingCanvasEdge = this.isStartingCanvasEdge();
        this.canvasStartingEdge = this.getRandomStartingEdge();
        this.angle = this.getRandomAngle();
        this.startingPoint = this.getRandomStartingPoint(map);
    }
    isStartingCanvasEdge() {
        var randomNum = Math.random();
        return randomNum <= this.STARTING_EDGE_PROB ? true : false;
    }
    getRandomStartingEdge() {
        if (!this.isStartingCanvasEdge) {
            return null;
        }
        else {
            return Math.floor(Math.random() * 4);
        }
    }
    getRandomAngle() {
        var randomAngle = 0;
        if (this.isStartingCanvasEdge) {
            switch(this.canvasStartingEdge) {
                case this.TOP_STARTING_EDGE:
                    randomAngle = Math.floor(Math.random() * this.getTopEdgeAngleRange()) + this.getTopEdgeAngleOffset();
                    break;
                case this.RIGHT_STARTING_EDGE:
                    randomAngle = Math.floor(Math.random() * this.getRightEdgeAngleRange()) + this.getRightEdgeAngleOffset();
                    break;
                case this.BOTTOM_STARTING_EDGE:
                    randomAngle = Math.floor(Math.random() * this.getBottomEdgeAngleRange()) + this.getBottomEdgeAngleOffset();
                    break;
                case this.LEFT_STARTING_EDGE:
                    randomAngle = Math.floor(Math.random() * this.getLeftEdgeAngleRange()) + this.getLeftEdgeAngleOffset();
                    break;
            }
        }
        else {
            randomAngle = Math.floor(Math.random() * this.getContainedAngleRange()) + this.getContainedAngleOffset();
        }

        return randomAngle;
    }
    getTopEdgeAngleRange() {
        return this.TOP_EDGE_UPPER_BOUND_ANGLE - (this.TOP_EDGE_LOWER_BOUND_ANGLE - 1);
    }
    getRightEdgeAngleRange() {
        return this.RIGHT_EDGE_UPPER_BOUND_ANGLE - (this.RIGHT_EDGE_LOWER_BOUND_ANGLE - 1);
    }
    getLeftEdgeAngleRange() {
        return this.LEFT_EDGE_UPPER_BOUND_ANGLE - (this.LEFT_EDGE_LOWER_BOUND_ANGLE - 1);
    }
    getBottomEdgeAngleRange() {
        return this.BOTTOM_EDGE_UPPER_BOUND_ANGLE - (this.BOTTOM_EDGE_LOWER_BOUND_ANGLE - 1);
    }
    getContainedAngleRange() {
        return this.ANGLE_UPPER_BOUND - (this.ANGLE_LOWER_BOUND - 1);
    }
    getTopEdgeAngleOffset() {
        return this.TOP_EDGE_LOWER_BOUND_ANGLE;
    }
    getRightEdgeAngleOffset() {
        return this.RIGHT_EDGE_LOWER_BOUND_ANGLE;
    }
    getLeftEdgeAngleOffset() {
        return this.LEFT_EDGE_LOWER_BOUND_ANGLE;
    }
    getBottomEdgeAngleOffset() {
        return this.BOTTOM_EDGE_LOWER_BOUND_ANGLE;
    }
    getContainedAngleOffset() {
        return this.ANGLE_LOWER_BOUND;
    }
    getRandomStartingPoint(map) {
        var xLowerBound = 0;
        var yLowerBound = 0;
        var xUpperBound = map.width;
        var yUpperBound = map.height;

        var x = 0;
        var y = 0;
        if (this.isStartingCanvasEdge) {
            switch (this.canvasStartingEdge) {
                case this.TOP_STARTING_EDGE:
                    y = 0;
                    x = Math.random() * xUpperBound;
                    break;
                case this.LEFT_STARTING_EDGE:
                    x = 0;
                    y = Math.random() * yUpperBound;
                    break;
                case this.RIGHT_STARTING_EDGE:
                    x = xUpperBound;
                    y = Math.random() * yUpperBound;
                    break;
                case this.BOTTOM_STARTING_EDGE:
                    y = yUpperBound;
                    x = Math.random() * xUpperBound;
                    break;
            }
        }
        else {
            x = Math.random() * xUpperBound;
            y = Math.random() * yUpperBound;
        }

        var newPointId = map.points.size;
        return new Point(newPointId, x, y);
    }
}
class CanvasMap {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        // TODO Replace points line
        var a = new Array();
        var b = new Array();
        b[0] = 0;
        b[1] = new Point(0,0,0);
        a.push(b);
        this.points = new Map(a);
    }
}