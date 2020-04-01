import Pin from "../UserInterface/Pin.js";

export default class TestPin {
    static testPinDragHandlers() {
        let originPin = new Pin(Pin.ORIGIN_PIN_TYPE, 'origin-pin');
        let destinationPin = new Pin(Pin.DESTINATION_PIN_TYPE, 'destination-pin');
    }
}