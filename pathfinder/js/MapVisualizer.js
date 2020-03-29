import Point from './RoadMap/Point.js';
import Intersection from './RoadMap/Intersection.js';

export default class MapVisualizer {
    static createPathFromPoints(points, startPoint) {
        var anchors = new Array();

        var direction = points[0].equals(startPoint) ? 1 : -1;
        var pointsLength = points.length;
        var index = direction == 1 ? 0 : pointsLength - 1;
        for (; index >= 0 && index < pointsLength; index += direction) {
            var currentPoint = points[index];
            var newAnchor = new Two.Anchor(currentPoint.getLatitude(), currentPoint.getLongitude(), null, null, null, null, Two.Commands.line);
            anchors.push(newAnchor);
        }

        return new Two.Path(anchors, false, false);
    }

    static applyPathSettings(path, pathType) {
        path.cap = "round";
        path.linewidth = 7;
        path.noFill();

        switch (pathType) {
            case MapVisualizer.PATH_MAP_TYPE:
                path.stroke = "#46505E";
                break;
            case MapVisualizer.PATH_TRAVERSAL_TYPE:
                path.stroke = "#E85F62";
                break;
            case MapVisualizer.PATH_FOUND_TYPE:
                path.stroke = "#4C96FA";
                break;
        }
    }

    static drawMap(two, roadsCollection) {
        for(var [key, road] of roadsCollection) {
            this.drawRoad(two, road);
        }
    }

    static drawRoad(two, road) {
        var path;
        
        path = MapVisualizer.createPathFromPoints(road.getConsecutivePoints(), road.getStartingPoint());
        MapVisualizer.applyPathSettings(path, MapVisualizer.PATH_MAP_TYPE);

        two.add(path);
        two.update();
    }

    static drawIntersections(two, intersections) {
        for (var [key, intersection] of intersections) {
            for (var [jpkey, jp] of intersection.getJunctionPoints()) {
                var point = jp.getPoint();
                var circle = two.makeCircle(point.getLatitude(), point.getLongitude(), 5);
                circle.fill = 'white';
                circle.noStroke();
                two.update();
            }
        }
    }

    static drawPoints(two, points) {
        for (var [key, point] of points) {
            var circle = two.makeCircle(point.getLatitude(), point.getLongitude(), 2);
            circle.fill = 'green';
            circle.noStroke();
            two.update();
        }
    }

    static drawPointsInRoad(two, road) {
        for (var point of road.getConsecutivePoints()) {
            var circle = two.makeCircle(point.getLatitude(), point.getLongitude(), 1);
            circle.fill = 'green';
            circle.noStroke();
            two.update();
        }
    }

    static drawEdge(two, edge) {
        var path;
        
        path = MapVisualizer.createPathFromPoints(edge.getConsecutivePoints(), edge.getConsecutivePoints()[0]);
        MapVisualizer.applyPathSettings(path, MapVisualizer.PATH_FOUND_TYPE);

        for (var endPoint of edge.getEndPoints()) {
            if (endPoint instanceof Point) {
                var circle = two.makeCircle(endPoint.getLatitude(), endPoint.getLongitude(), 7);
                circle.fill = '#4C96FA';
                circle.noStroke();

                two.update();
            }
            else if (endPoint instanceof Intersection) {
                for (var [key, jp] of endPoint.getJunctionPoints()) {
                    var point = jp.getPoint();
                    var circle = two.makeCircle(point.getLatitude(), point.getLongitude(), 7);
                    circle.fill = '#4C96FA';
                    circle.noStroke();

                    two.update();
                }
            }
        }

        two.add(path);
        two.update();
    }

    static drawEdges(two, edges) {
        for (var [key, edge] of edges) {
            MapVisualizer.drawEdge(two, edge);
        }
    }
}

MapVisualizer.PATH_MAP_TYPE = 0;
MapVisualizer.PATH_TRAVERSAL_TYPE = 1;
MapVisualizer.PATH_FOUND_TYPE = 2;