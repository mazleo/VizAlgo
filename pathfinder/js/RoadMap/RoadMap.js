import Point from './Point.js';
import JunctionPoint from './JunctionPoint.js';
import Intersection from './Intersection.js';
import Edge from './Edge.js';
import Road from './Road.js';
import BFSCell from './BFSCell.js';
import BFSQueue from './BFSQueue.js';
import MinDistanceHeap from './MinDistanceHeap.js'
import PointHashGridNode from './PointHashGridNode.js';
import PointHashGridLinkedList from './PointHashGridLinkedList.js';
import PointHashGrid from './PointHashGrid.js';
import MapVisualizer from '../MapVisualizer.js';
import UserInterface from '../UserInterface/UserInterface.js';

export default class RoadMap {
    static TOP_STARTING_EDGE = 0;
    static LEFT_STARTING_EDGE = 1;
    static BOTTOM_STARTING_EDGE = 2;
    static RIGHT_STARTING_EDGE = 3;
    static LEFT_EDGE_LOWER_BOUND_ANGLE = -89;
    static LEFT_EDGE_MID_ANGLE = 0;
    static LEFT_EDGE_UPPER_BOUND_ANGLE = 89;
    static TOP_EDGE_LOWER_BOUND_ANGLE = 1;
    static TOP_EDGE_MID_ANGLE = 90;
    static TOP_EDGE_UPPER_BOUND_ANGLE = 179;
    static RIGHT_EDGE_LOWER_BOUND_ANGLE = 91;
    static RIGHT_EDGE_MID_ANGLE = 180;
    static RIGHT_EDGE_UPPER_BOUND_ANGLE = 269;
    static BOTTOM_EDGE_LOWER_BOUND_ANGLE = 181;
    static BOTTOM_EDGE_MID_ANGLE = 270;
    static BOTTOM_EDGE_UPPER_BOUND_ANGLE = 359;
    static ANGLE_LOWER_BOUND = 0;
    static ANGLE_UPPER_BOUND = 359;
    static ROAD_MIN_SEPARATION_DISTANCE = 50;
    static ROAD_MAX_SEPARATION_DISTANCE = 150;

    constructor(width, height) {
        this.INTERSECTION_MIN_DISTANCE = 200;
        this.width = width;
        this.height = height;
        //this.numOfPoints = 0;
        //this.numOfRoads = 0;
        this.points = new Map();
        this.firstStartingEdge = this.getRandomStartingEdge();
        this.firstEndingEdge = this.getEndingEdge(this.firstStartingEdge);
        this.secondStartingEdge = this.getRandomStartingEdge();
        this.secondEndingEdge = this.getEndingEdge(this.secondStartingEdge);
        this.firstAngle = RoadMap.getRandomAngle(this.firstStartingEdge, this.firstEndingEdge, false, null);
        this.secondAngle = RoadMap.getRandomAngle(this.secondStartingEdge, this.secondEndingEdge, true, this.firstAngle);
        this.roadSeparationDistance = this.getRandomRoadSeparationDistance();
        this.roads = new Map();
        this.intersections = new Map();
        this.pointHashGrid = new PointHashGrid(this);
        this.edges = new Map();
        this.generateRoadCollection();
    }

    getRandomStartingEdge() {
        return Math.floor(Math.random() * 2);
    }

