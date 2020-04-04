import RoadMap from '../RoadMap/RoadMap.js';
import UserInterface from '../UserInterface/UserInterface.js';
import MapVisualizer from '../MapVisualizer.js';

export default class TestUserInterface {
    static testUserInterface() {
        let mapWidth = document.getElementById('map-wrapper').offsetWidth;
        let mapHeight = document.getElementById('map-wrapper').offsetHeight;
        let map = new RoadMap(mapWidth, mapHeight);
        let userInterface = new UserInterface(map);
        var two = new Two({width: mapWidth, height: mapHeight, type: Two.Types.canvas}).appendTo(userInterface.getMapWrapperElement());

        MapVisualizer.drawMap(two, map.roads);
        MapVisualizer.animateMapGeneration();
    }
}