namespace airbit {

    // --- Motor control blocks ---
    //% blockID=airbit_motor_speed
    //% block="set motor speed A %speedA B %speedB C %speedC D %speedD"
    //% group='Motors'
    export function MotorSpeed(speedA: number, speedB: number, speedC: number, speedD: number) {
        setPWM(0, speedA)
        setPWM(1, speedB)
        setPWM(2, speedC)
        setPWM(3, speedD)
    }

    //% blockID=airbit_pca_start
    //% block="start PCA9685"
    //% group='Motors'
    export function PCA_Start() {
        PCAInit()
    }

    //% blockID=airbit_imu_start
    //% block="start IMU"
    //% group='Sensors'
    export function IMU_Start() {
        IMUInit()
    }

    //% blockID=airbit_imu_sensor_read
    //% block="read IMU sensor"
    //% group='Sensors'
    export function IMU_sensorRead() {
        sensorRead()
    }

    //% blockID=airbit_calculate_angles
    //% block="calculate angles"
    //% group='Sensors'
    export function calculateAngles() {
        fusion()
    }

    //% blockID=airbit_stabilise_pid
    //% block="stabilise PID"
    //% group='Control'
    export function stabilisePid() {
        pid()
    }

    //% blockID=airbit_clean_reg
    //% block="clean registers"
    //% group='Control'
    export function cleanReg() {
        cleanRegisters()
    }

    //% blockID=airbit_battery_level
    //% block="battery level"
    //% group='Battery'
    export function batteryLevel(): number {
        return batteryPercent()
    }

    //% blockID=airbit_batterymVolt
    //% block="battery mVolt"
    //% group='Battery'
    export function batterymVolt(): number {
        return batteryMilliVolt()
    }

    //% blockID=airbit_battery_calculation
    //% block="battery calculation"
    //% group='Battery'
    export function batteryCalculation() {
        batteryCalc()
    }

    //% blockID=airbit_smart_bar
    //% block="smart bar at %pos value %val"
    //% group='Display'
    export function smartBar(pos: number, val: number) {
        drawSmartBar(pos, val)
    }

    //% blockID=airbit_rotate_dot
    //% block="rotate dot x %x y %y brightness %b angle %a"
    //% group='Display'
    export function rotateDot(x: number, y: number, b: number, a: number) {
        rotateDotInternal(x, y, b, a)
    }

    // --- REMOVE old radioSend ---
    // export function radioSend() {
    //     radio.sendValue("B", batterymVoltSmooth)
    //     radio.sendValue("G", input.acceleration(Dimension.Z))
    //     radio.sendValue("Te", input.temperature())
    //     radio.sendValue("Rd", Math.round(imuRoll))
    //     radio.sendValue("Pd", Math.round(imuPitch))
    // }

    // --- ADD Bluetooth UART setup ---
    //% blockID=airbit_start_bluetooth
    //% block="Start Bluetooth UART"
    //% group='Control'
    export function startBluetooth() {
        bluetooth.startUartService()
    }

    // --- ADD Bluetooth UART handler ---
    //% blockID=airbit_bluetooth_handler
    //% block="Bluetooth UART Handler"
    //% group='Control'
    export function bluetoothHandler() {
        bluetooth.onUartDataReceived(serial.delimiters(Delimiters.NewLine), function () {
            uartReceivedTime = input.runningTime()
            let msg = bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine))

            // interpret incoming strings from MakeKit app
            if (msg == "A") {
                arm = 1
            }
            if (msg == "DISARM") {
                arm = 0
            }
            if (msg == "T") {
                throttle = Math.constrain(parseInt(msg), 0, 100)
                if (batterymVoltSmooth < 3400) {
                    throttle = Math.constrain(throttle, 0, 75)
                }
            }
            if (msg == "R") {
                roll = expo(parseInt(msg)) / 3
                roll = Math.constrain(roll, -15, 15)
            }
            if (msg == "P") {
                pitch = expo(parseInt(msg)) / -3
                pitch = Math.constrain(pitch, -15, 15)
            }
            if (msg == "Y") {
                yaw += parseInt(msg) * 0.1
            }
            if (msg == "B") {
                throttle = 0
            }
            if (msg == "C") {
                throttle = 50
            }
            if (msg == "D") {
                throttle = 100
            }
            if (msg == "1") {
                airbit.MotorSpeed(255, 0, 0, 0)
            }
            if (msg == "2") {
                airbit.MotorSpeed(0, 255, 0, 0)
            }
            if (msg == "3") {
                airbit.MotorSpeed(0, 0, 255, 0)
            }
            if (msg == "4") {
                airbit.MotorSpeed(0, 0, 0, 255)
            }
        })
    }
}
