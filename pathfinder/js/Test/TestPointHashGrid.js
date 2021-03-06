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
import MapVisualizer from '../MapVisualizer.js';

export default class TestPointHashGrid {
    static testGetNumRows() {
        let MIN_MAP_SIZE = 600;
        let MAX_MAP_SIZE = 2000;
        let NUM_TESTS = 50;

        let randomWidthsArray = new Array();

        for (let t = 0; t < NUM_TESTS; t++) {
            let randomWidth = (Math.random() * (MAX_MAP_SIZE - MIN_MAP_SIZE)) + MIN_MAP_SIZE;
            randomWidthsArray.push(randomWidth);
        }

        for (let t = 0; t < randomWidthsArray.length; t++) {
            let currentWidth = randomWidthsArray[t];

            let mapTemp = new RoadMap(currentWidth, null);
            let phg = new PointHashGrid(mapTemp);

            let expectedNumRows = Math.ceil(mapTemp.getWidth() / phg.PIXELS_PER_BUCKET);
            let outputNumRows = phg.calculateNumRows(mapTemp);

            if (expectedNumRows == outputNumRows) {
                console.log("PASS; EXPECTED: " + expectedNumRows + ", OUTPUT: " + outputNumRows);
            }
            else {
                console.log("FAIL; EXPECTED: " + expectedNumRows + ", OUTPUT: " + outputNumRows);
            }
        }
    }

    static testGetNumColumns() {
        let MIN_MAP_SIZE = 600;
        let MAX_MAP_SIZE = 2000;
        let NUM_TESTS = 50;

        let randomHeightsArray = new Array();

        for (let t = 0; t < NUM_TESTS; t++) {
            let randomHeight = (Math.random() * (MAX_MAP_SIZE - MIN_MAP_SIZE)) + MIN_MAP_SIZE;
            randomHeightsArray.push(randomHeight);
        }

        for (let t = 0; t < randomHeightsArray.length; t++) {
            let currentHeight = randomHeightsArray[t];

            let mapTemp = new RoadMap(null, currentHeight);
            let phg = new PointHashGrid(mapTemp);

            let expectedNumColumns = Math.ceil(mapTemp.getHeight() / phg.PIXELS_PER_BUCKET);
            let outputNumColumns = phg.calculateNumColumns(mapTemp);

            if (expectedNumColumns == outputNumColumns) {
                console.log("PASS; EXPECTED: " + expectedNumColumns + ", OUTPUT: " + outputNumColumns);
            }
            else {
                console.log("FAIL; EXPECTED: " + expectedNumColumns + ", OUTPUT: " + outputNumColumns);
            }
        }
    }

    static testInitializeGrid() {
        let mapWrapper = document.getElementById('map-wrapper');
        let map = new RoadMap(mapWrapper.offsetWidth, mapWrapper.offsetHeight);
        let phg = new PointHashGrid(map);

        let row = 0;
        let column = 0;

        let improperlyInitialized = false;
        for (let r = 0; r < phg.numRows; r++) {
            for (let c = 0; c < phg.numColumns; c++) {
                if (phg.grid[r][c] instanceof PointHashGridLinkedList == false) {
                    improperlyInitialized = true;
                    row = r;
                    column = c;
                    break;
                }
            }
            if (improperlyInitialized == true) {
                break;
            }
        }

        if (improperlyInitialized == false) {
            console.log('PASS: Grid properly initialized');
        }
        else {
            console.log('FAIL: Grid not properly initialized at R: ' + row + ", C: " + column);
        }
    }

    static testCalculateRKey(numTests) {
        let mapWrapper = document.getElementById('map-wrapper');
        let maxX = mapWrapper.offsetWidth;
        let maxY = mapWrapper.offsetHeight;

        let map = new RoadMap(mapWrapper.offsetWidth, mapWrapper.offsetHeight);
        let phg = new PointHashGrid(map);

        for (let t = 0; t < numTests; t++) {
            let randomX = Math.random() * maxX;
            let randomY = Math.random() * maxY;

            let point = new Point(-1, randomX, randomY, null);

            let expectedRKey = Math.floor(point.getLatitude() / phg.PIXELS_PER_BUCKET);

            let outputRKey = phg.calculateRKey(point);

            if (outputRKey == expectedRKey) {
                console.log('PASS: Expected: ' + expectedRKey + ', Output: ' + outputRKey);
            }
            else {
                console.log('FAIL: Expected: ' + expectedRKey + ', Output: ' + outputRKey);
            }
        }
    }

    static testCalculateCKey(numTests) {
        let mapWrapper = document.getElementById('map-wrapper');
        let maxX = mapWrapper.offsetWidth;
        let maxY = mapWrapper.offsetHeight;

        let map = new RoadMap(mapWrapper.offsetWidth, mapWrapper.offsetHeight);
        let phg = new PointHashGrid(map);

        for (let t = 0; t < numTests; t++) {
            let randomX = Math.random() * maxX;
            let randomY = Math.random() * maxY;

            let point = new Point(-1, randomX, randomY, null);

            let expectedCKey = Math.floor(point.getLongitude() / phg.PIXELS_PER_BUCKET);

            let outputCKey = phg.calculateCKey(point);

            if (outputCKey == expectedCKey) {
                console.log('PASS: Expected: ' + expectedCKey + ', Output: ' + outputCKey);
            }
            else {
                console.log('FAIL: Expected: ' + expectedCKey + ', Output: ' + outputCKey);
            }
        }
    }

