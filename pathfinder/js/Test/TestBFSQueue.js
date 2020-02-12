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

export default class TestBFSQueue {
    static testPrint() {
        let bfsQueue = new BFSQueue();
        bfsQueue.print();
    }

    static testEnqueue() {
        let bfsQueue = new BFSQueue();
        bfsQueue.print();
        bfsQueue.enqueue(0, 1);
        bfsQueue.print();
        bfsQueue.enqueue(2, 3);
        bfsQueue.print();
        bfsQueue.enqueue(4, 5);
        bfsQueue.print();
        bfsQueue.enqueue(4, 3);
        bfsQueue.print();
    }

    static testDequeue() {
        let bfsQueue = new BFSQueue();
        bfsQueue.print();
        bfsQueue.enqueue(0, 1);
        bfsQueue.print();
        bfsQueue.enqueue(2, 3);
        bfsQueue.print();
        bfsQueue.enqueue(4, 5);
        bfsQueue.print();
        bfsQueue.enqueue(4, 3);
        bfsQueue.print();
        bfsQueue.dequeue();
        bfsQueue.print();
    }

    static testFront() {
        let bfsQueue = new BFSQueue();
        bfsQueue.enqueue(0, 1);
        bfsQueue.enqueue(2, 3);
        bfsQueue.enqueue(4, 5);
        bfsQueue.enqueue(4, 3);

        let front = bfsQueue.getFront();
        console.log(front);
    }

    static testDuplicateFront() {
        let bfsQueue = new BFSQueue();
        bfsQueue.enqueue(0, 1);
        bfsQueue.enqueue(2, 3);
        bfsQueue.enqueue(4, 5);
        bfsQueue.enqueue(4, 3);

        let front = bfsQueue.getDuplicateFront();
        console.log(front);
    }

    static testInitializedVisitedCells() {
        let mapWrapper = document.getElementById('map-wrapper');
        let map = new RoadMap(mapWrapper.offsetWidth, mapWrapper.offsetHeight);
        let phg = new PointHashGrid(map);

        let visitedCells = BFSQueue.getInitializedVisitedCells(phg);

        console.log(visitedCells);

        let pass = true;
        for (let r = 0; r < phg.numRows; r++) {
            for (let c = 0; c < phg.numColumns; c++) {
                if (visitedCells[r][c] == true || visitedCells[r][c] == undefined) {
                    pass = false;
                }
            }
        }

        if (pass) {
            console.log('PASS');
        }
        else {
            console.log('FAIL');
        }
    }

    static testIsCellVisited() {
        let mapWrapper = document.getElementById('map-wrapper');
        let map = new RoadMap(mapWrapper.offsetWidth, mapWrapper.offsetHeight);
        let phg = new PointHashGrid(map);

        let visitedCells = BFSQueue.getInitializedVisitedCells(phg);

        console.log(BFSQueue.isCellVisited(0,0,visitedCells));
        visitedCells[0][0] = true;
        console.log(BFSQueue.isCellVisited(0,0,visitedCells));
    }

    static testIsCellValid() {
        let mapWrapper = document.getElementById('map-wrapper');
        let map = new RoadMap(mapWrapper.offsetWidth, mapWrapper.offsetHeight);
        let phg = new PointHashGrid(map);

        let visitedCells = BFSQueue.getInitializedVisitedCells(phg);

        let pass = true;
        if (
            BFSQueue.isCellValid(-1, -1, visitedCells) == true
            || BFSQueue.isCellValid(0, 0, visitedCells) == false
            || BFSQueue.isCellValid(phg.numRows, phg.numColumns, visitedCells) == true
            || BFSQueue.isCellValid(phg.numRows - 1, phg.numColumns - 1, visitedCells) == false
        ) {
            pass = false;
        }

        if (pass) {
            console.log('PASS');
        }
        else {
            console.log('FAIL');
        }
    }
}