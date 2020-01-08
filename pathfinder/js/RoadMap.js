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
        keyValuePair[0] = point.getLatitude() + point.getLongitude();
        keyValuePair[1] = point;

        return keyValuePair;
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
        this.distance = this.consecutivePoints.length - 1;
    }

    updatePoints() {
        this.points = this.generatePointsMap();
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
    BOTTOM_EDGE_UPPER_BOUND_ANGLE = 359;
    ANGLE_LOWER_BOUND = 0;
    ANGLE_UPPER_BOUND = 359;
    MAX_DISTANCE_PROB = 0.8;
    MID_DISTANCE_PROB = 0.15;
    MIN_DISTANCE_PROB = 0.05;

    constructor(id, map) {
        this.id = id;
        this.isStartingCanvasEdge = this.isStartingCanvasEdge();
        this.canvasStartingEdge = this.getRandomStartingEdge();
        this.angle = this.getRandomAngle();
        this.startingPoint = this.getRandomStartingPoint(map);
        this.bottomLeftPoint = this.getBottomLeftPoint(map);
        this.bottomRightPoint = this.getBottomRightPoint(map);
        this.topLeftPoint = this.getTopLeftPoint(map);
        this.topRightPoint = this.getTopRightPoint(map);
        this.maxDistance = this.calculateMaxDistance();
        this.minDistance = this.calculateMinDistance();
        this.distance = this.getRandomDistance();
        // TODO Change if supporting curved roads
        this.consecutivePoints = this.generateStraightRoad(map);
        this.endPoint = this.fetchEndPoint();
        this.points = this.generatePointsMap();
        this.intersections = null;
        this.edges = null;
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

        var newPointId = map.numOfPoints;
        return new Point(newPointId, x, y);
    }

    getBottomLeftPoint(map) {
        return new Point(-1, 0, map.height);
    }

    getBottomRightPoint(map) {
        return new Point(-1, map.width, map.height);
    }

    getTopLeftPoint(map) {
        return new Point(-1, 0, 0);
    }

    getTopRightPoint(map) {
        return new Point(-1, map.width, 0);
    }

    calculateMaxDistance() {
        var maxDistance = null;
        var x = null;
        var y = null;
        var angleBounds = null;

        angleBounds = this.getAngleBounds();
        if (this.isStartingCanvasEdge) {
            switch (this.canvasStartingEdge) {

                case this.LEFT_STARTING_EDGE:
                    if (this.angle <= angleBounds.angleBound1) {
                        y = this.startingPoint.getLongitude();
                    }
                    else if (this.angle <= angleBounds.angleBound2) {
                        x = this.bottomRightPoint.getLatitude();
                    }
                    else {
                        y = this.bottomRightPoint.getLongitude() - this.startingPoint.getLongitude();
                    }
                    break;

                case this.TOP_STARTING_EDGE:
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

                case this.RIGHT_STARTING_EDGE:
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

                case this.BOTTOM_STARTING_EDGE:
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
        }

        else {
            if (this.angle <= angleBounds.angleBound1) {
                x = this.bottomRightPoint.getLatitude() - this.startingPoint.getLatitude();
            }
            else if (this.angle <= angleBounds.angleBound2) {
                y = this.bottomLeftPoint.getLongitude() - this.startingPoint.getLongitude();
            }
            else if (this.angle <= angleBounds.angleBound3) {
                x = this.startingPoint.getLatitude();
            }
            else if (this.angle <= angleBounds.angleBound4) {
                y = this.startingPoint.getLongitude();
            }
            else {
                x = this.topRightPoint.getLatitude() - this.startingPoint.getLatitude();
            }
        }

        maxDistance = x != null ? (x / Math.cos(this.getRadFromDegree(this.angle))) : (y / Math.sin(this.getRadFromDegree(this.angle)));

        return Math.ceil(Math.abs(maxDistance));
    }

    getAngleBounds() {
        var angleBound1 = null;
        var angleBound2 = null;
        var angleBound3 = null;
        var angleBound4 = null;

        if (this.isStartingCanvasEdge) {
            switch (this.canvasStartingEdge) {

                case this.LEFT_STARTING_EDGE:
                    var xDist = this.topRightPoint.getLatitude();
                    var yDist = -1 * this.startingPoint.getLongitude();
                    var angleBound1Rad = Math.atan(yDist / xDist);
                    angleBound1 = this.getDegreeFromRad(angleBound1Rad);

                    xDist = this.bottomRightPoint.getLatitude();
                    yDist = this.bottomRightPoint.getLongitude() - this.startingPoint.getLongitude();
                    var angleBound2Rad = Math.atan(yDist / xDist);
                    angleBound2 = this.getDegreeFromRad(angleBound2Rad);
                    break;

                case this.TOP_STARTING_EDGE:
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

                case this.RIGHT_STARTING_EDGE:
                    var xDist = this.startingPoint.getLatitude();
                    var yDist = this.bottomLeftPoint.getLongitude() - this.startingPoint.getLongitude();
                    var angleBound1Rad = Math.atan(xDist / yDist);
                    angleBound1 = this.getDegreeFromRad(angleBound1Rad) + 90;

                    xDist = this.startingPoint.getLatitude();
                    yDist = this.startingPoint.getLongitude();
                    var additionAngleBound2Rad = Math.atan(yDist / xDist);
                    angleBound2 = this.getDegreeFromRad(additionAngleBound2Rad) + 180;
                    break;

                case this.BOTTOM_STARTING_EDGE:
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
        }
        else {
            var xDist = this.bottomRightPoint.getLatitude() - this.startingPoint.getLatitude();
            var yDist = this.bottomRightPoint.getLongitude() - this.startingPoint.getLongitude();
            var angleBoundRad = Math.atan(yDist/xDist);
            angleBound1 = this.getDegreeFromRad(angleBoundRad);

            xDist = this.startingPoint.getLatitude();
            yDist = this.bottomLeftPoint.getLongitude() - this.startingPoint.getLongitude();
            angleBoundRad = Math.atan(xDist/yDist);
            angleBound2 = this.getDegreeFromRad(angleBoundRad) + 90;

            xDist = this.startingPoint.getLatitude();
            yDist = this.startingPoint.getLongitude();
            angleBoundRad = Math.atan(yDist/xDist);
            angleBound3 = this.getDegreeFromRad(angleBoundRad) + 180;

            xDist = this.topRightPoint.getLatitude() - this.startingPoint.getLatitude();
            yDist = this.startingPoint.getLongitude();
            angleBoundRad = Math.atan(xDist/yDist);
            angleBound4 = this.getDegreeFromRad(angleBoundRad) + 270;
        }

        return {angleBound1: angleBound1, angleBound2: angleBound2, angleBound3: angleBound3, angleBound4: angleBound4};
    }

    getDegreeFromRad(rad) {
        return (rad * 180) / Math.PI;
    }

    getRadFromDegree(degree) {
        return (degree * Math.PI) / 180;
    }

    calculateMinDistance() {
        return Math.ceil(this.maxDistance * 0.75);
    }

    getRandomDistance() {
        var randomNum = Math.random();
        if (randomNum <= this.MAX_DISTANCE_PROB) {
            return this.maxDistance;
        }
        else if (randomNum <= this.MAX_DISTANCE_PROB + this.MID_DISTANCE_PROB) {
            var range = this.maxDistance - this.minDistance;
            var randomNumInRange = Math.floor(Math.random() * range);
            return randomNumInRange + this.minDistance;
        }
        else {
            return this.minDistance;
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

    getIsStartingCanvasEdge() {
        return this.isStartingCanvasEdge;
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

    getMaxDistance() {
        return this.maxDistance;
    }

    getMinDistance() {
        return this.minDistance;
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
}
class RoadMap {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.numOfPoints = 0;
        // TODO Replace points line
        var a = new Array();
        var b = new Array();
        b[0] = 0;
        b[1] = new Point(0,0,0);
        a.push(b);
        this.points = new Map(a);
    }
}