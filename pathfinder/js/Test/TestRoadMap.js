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
    static testConstructor() {
        let mapWrapper = document.getElementById('map-wrapper');
        let map = new RoadMap(mapWrapper.offsetWidth, mapWrapper.offsetHeight);
        var two = new Two({width: mapWrapper.offsetWidth, height: mapWrapper.offsetHeight, type: Two.Types.canvas}).appendTo(mapWrapper);
        console.log(map);
    }

    static testRoadSeparationDistance() {
        let mapWrapper = document.getElementById('map-wrapper');
        let map = new RoadMap(mapWrapper.offsetWidth, mapWrapper.offsetHeight);
        var two = new Two({width: mapWrapper.offsetWidth, height: mapWrapper.offsetHeight, type: Two.Types.canvas}).appendTo(mapWrapper);

        for (var i = 0; i < 500; i++) {
            var sepDist = map.getRandomRoadSeparationDistance();
            if (sepDist >= 50 && sepDist <= 150) {
                console.log('SEPDIST: ' + sepDist + '; PASS');
            }
            else {
                console.log('SEPDIST: ' + sepDist + '; FAIL');
            }
        }
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

        let intersections = map.intersections;
        for (var [key, int] of intersections) {
            for (var [jkey, jp] of int.junctionPoints) {
                var pt = jp.point;
                var circle = two.makeCircle(pt.latitude, pt.longitude, 5);
                circle.fill = 'white';
                circle.noStroke();
            }
        }

        var line = two.makeLine(100,100,250,100);
        line.stroke = 'white';
        line.cap = 'round';
        line.linewidth = 5;

        two.update();

        mapWrapper.addEventListener('click', function(event) {
            console.log('x: ' + event.offsetX + '; y: ' + event.offsetY);
            console.log('r: ' + Math.floor(event.offsetX / 20) + ', c: ' + Math.floor(event.offsetY / 20));
        })
    }
}