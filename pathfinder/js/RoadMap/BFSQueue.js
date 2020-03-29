import BFSCell from './BFSCell.js';

export default class BFSQueue {
    constructor() {
        this.front = null;
        this.size = 0;
    }

    print() {
        let ptr = this.front;
        let printStr = "";

        while (ptr != null) {
            printStr = printStr.concat('[' + ptr.r + ',' + ptr.c + '] -> ');

            ptr = ptr.next;
        }

        printStr = printStr.concat('/');

        console.log(printStr);
    }

    isEmpty() {
        return this.size == 0;
    }

    enqueue(r, c) {
        if (this.isEmpty()) {
            this.front = new BFSCell(r, c);
            this.size++;
            return;
        }

        let ptr = this.front;
        while (ptr.next != null) {
            ptr = ptr.next;
        }

        ptr.next = new BFSCell(r, c);
        this.size++;
    }

    getFront() {
        return this.front;
    }

    getDuplicateFront() {
        return new BFSCell(this.front.r, this.front.c);
    }

    dequeue() {
        this.front = this.front.next;
        this.size--;
    }

    static getInitializedVisitedCells(phg) {
        let visitedCells = new Array();
        for (let r = 0; r < phg.numRows; r++) {
            visitedCells[r] = new Array();
            for (let c = 0; c < phg.numColumns; c++) {
                visitedCells[r][c] = false;
            }
        }

        return visitedCells;
    }

    static isCellVisited(r, c, visitedCells) {
        return visitedCells[r][c];
    }

    static isCellValid(r, c, visitedCells) {
        try {
            var isValid = visitedCells[r][c] != undefined;
        }
        catch (err) {
            return false;
        }

        return isValid;
    }

    static resetVisitedCells(visitedCells) {
        for (var r = 0; r < visitedCells.length; r++) {
            for (var c = 0; c < visitedCells[r].length; c++) {
                visitedCells[r][c] = false;
            }
        }

        return visitedCells;
    }
}