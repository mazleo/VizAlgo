import Point from './Point.js';
import JunctionPoint from './JunctionPoint.js';
import Intersection from './Intersection.js';
import Edge from './Edge.js';
import RoadMap from './RoadMap.js';

export default class Road {
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
    BOTTOM_EDGE_UPPER_BOUND_ANGLE = 359;
    ANGLE_LOWER_BOUND = 0;
    ANGLE_UPPER_BOUND = 359;

    constructor(id, canvasStartingEdge, canvasEndingEdge, angle, startingPoint, map) {
        this.id = id;
        if (id > -1) {
            this.canvasStartingEdge = canvasStartingEdge;
            this.canvasEndingEdge = canvasEndingEdge;
            this.angle = angle;
            this.startingPoint = startingPoint;
            this.currentCanvasStartingEdge = this.calcCurrentStartingEdge(map);
            this.bottomLeftPoint = this.getBottomLeftPoint(map);
            this.bottomRightPoint = this.getBottomRightPoint(map);
            this.topLeftPoint = this.getTopLeftPoint(map);
            this.topRightPoint = this.getTopRightPoint(map);
            this.distance = this.calculateDistance();
            this.consecutivePoints = this.generateStraightRoad(map);
            this.endPoint = this.fetchEndPoint();
            this.points = this.generatePointsMap();
            this.consecutiveIntersections = new Array();
            this.intersections = new Map();
            this.consecutiveEdges = new Array();
            this.edges = null;
        }
    }

    getBottomLeftPoint(map) {
        return new Point(-1, 0, map.height, null);
    }

    getBottomRightPoint(map) {
        return new Point(-1, map.width, map.height, null);
    }

    getTopLeftPoint(map) {
        return new Point(-1, 0, 0, null);
    }

    getTopRightPoint(map) {
        return new Point(-1, map.width, 0, null);
    }

    calculateDistance() {
        var distance = null;
        var x = null;
        var y = null;
        var angleBounds = null;

        angleBounds = this.getAngleBounds();
        switch (this.currentCanvasStartingEdge) {
            case RoadMap.LEFT_STARTING_EDGE:
                if (this.angle > 270 && this.angle <= angleBounds.angleBound1) {
                    y = this.startingPoint.getLongitude();
                }
                else if (
                    (this.angle > angleBounds.angleBound1 && this.angle <= 360)
                    || (this.angle >= 0 && this.angle <= angleBounds.angleBound2)
                ) {
                    x = this.bottomRightPoint.getLatitude();
                }
                else {
                    y = this.bottomRightPoint.getLongitude() - this.startingPoint.getLongitude();
                }
                break;
            case RoadMap.TOP_STARTING_EDGE:
                if (this.angle <= angleBounds.angleBound1) {
                    x = this.bottomRightPoint.getLatitude() - this.startingPoint.getLatitude();
                }
                else if (this.angle <= angleBounds.angleBound2) {
                    y = this.bottomLeftPoint.getLongitude();
                }
                else {
                    x = this.startingPoint.getLatitude();
                }
                break;

            case RoadMap.RIGHT_STARTING_EDGE:
                if (this.angle <= angleBounds.angleBound1) {
                    y = this.bottomLeftPoint.getLongitude() - this.startingPoint.getLongitude();
                }
                else if (this.angle <= angleBounds.angleBound2) {
                    x = this.startingPoint.getLatitude();
                }
                else {
                    y = this.startingPoint.getLongitude();
                }
                break;

            case RoadMap.BOTTOM_STARTING_EDGE:
                if (this.angle <= angleBounds.angleBound1) {
                    x = this.startingPoint.getLatitude();
                }
                else if (this.angle <= angleBounds.angleBound2) {
                    y = this.startingPoint.getLongitude();
                }
                else {
                    x = this.topRightPoint.getLatitude() - this.startingPoint.getLatitude();
                }
                break;
        }

        distance = x != null ? (x / Math.cos(this.getRadFromDegree(this.angle))) : (y / Math.sin(this.getRadFromDegree(this.angle)));

        return Math.ceil(Math.abs(distance));
    }