    static testIsGridCellEmpty(numPoints, numTests) {
        let mapWrapper = document.getElementById('map-wrapper');
        let map = new RoadMap(mapWrapper.offsetWidth, mapWrapper.offsetHeight);
        let phg = new PointHashGrid(map);

        let maxX = mapWrapper.offsetWidth;
        let maxY = mapWrapper.offsetHeight;

        for (let t = 0; t < numPoints; t++) {
            let randomX = Math.random() * maxX;
            let randomY = Math.random() * maxY;

            let point = new Point(-1, randomX, randomY, null);
            phg.put(point);
        }

        for (let t = 0; t < numTests; t++) {
            let randomX = Math.floor(Math.random() * maxX);
            let randomY = Math.floor(Math.random() * maxY);

            let randomR = phg.calculateRKey(new Point(-1, randomX, randomY, null));
            let randomC = phg.calculateCKey(new Point(-1, randomX, randomY, null));

            let expectedOutput = phg.grid[randomR][randomC].length == 0;
            let actualOutput = phg.grid[randomR][randomC].isEmpty();

            if (expectedOutput == actualOutput) {
                console.log('PASS: Expected: ' + expectedOutput + ', Actual: ' + actualOutput);
            }
            else {
                console.log('FAIL: Expected: ' + expectedOutput + ', Actual: ' + actualOutput);
            }
        }
    }

    static testPut(numTests) {
        let mapWrapper = document.getElementById('map-wrapper');
        let map = new RoadMap(mapWrapper.offsetWidth, mapWrapper.offsetHeight);
        let phg = new PointHashGrid(map);

        let maxX = mapWrapper.offsetWidth;
        let maxY = mapWrapper.offsetHeight;

        for (let t = 0; t < numTests; t++) {
            let randomX = Math.random() * maxX;
            let randomY = Math.random() * maxY;

            let point = new Point(-1, randomX, randomY, null);
            phg.put(point);

            let r = phg.calculateRKey(point);
            let c = phg.calculateCKey(point);
            let hasPoint = phg.grid[r][c].hasPoint(point);

            if (hasPoint) {
                console.log('PASS: Point exists in correct cell');
            }
            else {
                console.log('FAIL: Point does not exist in correct cell');
            }
        }
    }

    static testContains(numTests) {
        let mapWrapper = document.getElementById('map-wrapper');
        let map = new RoadMap(mapWrapper.offsetWidth, mapWrapper.offsetHeight);
        let phg = new PointHashGrid(map);

        let maxX = mapWrapper.offsetWidth;
        let maxY = mapWrapper.offsetHeight;

        let pointArr = new Array();
        for (let t = 0; t < numTests; t++) {
            let putProb = Math.round(Math.random());
            let toPut = true;
            if (putProb == 0) {
                toPut = false;
            }

            let randomX = Math.random() * maxX;
            let randomY = Math.random() * maxY;

            let point = new Point(-1, randomX, randomY, null);

            let putObj = {
                toPut: toPut,
                point: point
            };

            pointArr.push(putObj);
        }

        for (let t = 0; t < numTests; t++) {
            if (pointArr[t].toPut) {
                phg.put(pointArr[t].point);
            }
        }


        for (let t = 0; t < numTests; t++) {
            if (
                (pointArr[t].toPut == true && phg.contains(pointArr[t].point) == true)
                || (pointArr[t].toPut == false && phg.contains(pointArr[t].point) == false)
            ) {
                console.log('PASS');
            }
            else {
                console.log('FAIL');
            }
        }
    }

    static testPutRoad(numTests) {
        let mapWrapper = document.getElementById('map-wrapper');
        let map = new RoadMap(mapWrapper.offsetWidth, mapWrapper.offsetHeight);
        let phg = new PointHashGrid(map);

        for (let t = 0; t < numTests; t++) {
            map.generateRoad();
        }

        for (let [roadId, road] of map.roads) {
            phg.putRoad(road);
        }

        let hasNonExistingPoint = false;

        for (let [roadId, road] of map.roads) {
            for (let [pointId, point] of road.points) {
                if (!phg.contains(point)) {
                    hasNonExistingPoint = true;
                }
            }
        }

        if (!hasNonExistingPoint) {
            console.log('PASS');
        }
        else {
            console.log('FAIL');
        }
    }

