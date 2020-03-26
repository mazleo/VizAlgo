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

export default class RoadMap {
    TOP_STARTING_EDGE = 0;
    LEFT_STARTING_EDGE = 1;
    BOTTOM_STARTING_EDGE = 2;
    RIGHT_STARTING_EDGE = 3;
    LEFT_EDGE_LOWER_BOUND_ANGLE = -89;
    LEFT_EDGE_MID_ANGLE = 0;
    LEFT_EDGE_UPPER_BOUND_ANGLE = 89;
    TOP_EDGE_LOWER_BOUND_ANGLE = 1;
    TOP_EDGE_MID_ANGLE = 90;
    TOP_EDGE_UPPER_BOUND_ANGLE = 179;
    RIGHT_EDGE_LOWER_BOUND_ANGLE = 91;
    RIGHT_EDGE_MID_ANGLE = 180;
    RIGHT_EDGE_UPPER_BOUND_ANGLE = 269;
    BOTTOM_EDGE_LOWER_BOUND_ANGLE = 181;
    BOTTOM_EDGE_MID_ANGLE = 270;
    BOTTOM_EDGE_UPPER_BOUND_ANGLE = 359;
    ANGLE_LOWER_BOUND = 0;
    ANGLE_UPPER_BOUND = 359;
    ROAD_MIN_SEPARATION_DISTANCE = 50;
    ROAD_MAX_SEPARATION_DISTANCE = 150;

    constructor(width, height) {
        this.INTERSECTION_MIN_DISTANCE = 200;
        this.width = width;
        this.height = height;
        this.numOfPoints = 0;
        this.numOfRoads = 0;
        this.points = new Map();
        this.firstStartingEdge = this.getRandomStartingEdge();
        this.firstAngle = this.getRandomAngle(this.firstStartingEdge);
        this.firstEndingEdge = this.getEndingEdge(this.firstStartingEdge, this.firstAngle);
        this.secondStartingEdge = this.getRandomStartingEdge();
        this.secondAngle = this.getRandomAngle(this.secondStartingEdge);
        this.secondEndingEdge = this.getEndingEdge(this.secondStartingEdge, this.secondAngle);
        this.roadSeparationDistance = this.getRandomRoadSeparationDistance();
        this.roads = new Map();
        this.intersections = new Map();
        this.pointHashGrid = new PointHashGrid(this);
    }

    getRandomStartingEdge() {
        return Math.floor(Math.random() * 2);
    }

    getRandomAngle(startingEdge) {
        var randomAngle = 0;
        switch(startingEdge) {
            case this.TOP_STARTING_EDGE:
                randomAngle = Math.floor(Math.random() * this.getTopEdgeAngleRange()) + this.getTopEdgeAngleOffset();
                break;
            case this.LEFT_STARTING_EDGE:
                randomAngle = Math.floor(Math.random() * this.getLeftEdgeAngleRange()) + this.getLeftEdgeAngleOffset();
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

        return randomAngle;
    }

    getEndingEdge(startingEdge, angle) {
        switch (startingEdge) {
            case this.TOP_STARTING_EDGE:
                if (angle < this.TOP_EDGE_MID_ANGLE) {
                    return this.LEFT_STARTING_EDGE;
                }
                else if (angle == this.TOP_EDGE_MID_ANGLE) {
                    return null;
                }
                else if (angle > this.TOP_EDGE_MID_ANGLE) {
                    return this.RIGHT_STARTING_EDGE;
                }
                break;
            case this.LEFT_STARTING_EDGE:
                if (angle < this.LEFT_EDGE_MID_ANGLE) {
                    return this.BOTTOM_STARTING_EDGE;
                }
                else if (angle == this.LEFT_EDGE_MID_ANGLE) {
                    return null;
                }
                else if (angle > this.LEFT_EDGE_MID_ANGLE) {
                    return this.TOP_STARTING_EDGE;
                }
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

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    getRandomRoadSeparationDistance() {
        let range = this.ROAD_MAX_SEPARATION_DISTANCE - this.ROAD_MIN_SEPARATION_DISTANCE;
        let randomNumInRange = Math.floor(Math.random() * range);

        return randomNumInRange + this.ROAD_MIN_SEPARATION_DISTANCE;
    }

    generateRoadCollection() {

    }

    static getNextStartingPoint(prevLatitude, prevLongitude, startingEdge, angle) {
        let perpendicularAngle = RoadMap.getPerpendicularAngle(startingEdge, angle);
    }

    static getPerpendicularAngle(startingEdge, angle) {
        let angleAddition = 0;

        if (
            (startingEdge == this.TOP_STARTING_EDGE && (angle < this.TOP_EDGE_MID_ANGLE))
            || (startingEdge == this.LEFT_STARTING_EDGE && (angle < this.LEFT_EDGE_MID_ANGLE))
            /*
            || (startingEdge == this.RIGHT_STARTING_EDGE && (angle < this.RIGHT_EDGE_MID_ANGLE))
            || (startingEdge == this.BOTTOM_STARTING_EDGE && (angle < this.BOTTOM_EDGE_MID_ANGLE))
            */
        ) {
            angleAddition = 90;
        }
        else if (
            (startingEdge == this.TOP_STARTING_EDGE && (angle > this.TOP_EDGE_MID_ANGLE))
            || (startingEdge == this.LEFT_STARTING_EDGE && (angle > this.LEFT_EDGE_MID_ANGLE))
            /*
            || (startingEdge == this.RIGHT_STARTING_EDGE && (angle > this.RIGHT_EDGE_MID_ANGLE))
            || (startingEdge == this.BOTTOM_STARTING_EDGE && (angle > this.BOTTOM_EDGE_MID_ANGLE))
            */
        ) {
            angleAddition = -90;
        }

        return angle + angleAddition;
    }

    generateIntersectionsFromRoad(road) {
        return this.pointHashGrid.generateIntersectionsFromRoad(road);
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

    static getMinNum(n1, n2) {
        return n1 < n2 ? n1 : n2;
    }
}
