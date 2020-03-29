import BFSCell from './BFSCell.js';
import BFSQueue from './BFSQueue.js';
import MinDistanceHeap from './MinDistanceHeap.js'
import PointHashGridNode from './PointHashGridNode.js';
import PointHashGridLinkedList from './PointHashGridLinkedList.js';

export default class PointHashGrid {
    constructor(map) {
        this.PIXELS_PER_BUCKET = 200;
        this.INTERSECTION_VALIDATION_RADIUS = 40;
        this.INTERSECTION_SEARCH_TYPE = 0;
        this.POINT_SEARCH_TYPE = 1;
        this.size = 0;
        this.numRows = this.calculateNumRows(map);
        this.numColumns = this.calculateNumColumns(map);
        this.grid = this.initializeGrid();
    }

    calculateNumRows(map) {
        return Math.ceil(map.getWidth() / this.PIXELS_PER_BUCKET);
    }

    calculateNumColumns(map) {
        return Math.ceil(map.getHeight() / this.PIXELS_PER_BUCKET);
    }

    initializeGrid() {
        let grid = new Array();

        for (let r = 0; r <= this.numRows; r++) {
            grid[r] = new Array();
            for (let c = 0; c <= this.numColumns; c++) {
                grid[r][c] = new PointHashGridLinkedList();
            }
        }

        return grid;
    }

    calculateRKey(point) {
        return point.getLatitude() < 0 ? 0 : Math.floor(point.getLatitude() / this.PIXELS_PER_BUCKET);
    }

    calculateCKey(point) {
        return point.getLongitude() < 0 ? 0 : Math.floor(point.getLongitude() / this.PIXELS_PER_BUCKET);
    }

    isGridCellEmpty(r, c) {
        return this.grid[r][c].isEmpty();
    }

    put(point) {
        let rKey = this.calculateRKey(point);
        let cKey = this.calculateCKey(point);
        this.grid[rKey][cKey].add(rKey, cKey, point);
        this.size++;
    }

    contains(point) {
        let rKey = this.calculateRKey(point);
        let cKey = this.calculateCKey(point);

        return this.grid[rKey][cKey].hasPoint(point);
    }
    
    putRoad(road) {
        // for (var [pointId, point] of road.points) {
            // this.put(point);
        // }
        for (var point of road.getConsecutivePoints()) {
            this.put(point);
        }
    }

    getComplementaryOrNewHeapIndex(point1, point2, minDistanceHeapArray) {
        let index = 0;
        while (minDistanceHeapArray[index] != undefined) {
            if (minDistanceHeapArray[index].isComplementaryHeap(point1, point2)) {
                return index;
            }

            index++;
        }

        return index;
    }