    static testPopulateMinDistanceheapsFromPointBFS() {
        let mapWrapper = document.getElementById('map-wrapper');
        let map = new RoadMap(mapWrapper.offsetWidth, mapWrapper.offsetHeight);
        let phg = new PointHashGrid(map);
        var two = new Two({width: mapWrapper.offsetWidth, height: mapWrapper.offsetHeight, type: Two.Types.canvas}).appendTo(mapWrapper);

        map.generateRoad();
        map.generateRoad();
        map.generateRoad();
        map.generateRoad();
        map.generateRoad();
        map.generateRoad();
        map.generateRoad();

        for (let [k, road] of map.roads) {
            phg.putRoad(road);
        }

        map.generateRoad();

        MapVisualizer.drawMap(two, map.roads);
        let road2 = map.roads.get(7);

        let minHeapArr = new Array();
        let bfsQueue = new BFSQueue();

        for (let point of road2.getConsecutivePoints()) {
            let r = phg.calculateRKey(point);
            let c = phg.calculateCKey(point);
            if (!phg.isGridCellEmpty(r, c)) {
                let visitedCells = BFSQueue.getInitializedVisitedCells(phg);
                bfsQueue.enqueue(r, c);
                phg.populateMinDistanceHeapsFromPointBFS(point, bfsQueue.getFront(), minHeapArr, phg.INTERSECTION_SEARCH_TYPE, bfsQueue, visitedCells, 1, 0, false);
            }
        }

        console.log(minHeapArr);
        for (var s of minHeapArr) {
            let z = s.minDistanceHeap[0];
            for (var [key, jp] of z.junctionPoints) {
                let x = jp.point.getLatitude();
                let y = jp.point.getLongitude();
                let circle = two.makeCircle(x, y, 5);
                circle.fill = "white";
                circle.noStroke();
                two.update();
            }
        }
    }

    static testGenerateMinDistanceHeapsFromRoad() {
        let mapWrapper = document.getElementById('map-wrapper');
        let map = new RoadMap(mapWrapper.offsetWidth, mapWrapper.offsetHeight);
        let phg = new PointHashGrid(map);
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
        road2.canvasStartingEdge = 3;
        road2.angle = 0;
        road2.startingPoint = new Point(1, 0, 200, road2);
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

        phg.putRoad(road1);
        phg.putRoad(road2);

        map.generateRoad();

        let road3 = map.roads.get(2);
        road3.isStartingCanvasEdge = true;
        road3.isStartingCanvasEdge = true;
        road3.canvasStartingEdge = 0;
        road3.angle = 45;
        road3.startingPoint = new Point(2, 100, 0, road3);
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

        let mdha = phg.generateMinDistanceHeapsFromRoad(road3);

        MapVisualizer.drawMap(two, map.roads);

        let intersections = new Array();
        for (var mh of mdha) {
            intersections.push(mh.getMinDistanceIntersection());
        }

        for (var int of intersections) {
            for (var [key, jp] of int.getJunctionPoints()) {
                var x = jp.getPoint().getLatitude();
                var y = jp.getPoint().getLongitude();

                var circle = two.makeCircle(x, y, 5);
                circle.fill = "white";
                circle.noStroke();
            }
        }

        two.update();
    }

    static testGenerateIntersectionsFromRoad() {
        let mapWrapper = document.getElementById('map-wrapper');
        let map = new RoadMap(mapWrapper.offsetWidth, mapWrapper.offsetHeight);
        let phg = new PointHashGrid(map);
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
        road2.canvasStartingEdge = 3;
        road2.angle = 0;
        road2.startingPoint = new Point(1, 0, 200, road2);
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

        phg.putRoad(road1);
        phg.putRoad(road2);

        map.generateRoad();

        let road3 = map.roads.get(2);
        road3.isStartingCanvasEdge = true;
        road3.isStartingCanvasEdge = true;
        road3.canvasStartingEdge = 0;
        road3.angle = 45;
        road3.startingPoint = new Point(2, 100, 0, road3);
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

        let intersectionsArr = phg.generateIntersectionsFromRoad(road3);

        MapVisualizer.drawMap(two, map.roads);

        for (var int of intersectionsArr) {
            for (var [key, jp] of int.getJunctionPoints()) {
                var x = jp.getPoint().getLatitude();
                var y = jp.getPoint().getLongitude();

                var circle = two.makeCircle(x, y, 5);
                circle.fill = "white";
                circle.noStroke();
            }
        }

        two.update();
    }

    static testGetClosestPointFromLocation() {
        let mapWrapper = document.getElementById('map-wrapper');
        let map = new RoadMap(mapWrapper.offsetWidth, mapWrapper.offsetHeight);
        var two = new Two({width: mapWrapper.offsetWidth, height: mapWrapper.offsetHeight, type: Two.Types.canvas}).appendTo(mapWrapper);

        MapVisualizer.drawMap(two, map.roads);

        mapWrapper.addEventListener('click', function(event) {
            var closestPoint = map.pointHashGrid.getClosestPointFromLocation(event.offsetX, event.offsetY, map);
            var circle = two.makeCircle(closestPoint.getLatitude(), closestPoint.getLongitude(), 5);
            circle.fill = "white";
            circle.noStroke();

            two.update();
        });
    }
}