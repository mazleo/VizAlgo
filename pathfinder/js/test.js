class TestPointHashGrid {
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
}

TestPointHashGrid.testPutRoad(100);