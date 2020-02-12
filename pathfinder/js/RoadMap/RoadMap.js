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
    constructor(width, height) {
        this.INTERSECTION_MIN_DISTANCE = 100;
        this.width = width;
        this.height = height;
        this.numOfPoints = 0;
        this.numOfRoads = 0;
        this.points = new Map();
        this.roads = new Map();
        this.intersections = new Map();
        this.pointHashGrid = new PointHashGrid(this);
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    generateRoad() {
        var newRoad;
        var newId;

        newId = this.numOfRoads;
        newRoad = new Road(newId, this);
        this.roads.set(newRoad.getId(), newRoad);
        this.numOfRoads++;

        /*
        if (newRoad.id == 1) {
            this.generateIntersectionsFromRoad(newRoad);
        }
        for (var point of newRoad.getConsecutivePoints()) {
            this.points.set((point.getLatitude() + point.getLongitude()), point);
        }
        */
    }

    generateIntersectionsFromRoad(road) {
        return this.pointHashGrid.generateIntersectionsFromRoad(road);
    }

    isRoadValid(road) {
        let newIntersections = this.generateIntersectionsFromRoad(road);
        let isValid = true;

        for (var currIntersection of newIntersections) {
            for (var [key, int] of this.intersections) {
                var distance = RoadMap.getDistanceBetweenIntersections(currIntersection, int);
                console.log(distance);
                if (distance < this.INTERSECTION_MIN_DISTANCE) {
                    isValid = false;
                }
            }
        }

        for (var currIntersection of newIntersections) {
            if (RoadMap.getMinAngleInIntersection(currIntersection) < 45) {
                isValid = false;
            }
        }

        return isValid;
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