    populateMinDistanceHeapsFromPointBFS(point, currentBFSCell, minDistanceHeapArray, searchType, bfsQueue, visitedCells, currentRadius, traversalLevel, populatedCellFound) {
        if (
            searchType == this.INTERSECTION_SEARCH_TYPE
            && traversalLevel == 5
        ) {
            return;
        }
        else if (
            searchType == this.POINT_SEARCH_TYPE
            && traversalLevel > 1
            && populatedCellFound
        ) {
            return;
        }
        if (bfsQueue.isEmpty()) {
            return;
        }
        if (!BFSQueue.isCellValid(currentBFSCell.r, currentBFSCell.c, visitedCells)) {
            return;
        }

        visitedCells[currentBFSCell.r][currentBFSCell.c] = true;
        bfsQueue.dequeue();

        let currentLL = this.grid[currentBFSCell.r][currentBFSCell.c];
        let pointPtr = currentLL.front;
        while (pointPtr != null) {
            if (PointHashGrid.calcPointsDistance(point, pointPtr.point) <= this.INTERSECTION_VALIDATION_RADIUS) {
                let mhIndex = this.getComplementaryOrNewHeapIndex(point, pointPtr.point, minDistanceHeapArray);
                if (minDistanceHeapArray[mhIndex] == undefined) {
                    minDistanceHeapArray[mhIndex] = new MinDistanceHeap(point, pointPtr.point);
                }
                minDistanceHeapArray[mhIndex].insert(point, pointPtr.point);
            }

            pointPtr = pointPtr.next;
        }

        let minR = currentBFSCell.r - currentRadius;
        let maxR = currentBFSCell.r + currentRadius;
        let minC = currentBFSCell.c - currentRadius;
        let maxC = currentBFSCell.c + currentRadius;
        let r = -1;
        let c = -1;

        populatedCellFound = false;

        // Top edge
        r = minR;
        c = minC;
        while (c <= maxC) {
            if (BFSQueue.isCellValid(r, c, visitedCells) 
            && !BFSQueue.isCellVisited(r, c, visitedCells) 
            && !this.isGridCellEmpty(r, c)) {
                bfsQueue.enqueue(r, c);
                populatedCellFound = true;
            }

            c++;
        }

        // Right edge
        c = maxC;
        r = minR;
        while (r <= maxR) {
            if (BFSQueue.isCellValid(r, c, visitedCells) 
            && !BFSQueue.isCellVisited(r, c, visitedCells) 
            && !this.isGridCellEmpty(r, c)) {
                bfsQueue.enqueue(r, c);
                populatedCellFound = true;
            }

            r++;
        }

        // Bottom edge
        r = maxR;
        c = minC;
        while (c <= maxC) {
            if (BFSQueue.isCellValid(r, c, visitedCells)
            && !BFSQueue.isCellVisited(r, c, visitedCells)
            && !this.isGridCellEmpty(r, c)) {
                bfsQueue.enqueue(r, c);
                populatedCellFound = true;
            }

            c++;
        }

        // Left edge
        c = minC;
        r = minR;
        while (r <= maxR) {
            if (BFSQueue.isCellValid(r, c, visitedCells)
            && !BFSQueue.isCellVisited(r, c, visitedCells)
            && !this.isGridCellEmpty(r, c)) {
                bfsQueue.enqueue(r, c);
                populatedCellFound = true;
            }

            r++;
        }

        currentRadius++;
        traversalLevel++;
        this.populateMinDistanceHeapsFromPointBFS(point, bfsQueue.getFront(), minDistanceHeapArray, searchType, bfsQueue, visitedCells, currentRadius, traversalLevel, populatedCellFound);
    }

    static calcPointsDistance(point1, point2) {
        let xDist = Math.abs(point1.getLatitude() - point2.getLatitude());
        let yDist = Math.abs(point1.getLongitude() - point2.getLongitude());

        return Math.sqrt((xDist * xDist) + (yDist * yDist));
    }

    generateMinDistanceHeapsFromRoad(road) {
        let minDistanceHeapArray = new Array();
        let bfsQueue = new BFSQueue();
        let visitedCells = BFSQueue.getInitializedVisitedCells(this);
        for (var point of road.getConsecutivePoints()) {
            let r = this.calculateRKey(point);
            let c = this.calculateCKey(point);
            if (!this.isGridCellEmpty(r, c)) {
                // console.log('POPULATED GRID CELL');
                //console.log(r + ', ' + c);
                bfsQueue.enqueue(r, c);
                let currentBFSCell = bfsQueue.getFront();
                this.populateMinDistanceHeapsFromPointBFS(point, currentBFSCell, minDistanceHeapArray, this.INTERSECTION_SEARCH_TYPE, bfsQueue, visitedCells, 1, 1, false);
            }
        }

        //console.log(minDistanceHeapArray);
        return minDistanceHeapArray;
    }

    generateIntersectionsFromRoad(road) {
        let minDistanceHeapArray = this.generateMinDistanceHeapsFromRoad(road);
        let intersectionsArr = new Array();
        for (var minHeap of minDistanceHeapArray) {
            var int = minHeap.getMinDistanceIntersection();
            if (int.getSeparationDistance() <= this.INTERSECTION_VALIDATION_RADIUS) {
                intersectionsArr.push(int);
            }
        }

        return intersectionsArr;
    }

