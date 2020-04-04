import UserInterface from './UserInterface.js';

export default class Pin {
    static ORIGIN_PIN_TYPE = 0;
    static DESTINATION_PIN_TYPE = 1;
    constructor(pinType, pinElementId, userInterface) {
        this.userInterface = userInterface;
        this.pinType = pinType;
        this.pinElementId = pinElementId;
        this.pinElement = null;
        this.initializePinElement();
        this.pinX = Pin.getPinX(this.pinElement);
        this.pinY = Pin.getPinY(this.pinElement);
        this.pinLatitude = -1;
        this.pinLongitude = -1;
        this.isOnDrag = false;
        this.addDragListeners();
        this.initializePinAppLocation(pinType);
        this.pinElement.ondragstart = function() {return false;};
        this.isWithinMap = false;
        this.originPoint = null;
        this.destinationPoint = null;
    }

    initializePinAppLocation(pinType) {
        let x = null;
        let y = null;
        var pinWrapper = null;
        switch (pinType) {
            case Pin.ORIGIN_PIN_TYPE:
                pinWrapper = document.getElementById('origin-pin-container');
                break;
            case Pin.DESTINATION_PIN_TYPE:
                pinWrapper = document.getElementById('destination-pin-container');
                break;
        }

        var pwWidth = pinWrapper.offsetWidth;
        var pwHeight = pinWrapper.offsetHeight;
        var pinWidth = this.pinElement.offsetWidth;
        var pinHeight = this.pinElement.offsetHeight;
        x = pinWrapper.offsetLeft + ((pwWidth - pinWidth) / 2);
        y = pinWrapper.offsetTop + ((pwHeight - pinHeight) / 2);

        this.pinX = x;
        this.pinY = y;
        this.pinElement.style.left = x + 'px';
        this.pinElement.style.top = y + 'px';
        this.pinElement.style.visibility = 'visible';
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
            this.userInterface.getAppElement().style.cursor = 'grabbing';
            this.pinElement.style.cursor = 'grabbing';
            if (this.isWithinMap) {
                let mainInterfaceWidth = this.userInterface.getMainInterfaceElement().offsetWidth;
                let mouseLatitude = x - mainInterfaceWidth;
                let mouseLongitude = y;
                let point = this.userInterface.getMap().getClosestPointFromLocation(mouseLatitude, mouseLongitude);
                let topOffset = this.pinElement.offsetHeight / 2;
                let left = point.getLatitude() + mainInterfaceWidth;
                let top = point.getLongitude() - topOffset;
                this.updatePinElementAppLocation(left, top);

                if (this.pinType == Pin.ORIGIN_PIN_TYPE) {
                    this.originPoint = point;
                }
                else if (this.pinType == Pin.DESTINATION_PIN_TYPE) {
                    this.destinationPoint = point;
                }
            }
            else {
                this.pinElement.style.cursor = 'grabbing';
                this.updatePinElementAppLocation(x, y);
            }
        }
    }

    handleDragEnd() {
        if (this.isOnDrag) {
            this.isOnDrag = false;
            this.pinElement.style.cursor = 'grab';
            this.userInterface.getAppElement().style.cursor = 'default';
            if (!this.isWithinMap) {
                this.initializePinAppLocation(this.pinType);
            }
        }
    }

    addDragListeners() {
        this.pinElement.addEventListener('mousedown', (event) => ((pin) => {
            pin.handleDragStart();
        })(this));
        this.userInterface.getMainInterfaceElement().addEventListener('mousemove', (event) => ((pin) => {
            this.isWithinMap = false;
            pin.handleDragging(event.x, event.y);
        })(this));
        this.userInterface.getMapWrapperElement().addEventListener('mousemove', (event) => ((pin) => {
            this.isWithinMap = true;
            pin.handleDragging(event.x, event.y);
        })(this));
        this.userInterface.getAppElement().addEventListener('mouseup', (event) => ((pin) => {
            pin.handleDragEnd();
        })(this));
    }

    initializePinElement() {
        this.pinElement = document.getElementById(this.pinElementId);
    }

    static getPinX(pinElement) {
        return pinElement.x;
    }

    static getPinY(pinElement) {
        return pinElement.y;
    }
}