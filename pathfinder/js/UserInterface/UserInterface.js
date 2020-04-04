import Pin from './Pin.js';

export default class UserInterface {
    constructor(map) {
        this.map = map;
        this.mapWrapperElement = null;
        this.appElement = null;
        this.mainInterfaceElement = null;
        this.initializeUserInterfaceElements();
        this.originPin = new Pin(Pin.ORIGIN_PIN_TYPE, 'origin-pin', this);
        this.destinationPin = new Pin(Pin.DESTINATION_PIN_TYPE, 'destination-pin', this);
    }

    initializeUserInterfaceElements() {
        this.mapWrapperElement = document.getElementById('map-wrapper');
        this.appElement = document.getElementById('app-wrapper');
        this.mainInterfaceElement = document.getElementById('main-interface');
    }

    getMap() {
        return this.map;
    }

    getMapWrapperElement() {
        return this.mapWrapperElement;
    }

    getAppElement() {
        return this.appElement;
    }

    getMainInterfaceElement() {
        return this.mainInterfaceElement;
    }

    getOriginPin() {
        return this.originPin;
    }

    getDestinationPin() {
        return this.destinationPin;
    }

    setMapWrapperElement(mapWrapper) {
        this.mapWrapperElement = mapWrapper;
    }

    setAppElement(appElement) {
        this.appElement = appElement;
    }

    setMainInterfaceElement(mainInterfaceElement) {
        this.mainInterfaceElement = mainInterfaceElement;
    }

    setOriginPin(originPin) {
        this.originPin = originPin;
    }

    setDestinationPin(destinationPin) {
        this.destinationPin = destinationPin;
    }

    static displayProgressBar(message) {
    }
}