import JunctionPoint from './JunctionPoint.js';
import Intersection from './Intersection.js';

export default class MinDistanceHeap {
    constructor(point1, point2) {
        this.roads = new Map();
        this.roads.set(
            point1.getContainingRoad().getId(), 
            point1.getContainingRoad()
        );
        this.roads.set(
            point2.getContainingRoad().getId(), 
            point2.getContainingRoad()
        );
        this.minDistanceHeap = new Array();
        this.size = 0;
    }

    calcLeftChildIndex(parentIndex) {
        return (2 * parentIndex) + 1;
    }

    calcRightChildIndex(parentIndex) {
        return (2 * parentIndex) + 2;
    }

    calcParentIndex(childIndex) {
        return Math.ceil(childIndex / 2) - 1;
    }

    minHeapify(currentIndex) {
        if (currentIndex < 1) {
            return;
        }
        var parentIndex = this.calcParentIndex(currentIndex);
        var currentIntersection = this.minDistanceHeap[currentIndex];
        var parentIntersection = this.minDistanceHeap[parentIndex];
        if (currentIntersection.getSeparationDistance() < parentIntersection.getSeparationDistance()) {
            this.minDistanceHeap[parentIndex] = currentIntersection;
            this.minDistanceHeap[currentIndex] = parentIntersection;
            this.minHeapify(parentIndex);
        }
    }

    insert(point1, point2) {
        var newIntersection = new Intersection();
        newIntersection.addJunctionPoint(new JunctionPoint(point1, point1.getContainingRoad()));
        newIntersection.addJunctionPoint(new JunctionPoint(point2, point2.getContainingRoad()));

        var newIndex = this.getSize();
        this.minDistanceHeap[newIndex] = newIntersection;
        this.size++;
        this.minHeapify(newIndex);
    }

    isComplementaryHeap(point1, point2) {
        let road1 = point1.getContainingRoad();
        let road2 = point2.getContainingRoad();

        if (
            this.roads.has(road1.getId())
            && this.roads.has(road2.getId())
        ) {
            return true;
        }
        else {
            return false;
        }
    }

    getSize() {
        return this.size;
    }

    getMinSeparationDistance() {
        return this.minDistanceHeap[0].getSeparationDistance();
    }

    getMinDistanceIntersection() {
        return this.minDistanceHeap[0];
    }
}