    getAngleBounds() {
        var angleBound1 = null;
        var angleBound2 = null;
        var angleBound3 = null;
        var angleBound4 = null;

        switch (this.currentCanvasStartingEdge) {
            case RoadMap.LEFT_STARTING_EDGE:
                var xDist = this.topRightPoint.getLatitude();
                var yDist = this.startingPoint.getLongitude();
                var angleBound1Rad = Math.atan(-yDist / xDist);
                angleBound1 = this.getDegreeFromRad(angleBound1Rad);
                if (angleBound1 < 0) {
                    angleBound1 = angleBound1 + 360;
                }

                xDist = this.bottomRightPoint.getLatitude();
                yDist = this.bottomRightPoint.getLongitude() - this.startingPoint.getLongitude();
                var angleBound2Rad = Math.atan(yDist / xDist);
                angleBound2 = this.getDegreeFromRad(angleBound2Rad);
                break;

            case RoadMap.TOP_STARTING_EDGE:
                var xDist = this.bottomRightPoint.getLatitude() - this.startingPoint.getLatitude();
                var yDist = this.bottomRightPoint.getLongitude();
                var angleBound1Rad = Math.atan(yDist / xDist);
                angleBound1 = this.getDegreeFromRad(angleBound1Rad);

                xDist = this.startingPoint.getLatitude();
                yDist = this.bottomLeftPoint.getLongitude();
                var diffAngleBound2Rad = Math.atan(yDist / xDist);
                var diffAngleBound2 = this.getDegreeFromRad(diffAngleBound2Rad);
                angleBound2 = 180 - diffAngleBound2;
                break;

            case RoadMap.RIGHT_STARTING_EDGE:
                var xDist = this.startingPoint.getLatitude();
                var yDist = this.bottomLeftPoint.getLongitude() - this.startingPoint.getLongitude();
                var angleBound1Rad = Math.atan(xDist / yDist);
                angleBound1 = this.getDegreeFromRad(angleBound1Rad) + 90;

                xDist = this.startingPoint.getLatitude();
                yDist = this.startingPoint.getLongitude();
                var additionAngleBound2Rad = Math.atan(yDist / xDist);
                angleBound2 = this.getDegreeFromRad(additionAngleBound2Rad) + 180;
                break;

            case RoadMap.BOTTOM_STARTING_EDGE:
                var xDist = this.startingPoint.getLatitude();
                var yDist = this.startingPoint.getLongitude();
                var additionAngleBound1Rad = Math.atan(yDist / xDist);
                angleBound1 = this.getDegreeFromRad(additionAngleBound1Rad) + 180;

                xDist = this.topRightPoint.getLatitude() - this.startingPoint.getLatitude();
                yDist = this.startingPoint.getLongitude();
                var additionAngleBound2Rad = Math.atan(xDist / yDist);
                angleBound2 = this.getDegreeFromRad(additionAngleBound2Rad) + 270;
                break;
        }

        return {angleBound1: angleBound1, angleBound2: angleBound2, angleBound3: angleBound3, angleBound4: angleBound4};
    }

    getDegreeFromRad(rad) {
        return (rad * 180) / Math.PI;
    }

    getRadFromDegree(degree) {
        return (degree * Math.PI) / 180;
    }

    calcCurrentStartingEdge(map) {
        let x = this.startingPoint.getLatitude();
        let y = this.startingPoint.getLongitude();
        if (y == 0 && (x >= 0 && x <= map.width)) {
            return RoadMap.TOP_STARTING_EDGE;
        }
        else if (y == map.height && (x >= 0 && x <= map.width)) {
            return RoadMap.BOTTOM_STARTING_EDGE;
        }
        else if (x == 0 && (y >= 0 && y <= map.height)) {
            return RoadMap.LEFT_STARTING_EDGE;
        }
        else if (x == map.width && (y >= 0 && y <= map.height)) {
            return RoadMap.RIGHT_STARTING_EDGE;
        }
    }

    generateStraightRoad() {
        var consecutivePoints;
        var xOffset;
        var yOffset;
        var currentX;
        var currentY;
        var currId;
        var angleRad;

        currentX = this.startingPoint.getLatitude();
        currentY = this.startingPoint.getLongitude();

        angleRad = this.getRadFromDegree(this.angle);
        xOffset = Math.cos(angleRad);
        yOffset = Math.sin(angleRad);

        consecutivePoints = new Array();
        consecutivePoints.push(this.startingPoint);
        currId = this.startingPoint.getId() + 1;
        for (var p = 0; p < this.distance; p++) {
            currentX += xOffset;
            currentY += yOffset;

            var newPoint = new Point(currId, currentX, currentY);
            newPoint.setContainingRoad(this);
            consecutivePoints.push(newPoint);
            currId++;
        }

        return consecutivePoints;
    }

    fetchEndPoint() {
        var endPointIndex = this.consecutivePoints.length - 1;
        return this.consecutivePoints[endPointIndex];
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
        keyValuePair[0] = point.getLatitude() + point.getLongitude();
        keyValuePair[1] = point;

        return keyValuePair;
    }

    hasPointFromLocation(latitude, longitude) {
        return this.points.has(latitude + longitude);
    }
    
    getId() {
        return this.id;
    }

    getCanvasStartingEdge() {
        return this.canvasStartingEdge;
    }

    getAngle() {
        return this.angle;
    }

    getStartingPoint() {
        return this.startingPoint;
    }

    getDistance() {
        return this.distance;
    }

    getConsecutivePoints() {
        return this.consecutivePoints;
    }

    getEndPoint() {
        return this.endPoint;
    }

    getPoints() {
        return this.points;
    }

    getIntersections() {
        return this.intersections;
    }

    getEdges() {
        return this.edges;
    }

    setIntersections(intersections) {
        this.intersections = intersections;
    }

    setEdges(edges) {
        this.edges = edges;
    }

    setConsecutiveEdges(edgesArray) {
        this.consecutiveEdges = edgesArray;
    }

    setConsecutiveIntersections(intersections) {
        this.consecutiveIntersections = intersections;
    }

    addIntersection(key, intersection) {
        this.intersections.set(key, intersection);
    }

    getConsecutiveIntersections() {
        return this.consecutiveIntersections;
    }

    getIntersectionFromPoint(point) {
        for (var [key, intersection] of this.intersections) {
            if (intersection.hasPoint(point)) {
                return intersection;
            }
        }

        return null;
    }

    isStartPoint(point) {
        if (this.startingPoint.getId() == point.getId()) {
            return true;
        }
        return false;
    }

    isEndPoint(point) {
        if (this.endPoint.getId() == point.getId()) {
            return true;
        }
        return false;
    }
}