    static getRandomAngle(startingEdge, endingEdge, isSecond, firstAngle) {
        var randomAngle = 0;
        do {
            switch(startingEdge) {
                case RoadMap.TOP_STARTING_EDGE:
                    switch (endingEdge) {
                        case RoadMap.LEFT_STARTING_EDGE:
                            var range = 89;
                            var offset = 1;
                            randomAngle = Math.floor(Math.random() * range) + offset;
                            break;
                        case RoadMap.RIGHT_STARTING_EDGE:
                            var range = 89;
                            var offset = 91;
                            randomAngle = Math.floor(Math.random() * range) + offset;
                            break;
                    }
                    break;
                case RoadMap.LEFT_STARTING_EDGE:
                    switch (endingEdge) {
                        case RoadMap.TOP_STARTING_EDGE:
                            var range = 89;
                            var offset = 1;
                            randomAngle = Math.floor(Math.random() * range) + offset;
                            break;
                        case RoadMap.BOTTOM_STARTING_EDGE:
                            var range = 89;
                            var offset = 271;
                            randomAngle = Math.floor(Math.random() * range) + offset;
                            break;
                    }
                    break;
                /*
                case this.RIGHT_STARTING_EDGE:
                    randomAngle = Math.floor(Math.random() * this.getRightEdgeAngleRange()) + this.getRightEdgeAngleOffset();
                    break;
                case this.BOTTOM_STARTING_EDGE:
                    randomAngle = Math.floor(Math.random() * this.getBottomEdgeAngleRange()) + this.getBottomEdgeAngleOffset();
                    break;
                */
            }
        } while (isSecond && RoadMap.getMinAngleDiff(firstAngle, randomAngle) < 45)

        return randomAngle;
    }

    getEndingEdge(startingEdge) {
        var e = Math.floor(Math.random() * 2);
        var endingEdge = null;
        switch (startingEdge) {
            case RoadMap.TOP_STARTING_EDGE:
                endingEdge = e == 0 ? RoadMap.LEFT_STARTING_EDGE : RoadMap.RIGHT_STARTING_EDGE;
                break;
            case RoadMap.LEFT_STARTING_EDGE:
                endingEdge = e == 0 ? RoadMap.TOP_STARTING_EDGE : RoadMap.BOTTOM_STARTING_EDGE;
                break;
            /*
            case this.RIGHT_STARTING_EDGE:
                if (angle < this.RIGHT_EDGE_MID_ANGLE) {
                    return this.TOP_STARTING_EDGE;
                }
                else if (angle == this.RIGHT_EDGE_MID_ANGLE) {
                    return null;
                }
                else if (angle > this.RIGHT_EDGE_MID_ANGLE) {
                    return this.BOTTOM_STARTING_EDGE;
                }
                break;
            case this.BOTTOM_STARTING_EDGE:
                if (angle < this.BOTTOM_EDGE_MID_ANGLE) {
                    return this.RIGHT_STARTING_EDGE;
                }
                else if (angle == this.BOTTOM_EDGE_MID_ANGLE) {
                    return null;
                }
                else if (angle > this.BOTTOM_EDGE_MID_ANGLE) {
                    return this.LEFT_STARTING_EDGE;
                }
                break;
            */
        }

        return endingEdge;
    }

    getTopEdgeAngleRange() {
        return RoadMap.TOP_EDGE_UPPER_BOUND_ANGLE - (RoadMap.TOP_EDGE_LOWER_BOUND_ANGLE - 1);
    }

    getRightEdgeAngleRange() {
        return RoadMap.RIGHT_EDGE_UPPER_BOUND_ANGLE - (RoadMap.RIGHT_EDGE_LOWER_BOUND_ANGLE - 1);
    }

    getLeftEdgeAngleRange() {
        return RoadMap.LEFT_EDGE_UPPER_BOUND_ANGLE - (RoadMap.LEFT_EDGE_LOWER_BOUND_ANGLE - 1);
    }

    getBottomEdgeAngleRange() {
        return RoadMap.BOTTOM_EDGE_UPPER_BOUND_ANGLE - (RoadMap.BOTTOM_EDGE_LOWER_BOUND_ANGLE - 1);
    }

    getContainedAngleRange() {
        return RoadMap.ANGLE_UPPER_BOUND - (RoadMap.ANGLE_LOWER_BOUND - 1);
    }

    getTopEdgeAngleOffset() {
        return RoadMap.TOP_EDGE_LOWER_BOUND_ANGLE;
    }

