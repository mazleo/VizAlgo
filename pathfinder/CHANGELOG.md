# CHANGELOG

__JL 1.1.2020__
- Create initial HTML structure
- Complete HTML structural layout
- Add required libraries
    - JQuery
    - Bootstrap
    - Two.js
- Add favicon
- Add MaterialDesignIcon license into meta tags

__JL 1.2.2020__
- Complete styling of static elements
- Add tooltips
    - Add tooltip.js
    - Add popper.min.js
- Update SRS
- Partially complete Map.js
    - Point.class
    - Intersect.class
    - Edge.class

__JL 1.3.2020__
- Reorder functions to improve readability
- Fix wrong BOTTOM_EDGE_UPPER_BOUND_ANGLE
- Add corner points for function use
- Complete getAngleBounds() function

__JL 1.7.2020__
- Complete calculate max road distance
- Complete get random road distance
- Complete generate straight road
- Add MapVisualizer.js
- Add getter methods in CanvasMap.js

__JL 1.8.2020__
- Correct distance and num of points calculation
- Fix vertical density to improve readability
- Complete map drawing
- Fix and implement parts of RoadMaps.js
    - Fix distance related defects
    - Generate points map from points array
    - Introduce intersections and edges fields
    - Remove unneeded log comments
- Add getter and setter methods to RoadMap.js

__JL 1.9.2020__
- Add JunctionPoint class
- Remove old intersection logic from Edge

__JL 1.28.2020__
- Add reference to containing road in points
- Complete MinDistanceHeap class

__JL 1.29.2020__
- Partially complete PointHashGrid
- Add complementary unit tests (test.js)
- Fix function bugs

__JL 1.31.2020__
- Complete BFSQueue
- Complete generation of intersection mean heaps from point with bfs
- Complete complementary unit tests
- Fix queue size bug

__JL 2.6.2020__
- Finish generation of intersections from road
- Create complementary tests

__JL 2.7.2020__
- Finish get closest point from map
- Create complementary tests