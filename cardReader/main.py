import evdev
import sendCode

KEYCARD_CODE_LENGTH = 8

def getAllDevices():
    return [evdev.InputDevice(path) for path in evdev.list_devices()]


def findDevice() -> evdev.InputDevice:
    devices = getAllDevices()
    for device in devices:
        if device.name == "Sycreader RFID Technology Co., Ltd SYC ID&IC USB Reader":
            return device
    raise Exception("Failed to find card reader")

def main():
    device = findDevice()
    try:
        device.grab()
        print("Found device " + device.name)
        print(device)
        print()

        buffer = []
        for event in device.read_loop():
            if event.type == evdev.ecodes.EV_KEY:
                ev = evdev.categorize(event)
                if ev.keystate == ev.key_up:
                    character = ev.keycode[len("KEY_"):]
                    buffer.append(character)
                    
                    if len(buffer) == KEYCARD_CODE_LENGTH:
                        cardcode = "".join(buffer)
                        buffer.clear()
                        print("Sending card code " + cardcode)
                        sendCode.sendCode(cardcode)
                        print("Code sent")
    except KeyboardInterrupt:
        print("Shutting down")
        exit(0)
    finally:
        print("Releasing device " + device.name)
        device.ungrab()
    


if __name__ == '__main__':
    # First find the device id with xinput --list-devices
    # Then float it with xinput --float id
    # Then set the file path in findDevice
    main()