    populateMinHeapClosestLocationBFS(point, currentBFSCell, bfsQueue, minHeapArr, radius, visitedCells, pointFound) {
        if (bfsQueue.isEmpty()) {
            return;
        }

        visitedCells[currentBFSCell.r][currentBFSCell.c] = true;
        bfsQueue.dequeue();

        let ll = this.grid[currentBFSCell.r][currentBFSCell.c];
        let ptr = ll.front;
        while (ptr != null) {
            let mhIndex = this.getComplementaryOrNewHeapIndex(point, ptr.point, minHeapArr);
            if (minHeapArr[mhIndex] == undefined) {
                minHeapArr[mhIndex] = new MinDistanceHeap(point, ptr.point);
            }
            minHeapArr[mhIndex].insert(point, ptr.point);

            ptr = ptr.next;
        }

        while (!pointFound) {
            let pointR = this.calculateRKey(point);
            let pointC = this.calculateCKey(point);

            let minR = pointR - radius;
            let maxR = pointR + radius;
            let minC = pointC - radius;
            let maxC = pointC + radius;

            let r = -1;
            let c = -1;

            // Top edge
            r = minR;
            c = minC;
            while (c <= maxC) {
                if (BFSQueue.isCellValid(r, c, visitedCells) && !BFSQueue.isCellVisited(r, c, visitedCells) &&
                !this.isGridCellEmpty(r, c)) {
                    bfsQueue.enqueue(r, c);
                    pointFound = true;
                }

                c++;
            }

            // Right edge
            c = maxC;
            r = minR;
            while (r <= maxR) {
                if (BFSQueue.isCellValid(r, c, visitedCells) && !BFSQueue.isCellVisited(r, c, visitedCells) &&
                !this.isGridCellEmpty(r, c)) {
                    bfsQueue.enqueue(r, c);
                    pointFound = true;
                }

                r++;
            }

            // Bottom edge
            r = maxR;
            c = minC;
            while (c <= maxC) {
                if (BFSQueue.isCellValid(r, c, visitedCells)
                && !BFSQueue.isCellVisited(r, c, visitedCells)
                && !this.isGridCellEmpty(r, c)) {
                    bfsQueue.enqueue(r, c);
                    pointFound = true;
                }

                c++;
            }

            // Left edge
            c = minC;
            r = minR;
            while (r <= maxR) {
                if (BFSQueue.isCellValid(r, c, visitedCells)
                && !BFSQueue.isCellVisited(r, c, visitedCells)
                && !this.isGridCellEmpty(r, c)) {
                    bfsQueue.enqueue(r, c);
                    pointFound = true;
                }

                r++;
            }

            radius++;
            this.populateMinHeapClosestLocationBFS(point, bfsQueue.getFront(), bfsQueue, minHeapArr, radius, visitedCells, pointFound);
        }
    }

    getClosestPointFromLocation(latitude, longitude, map) {
        let mousePoint = new Point(-1, latitude, longitude, new Road(-1, map));
        let minHeapArr = new Array();
        let bfsQueue = new BFSQueue();
        bfsQueue.enqueue(this.calculateRKey(mousePoint), this.calculateCKey(mousePoint));
        let currentBFSCell = bfsQueue.getFront();
        let visitedCells = BFSQueue.getInitializedVisitedCells(this);
        this.populateMinHeapClosestLocationBFS(mousePoint, currentBFSCell, bfsQueue, minHeapArr, 1, visitedCells, false);
        let int = minHeapArr[0].getMinDistanceIntersection();
        for (var [key, jp] of int.getJunctionPoints()) {
            if (jp.getPoint().getId() != -1) {
                return jp.getPoint();
            }
        }
    }
}