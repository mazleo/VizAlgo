export default class Intersection {
    constructor() {
        this.junctionPoints = new Map();
        this.separationDistance = 0;
        this.id = -1;
    }
    
    hasJunctionPoint(junctionPoint) {
        return this.junctionPoints.has(
            junctionPoint.getPoint().getLatitude()
            + junctionPoint.getPoint().getLongitude()
        );
    }

    addJunctionPoint(junctionPoint) {
        if (this.junctionPoints.length == 2) {
            throw '[error] Maximum number of junction points reached';
        }
        this.junctionPoints.set(
            junctionPoint.getPoint().getLatitude() + junctionPoint.getPoint().getLongitude(),
            junctionPoint
        );
        this.calculateSeparationDistance();
    }

    calculateSeparationDistance() {
        if (this.junctionPoints.size <= 1) {
            this.separationDistance = 0;
        }
        else if (this.junctionPoints.size == 2) {
            let j = 0;
            let tempJuncArray = new Array();

            for (let [key, junctionPoint] of this.junctionPoints) {
                tempJuncArray[j] = junctionPoint;
                j++;
            }

            let xDistance = Math.abs(
                tempJuncArray[0].getPoint().getLatitude()
                - tempJuncArray[1].getPoint().getLatitude()
            );
            let yDistance = Math.abs(
                tempJuncArray[0].getPoint().getLongitude()
                - tempJuncArray[1].getPoint().getLongitude()
            );

            this.separationDistance = Math.sqrt(
                (xDistance*xDistance) + (yDistance*yDistance)
            );
        }
    }

    getJunctionPoints() {
        return this.junctionPoints;
    }

    getSeparationDistance() {
        return this.separationDistance;
    }

    setId(id) {
        this.id = id;
    }

    getId() {
        return this.id;
    }

    hasPoint(point) {
        for (var [key, jp] of this.junctionPoints) {
            if (jp.isPointEqual(point)) {
                return true;
            }
        }

        return false;
    }
}