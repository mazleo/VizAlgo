class MapVisualizer {

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
}

MapVisualizer.PATH_MAP_TYPE = 0;
MapVisualizer.PATH_TRAVERSAL_TYPE = 1;
MapVisualizer.PATH_FOUND_TYPE = 2;