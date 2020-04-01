export default class Pin {
    static ORIGIN_PIN_TYPE = 0;
    static DESTINATION_PIN_TYPE = 1;
    constructor(pinType, pinElementId) {
        this.pinType = pinType;
        this.pinElementId = pinElementId;
        this.pinElement = Pin.initializePinElement(this.pinElementId);
        this.pinX = Pin.getPinX(this.pinElement);
        this.pinY = Pin.getPinY(this.pinElement);
        this.pinLatitude = -1;
        this.pinLongitude = -1;
        this.isOnDrag = false;
        this.addDragListeners();
        this.initializePinAppLocation(pinType);
        this.pinElement.ondragstart = function() {return false;};
    }

    initializePinAppLocation(pinType) {
        let x = null;
        let y = null;
        switch (pinType) {
            case Pin.ORIGIN_PIN_TYPE:
                var pinWrapper = document.getElementById('origin-pin-container');
                var pwWidth = pinWrapper.offsetWidth;
                var pwHeight = pinWrapper.offsetHeight;
                var pinWidth = this.pinElement.offsetWidth;
                var pinHeight = this.pinElement.offsetHeight;
                x = pinWrapper.offsetLeft + ((pwWidth - pinWidth) / 2);
                y = pinWrapper.offsetTop + ((pwHeight - pinHeight) / 2);
                break;
            case Pin.DESTINATION_PIN_TYPE:
                var pinWrapper = document.getElementById('destination-pin-container');
                var pwWidth = pinWrapper.offsetWidth;
                var pwHeight = pinWrapper.offsetHeight;
                var pinWidth = this.pinElement.offsetWidth;
                var pinHeight = this.pinElement.offsetHeight;
                x = pinWrapper.offsetLeft + ((pwWidth - pinWidth) / 2);
                y = pinWrapper.offsetTop + ((pwHeight - pinHeight) / 2);
                break;
        }

        this.pinX = x;
        this.pinY = y;
        this.pinElement.style.left = x + 'px';
        this.pinElement.style.top = y + 'px';
    }

    updatePinAppLocation() {
        this.pinX = Pin.getPinX(this.pinElement);
        this.pinY = Pin.getPinY(this.pinElement);
    }

    updatePinElementAppLocation(x, y) {
        let pinWidth = this.pinElement.offsetWidth;
        let pinHeight = this.pinElement.offsetHeight;
        this.pinElement.style.left = (x - (pinWidth / 2)) + 'px';
        this.pinElement.style.top = (y - (pinHeight / 2)) + 'px';
    }

    updatePinMapLocation(latitude, longitude) {
        this.pinLatitude = latitude;
        this.pinLongitude = longitude;
    }

    handleDragStart() {
        this.isOnDrag = true;
        this.pinElement.style.position = 'absolute';
    }

    handleDragging(x, y) {
        if (this.isOnDrag) {
            this.pinElement.style.cursor = 'grabbing';
            this.updatePinElementAppLocation(x, y);
        }
    }

    handleDragEnd() {
        this.isOnDrag = false;
        this.pinElement.style.cursor = 'grab';
    }

    addDragListeners() {
        this.pinElement.addEventListener('mousedown', (event) => ((pin) => {
            pin.handleDragStart();
        })(this));
        this.pinElement.addEventListener('mousemove', (event) => ((pin) => {
            pin.handleDragging(event.x, event.y);
        })(this));
        this.pinElement.addEventListener('mouseup', (event) => ((pin) => {
            pin.handleDragEnd();
        })(this));
    }

    static initializePinElement(pinElementId) {
        return document.getElementById(pinElementId);
    }

    static getPinX(pinElement) {
        return pinElement.x;
    }

    static getPinY(pinElement) {
        return pinElement.y;
    }
}