    getRightEdgeAngleOffset() {
        return RoadMap.RIGHT_EDGE_LOWER_BOUND_ANGLE;
    }

    getLeftEdgeAngleOffset() {
        return RoadMap.LEFT_EDGE_LOWER_BOUND_ANGLE;
    }

    getBottomEdgeAngleOffset() {
        return RoadMap.BOTTOM_EDGE_LOWER_BOUND_ANGLE;
    }

    getContainedAngleOffset() {
        return RoadMap.ANGLE_LOWER_BOUND;
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    getRandomRoadSeparationDistance() {
        let range = RoadMap.ROAD_MAX_SEPARATION_DISTANCE - RoadMap.ROAD_MIN_SEPARATION_DISTANCE;
        let randomNumInRange = Math.floor(Math.random() * range);

        return randomNumInRange + RoadMap.ROAD_MIN_SEPARATION_DISTANCE;
    }

    generateRoadCollection() {
        this.onMapGenerationStart();

        for (var v = 0; v < 2; v++) {
            var startingPoint = null;
            var startingEdge = v == 0 ? this.firstStartingEdge : this.secondStartingEdge;
            var endingEdge = v == 0 ? this.firstEndingEdge : this.secondEndingEdge;
            var angle = v == 0 ? this.firstAngle : this.secondAngle;
            var startingX = -1;
            var startingY = -1;

            if (startingEdge == RoadMap.TOP_STARTING_EDGE && endingEdge == RoadMap.LEFT_STARTING_EDGE) {
                startingX = this.width;
                startingY = 0;
            }
            else if (startingEdge == RoadMap.TOP_STARTING_EDGE && endingEdge == RoadMap.RIGHT_STARTING_EDGE) {
                startingX = 0;
                startingY = 0;
            }
            else if (startingEdge == RoadMap.LEFT_STARTING_EDGE && endingEdge == RoadMap.TOP_STARTING_EDGE) {
                startingX = 0;
                startingY = this.height;
            }
            else if (startingEdge == RoadMap.LEFT_STARTING_EDGE && endingEdge == RoadMap.BOTTOM_STARTING_EDGE) {
                startingX = 0;
                startingY = 0;
            }

            startingPoint = RoadMap.getNextStartingPoint(startingX, startingY, startingEdge, endingEdge, angle, this);

            do {
                var newRoadId = this.roads.size;
                var newRoad = new Road(newRoadId, startingEdge, endingEdge, angle, startingPoint, this);
                newRoad.startingPoint.setContainingRoad(newRoad);

                this.setRoadPoints(newRoad);
                this.roads.set(newRoad.id, newRoad);
                this.pointHashGrid.putRoad(newRoad);
                var newRoadIntersections = this.generateIntersectionsFromRoad(newRoad);
                this.setIntersectionsFromArray(newRoadIntersections);
                RoadMap.setRoadIntersectionsFromArray(newRoadIntersections);
                RoadMap.setRoadConsecutiveIntersectionsFromArray(newRoadIntersections);

                startingPoint = RoadMap.getNextStartingPoint(startingPoint.getLatitude(), startingPoint.getLongitude(), startingEdge, endingEdge, angle, this); 
            } while (startingPoint != null);

            for (var [roadKey, road] of this.roads) {
                var edgesArrayFromRoad = RoadMap.generateEdgesArrayFromRoad(road, this);
                var edgesMap = RoadMap.generateEdgesMapFromArray(edgesArrayFromRoad);
                this.setEdgesFromArray(edgesArrayFromRoad);
                road.setConsecutiveEdges(edgesArrayFromRoad);
                road.setEdges(edgesMap);
            }
        }

        this.onMapGenerationEnd();
    }

    static getNextStartingPoint(prevLatitude, prevLongitude, startingEdge, endingEdge, angle, map) {
        let perpendicularAngle = RoadMap.getPerpendicularAngle(startingEdge, angle);
        let newStartingPoint = null;

        if (startingEdge == RoadMap.TOP_STARTING_EDGE && endingEdge == RoadMap.LEFT_STARTING_EDGE) {
            let newLatitude = -1;
            let newLongitude = -1;
            let xOffset = -1;
            let yOffset = 0;

            if (prevLatitude > 0) {
                xOffset = Math.abs(map.roadSeparationDistance / Math.cos(RoadMap.getRadFromDegree(180 - perpendicularAngle)));

                newLatitude = prevLatitude - xOffset;
                newLongitude = 0;

                if (newLatitude < 0) {
                    newLatitude = 0;

                    yOffset = Math.abs(Math.tan(RoadMap.getRadFromDegree(angle)) * (xOffset - prevLatitude));
                    newLongitude = yOffset;
                }

                let newPointId = map.points.size;
                newStartingPoint = new Point(newPointId, newLatitude, newLongitude);
            }
            else {
                yOffset = Math.abs(map.roadSeparationDistance / Math.cos(RoadMap.getRadFromDegree(perpendicularAngle - 90)));
                newLongitude = prevLongitude + yOffset;
                newLatitude = 0;

                let newPointId = map.points.size;

                if (newLongitude < map.height) {
                    newStartingPoint = new Point(newPointId, newLatitude, newLongitude);
                }
                else {
                    newStartingPoint = null;
                }
            }
        }
        else if (startingEdge == RoadMap.TOP_STARTING_EDGE && endingEdge == RoadMap.RIGHT_STARTING_EDGE) {
            let newLatitude = -1;
            let newLongitude = -1;
            let xOffset = -1;
            let yOffset = 0;

            if (prevLatitude < map.width) {
                xOffset = Math.abs(map.roadSeparationDistance / Math.cos(RoadMap.getRadFromDegree(perpendicularAngle)));

                newLatitude = prevLatitude + xOffset;
                newLongitude = 0;

                if (newLatitude > map.width) {
                    newLatitude = map.width;

                    yOffset = Math.abs(Math.tan(RoadMap.getRadFromDegree(180 - angle)) * (xOffset - (map.width - prevLatitude)));
                    newLongitude = yOffset;
                }

                let newPointId = map.points.size;
                newStartingPoint = new Point(newPointId, newLatitude, newLongitude);
            }
            else {
                yOffset = Math.abs(map.roadSeparationDistance / Math.cos(RoadMap.getRadFromDegree(90 - perpendicularAngle)));
                newLongitude = prevLongitude + yOffset;
                newLatitude = map.width;

                let newPointId = map.points.size;

                if (newLongitude < map.height) {
                    newStartingPoint = new Point(newPointId, newLatitude, newLongitude);
                }
                else {
                    newStartingPoint = null;
                }
            }
        }
        else if (startingEdge == RoadMap.LEFT_STARTING_EDGE && endingEdge == RoadMap.TOP_STARTING_EDGE) {
            let newLatitude = -1;
            let newLongitude = -1;
            let xOffset = 0;
            let yOffset = 0;

            if (prevLongitude > 0) {
                yOffset = Math.abs(map.roadSeparationDistance / Math.cos(RoadMap.getRadFromDegree(-90 - perpendicularAngle)));

                newLatitude = 0;
                newLongitude = prevLongitude - yOffset;

                if (newLongitude < 0) {
                    newLongitude = 0;

                    xOffset = Math.abs(Math.tan(RoadMap.getRadFromDegree(90 - angle)) * (yOffset - prevLongitude));
                    newLatitude = xOffset;
                }

                let newPointId = map.points.size;
                newStartingPoint = new Point(newPointId, newLatitude, newLongitude);
            }
            else {
                xOffset = Math.abs(map.roadSeparationDistance / Math.cos(RoadMap.getRadFromDegree(perpendicularAngle)));
                newLatitude = prevLatitude + xOffset;
                newLongitude = 0;

                let newPointId = map.points.size;

                if (newLatitude < map.width) {
                    newStartingPoint = new Point(newPointId, newLatitude, newLongitude);
                }
                else {
                    newStartingPoint = null;
                }
            }
        }
        else if (startingEdge == RoadMap.LEFT_STARTING_EDGE && endingEdge == RoadMap.BOTTOM_STARTING_EDGE) {
            let newLatitude = -1;
            let newLongitude = -1;
            let xOffset = 0;
            let yOffset = 0;

            if (prevLongitude < map.height) {
                yOffset = Math.abs(map.roadSeparationDistance / Math.cos(RoadMap.getRadFromDegree(90 - perpendicularAngle)));

                newLatitude = 0;
                newLongitude = prevLongitude + yOffset;

                if (newLongitude > map.height) {
                    newLongitude = map.height

                    xOffset = Math.abs(Math.tan(RoadMap.getRadFromDegree(-90 - angle)) * (yOffset - (map.height - prevLongitude)));
                    newLatitude = xOffset;
                }

                let newPointId = map.points.size;
                newStartingPoint = new Point(newPointId, newLatitude, newLongitude);
            }
            else {
                xOffset = Math.abs(map.roadSeparationDistance / Math.cos(RoadMap.getRadFromDegree(perpendicularAngle)));
                newLatitude = prevLatitude + xOffset;
                newLongitude = map.height;

                let newPointId = map.points.size;

                if (newLatitude < map.width) {
                    newStartingPoint = new Point(newPointId, newLatitude, newLongitude);
                }
                else {
                    newStartingPoint = null;
                }
            }
        }

        return newStartingPoint;
    }

    static getPerpendicularAngle(startingEdge, angle) {
        let angleAddition = 0;

        if (
            (startingEdge == RoadMap.TOP_STARTING_EDGE && (angle < RoadMap.TOP_EDGE_MID_ANGLE))
            || (startingEdge == RoadMap.LEFT_STARTING_EDGE && (angle < RoadMap.LEFT_EDGE_MID_ANGLE))
            /*
            || (startingEdge == this.RIGHT_STARTING_EDGE && (angle < this.RIGHT_EDGE_MID_ANGLE))
            || (startingEdge == this.BOTTOM_STARTING_EDGE && (angle < this.BOTTOM_EDGE_MID_ANGLE))
            */
        ) {
            angleAddition = 90;
        }
        else if (
            (startingEdge == RoadMap.TOP_STARTING_EDGE && (angle > RoadMap.TOP_EDGE_MID_ANGLE))
            || (startingEdge == RoadMap.LEFT_STARTING_EDGE && (angle > RoadMap.LEFT_EDGE_MID_ANGLE))
            /*
            || (startingEdge == this.RIGHT_STARTING_EDGE && (angle > this.RIGHT_EDGE_MID_ANGLE))
            || (startingEdge == this.BOTTOM_STARTING_EDGE && (angle > this.BOTTOM_EDGE_MID_ANGLE))
            */
        ) {
            angleAddition = -90;
        }

        return angle + angleAddition;
    }

    static getDegreeFromRad(rad) {
        return (rad * 180) / Math.PI;
    }

    static getRadFromDegree(degree) {
        return (degree * Math.PI) / 180;
    }

    generateIntersectionsFromRoad(road) {
        return this.pointHashGrid.generateIntersectionsFromRoad(road);
    }

    setRoadPoints(road) {
        for (var point of road.getConsecutivePoints()) {
            this.points.set(point.id, point);
        }
    }

    setIntersectionsFromArray(intersectionArray) {
        for (var intersection of intersectionArray) {
            var key = this.intersections.size;
            intersection.setId(key);
            this.intersections.set(key, intersection);
        }
    }

    static getDistanceBetweenIntersections(int1, int2) {
        let jp1 = null;
        let jp2 = null;
        for (var [key, jp] of int1.getJunctionPoints()) {
            jp1 = jp;
            break;
        }
        for (var [key, jp] of int2.getJunctionPoints()) {
            jp2 = jp;
            break;
        }

        let pt1 = jp1.getPoint();
        let pt2 = jp2.getPoint();

        let xDist = Math.abs(pt1.getLatitude() - pt2.getLatitude());
        let yDist = Math.abs(pt1.getLongitude() - pt2.getLongitude());

        return Math.sqrt((xDist*xDist) + (yDist*yDist));
    }

    static getMinAngleInIntersection(int) {
        let jpArr = new Array();
        for (var [key, jp] of int.getJunctionPoints()) {
            jpArr.push(jp);
        }

        let road1 = jpArr[0].getRoad();
        let road2 = jpArr[1].getRoad();

        let angleDiff1 = Math.abs(road1.getAngle() - road2.getAngle());
        let angleDiff2 = Math.abs(180 - angleDiff1);

        return RoadMap.getMinNum(angleDiff1, angleDiff2);
    }

    static getMinAngleDiff(angle1, angle2) {
        let angleDiff1 = Math.abs(angle1 - angle2);
        let angleDiff2 = Math.abs(180 - angleDiff1);

        return RoadMap.getMinNum(angleDiff1, angleDiff2);
    }

    static getMinNum(n1, n2) {
        return n1 < n2 ? n1 : n2;
    }

    static setRoadIntersectionsFromArray(intersections) {
        for (var intersection of intersections) {
            for (var [jpKey, junctionPoint] of intersection.getJunctionPoints()) {
                var point = junctionPoint.getPoint();
                var road = point.getContainingRoad();
                road.addIntersection(intersection.getId(), intersection);
            }
        }
    }

    static setRoadConsecutiveIntersectionsFromArray(intersections) {
        for (var intersection of intersections) {
            for (var [jpKey, junctionPoint] of intersection.getJunctionPoints()) {
                var point = junctionPoint.getPoint();
                var road = point.getContainingRoad();
                road.consecutiveIntersections.push(intersection);
            }
        }
    }

    static generateEdgesArrayFromRoad(road, map) {
        let edgesArray = new Array();

        var startNew = true;
        var startWithIntersection;
        var id = map.edges.size;
        for (var point of road.getConsecutivePoints()) {
            if (startNew) {
                startNew = false;
                var edgeId = map.edges.size;
                var edgePoints = new Array();
                var endPoints = new Array();
                if (startWithIntersection) {
                    endPoints.push(intersection);
                }
            }

            edgePoints.push(point);
            var intersection = map.getIntersectionFromPoint(point);
            if (
                intersection != null
                || road.isStartPoint(point)
                || road.isEndPoint(point)
            ) {
                endPoints.push(intersection != null ? intersection : point);
                startWithIntersection = intersection != null ? true : false;

                if (endPoints.length == 2) {
                    startNew = true;
                    edgesArray.push(new Edge(id, endPoints, edgePoints));
                    id++;
                }
            }
        }

        return edgesArray;
    }

    getIntersectionFromPoint(point) {
        for (var [key, intersection] of this.intersections) {
            if (intersection.hasPoint(point)) {
                return intersection;
            }
        }

        return null;
    }

    setEdgesFromArray(edgesArray) {
        for (var edge of edgesArray) {
            this.edges.set(edge.getId(), edge);
        }
    }

    static generateEdgesMapFromArray(edgesArray) {
        let edgesMap = new Map();
        for (var edge of edgesArray) {
            edgesMap.set(edge.getId(), edge);
        }

        return edgesMap;
    }

    getClosestPointFromLocation(latitude, longitude) {
        return this.pointHashGrid.getClosestPointFromLocation(latitude, longitude, this);
    }

    onMapGenerationStart() {
    }

    onMapGenerationEnd() {
    }
}
