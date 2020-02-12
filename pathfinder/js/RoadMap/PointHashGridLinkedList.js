import PointHashGridNode from './PointHashGridNode.js';

export default class PointHashGridLinkedList {
    constructor() {
        this.front = null;
        this.length = 0;
    }

    add(rKey, cKey, point) {
        var newNode = new PointHashGridNode(rKey, cKey, point);
        newNode.next = this.front;
        this.front = newNode;
        this.length++;
    }

    isEmpty() {
        return this.length == 0;
    }

    hasPoint(point) {
        let ptr = this.front;
        while (ptr != null) {
            if (ptr.equalsPoint(point)) {
                break;
            }
            
            ptr = ptr.next;
        }

        return ptr == null ? false : true;
    }

    remove(point) {
        if (this.isEmpty()) {
            return;
        }

        let prev = null;
        let ptr = this.front;

        while (ptr != null) {
            if (ptr.equalsPoint(point)) {
                break;
            }

            prev = ptr;
            ptr = ptr.next;
        }

        if (prev == null) {
            this.front = this.front.next;
        }
        else if (ptr != null) {
            prev.next = ptr.next;
        }
    }
}