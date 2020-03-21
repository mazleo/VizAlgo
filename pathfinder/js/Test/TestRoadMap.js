import BFSCell from '../RoadMap/BFSCell.js';
import BFSQueue from '../RoadMap/BFSQueue.js';
import MinDistanceHeap from '../RoadMap/MinDistanceHeap.js'
import PointHashGridNode from '../RoadMap/PointHashGridNode.js';
import PointHashGridLinkedList from '../RoadMap/PointHashGridLinkedList.js';
import PointHashGrid from '../RoadMap/PointHashGrid.js';
import Point from '../RoadMap/Point.js';
import JunctionPoint from '../RoadMap/JunctionPoint.js';
import Intersection from '../RoadMap/Intersection.js';
import Edge from '../RoadMap/Edge.js';
import Road from '../RoadMap/Road.js';
import RoadMap from '../RoadMap/RoadMap.js';

export default class TestRoadMap {
    static testIsRoadValid() {
        let mapWrapper = document.getElementById('map-wrapper');
        let map = new RoadMap(mapWrapper.offsetWidth, mapWrapper.offsetHeight);
        var two = new Two({width: mapWrapper.offsetWidth, height: mapWrapper.offsetHeight, type: Two.Types.canvas}).appendTo(mapWrapper);

        map.generateRoad();
        map.generateRoad();

        let road1 = map.roads.get(0);
        let road2 = map.roads.get(1);

        road1.isStartingCanvasEdge = true;
        road1.isStartingCanvasEdge = true;
        road1.canvasStartingEdge = 3;
        road1.angle = 0;
        road1.startingPoint = new Point(0, 0, 100, road1);
        road1.bottomLeftPoint = road1.getBottomLeftPoint(map);
        road1.bottomRightPoint = road1.getBottomRightPoint(map);
        road1.topLeftPoint = road1.getTopLeftPoint(map);
        road1.topRightPoint = road1.getTopRightPoint(map);
        road1.maxDistance = road1.calculateMaxDistance();
        road1.minDistance = road1.calculateMinDistance();
        road1.distance = road1.getRandomDistance();
        // TODO Change if supporting curved roads
        road1.consecutivePoints = road1.generateStraightRoad(map);
        road1.endPoint = road1.fetchEndPoint();
        road1.points = road1.generatePointsMap();

        road2.isStartingCanvasEdge = true;
        road2.isStartingCanvasEdge = true;
        road2.canvasStartingEdge = 0;
        road2.angle = 90;
        road2.startingPoint = new Point(1, 100, 0, road2);
        road2.bottomLeftPoint = road2.getBottomLeftPoint(map);
        road2.bottomRightPoint = road2.getBottomRightPoint(map);
        road2.topLeftPoint = road2.getTopLeftPoint(map);
        road2.topRightPoint = road2.getTopRightPoint(map);
        road2.maxDistance = road2.calculateMaxDistance();
        road2.minDistance = road2.calculateMinDistance();
        road2.distance = road2.getRandomDistance();
        // TODO Change if supporting curved roads
        road2.consecutivePoints = road2.generateStraightRoad(map);
        road2.endPoint = road2.fetchEndPoint();
        road2.points = road2.generatePointsMap();

        map.pointHashGrid.putRoad(road1);
        map.pointHashGrid.putRoad(road2);

        map.generateRoad();
        for (var int of map.generateIntersectionsFromRoad(road1)) {
            map.intersections.set(map.intersections.length, int);
        }
        for (var int of map.generateIntersectionsFromRoad(road2)) {
            map.intersections.set(map.intersections.length, int);
        }

        let road3 = map.roads.get(2);
        road3.isStartingCanvasEdge = true;
        road3.isStartingCanvasEdge = true;
        road3.canvasStartingEdge = 0;
        road3.angle = 136;
        road3.startingPoint = new Point(2, 800, 0, road3);
        road3.bottomLeftPoint = road3.getBottomLeftPoint(map);
        road3.bottomRightPoint = road3.getBottomRightPoint(map);
        road3.topLeftPoint = road3.getTopLeftPoint(map);
        road3.topRightPoint = road3.getTopRightPoint(map);
        road3.maxDistance = road3.calculateMaxDistance();
        road3.minDistance = road3.calculateMinDistance();
        road3.distance = road3.getRandomDistance();
        // TODO Change if supporting curved roads
        road3.consecutivePoints = road3.generateStraightRoad(map);
        road3.endPoint = road3.fetchEndPoint();
        road3.points = road3.generatePointsMap();

        MapVisualizer.drawMap(two, map.roads);

        console.log(map.isRoadValid(road3));
    }

    static testGenerateRoad() {
        let mapWrapper = document.getElementById('map-wrapper');
        let map = new RoadMap(mapWrapper.offsetWidth, mapWrapper.offsetHeight);
        var two = new Two({width: mapWrapper.offsetWidth, height: mapWrapper.offsetHeight, type: Two.Types.canvas}).appendTo(mapWrapper);

        for (var m = 0; m < 20; m++) {
            map.generateRoad();
        }

        MapVisualizer.drawMap(two, map.roads);

        console.log(map);
    }
}