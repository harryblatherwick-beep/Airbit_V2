let yaw = 0
let uartReceivedTime = 0
let startTime = 0
let cpuTime = 0
let motorTesting = false
let throttle = 0
let mode = 0
let pitch = 0
let roll = 0
let arm = 0
let expoFactor = 0
let expoSetting = 0
let motorD = 0
let motorB = 0
let motorC = 0
let motorA = 0
let yawD = 0
let yawP = 0
let rollPitchD = 0
let rollPitchI = 0
let rollPitchP = 0
let batterymVoltSmooth = 3700
let imuRoll = 0
let imuPitch = 0
let stable = true
let gyroExists = false
let mcExists = false

i2crr.setI2CPins(DigitalPin.P2, DigitalPin.P1)
basic.pause(100)
airbit.IMU_Start()
basic.pause(100)
airbit.PCA_Start()
basic.pause(100)
airbit.IMU_gyro_calibrate()

bluetooth.startUartService()

bluetooth.onUartDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    uartReceivedTime = input.runningTime()
    let msg = bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine))

    if (msg == "A") {
        arm = 1
    } else if (msg == "DISARM") {
        arm = 0
    } else if (msg == "B") {
        throttle = 0
    } else if (msg == "C") {
        throttle = 50
    } else if (msg == "D") {
        throttle = 100
    } else {
        let val = parseInt(msg)
        if (!isNaN(val)) {
            throttle = Math.constrain(val, 0, 100)
        }
    }
})

function lostSignalCheck() {
    if (throttle > 65 && arm) {
        if (input.runningTime() > uartReceivedTime + 3000) {
            roll = 0
            pitch = 0
            yaw = 0
            throttle = 65
        }
        if (input.runningTime() > uartReceivedTime + 8000) {
            roll = 0
            pitch = 0
            yaw = 0
            throttle = 0
            arm = 0
        }
    }
}

basic.forever(function () {
    airbit.batteryCalculation()
})

basic.forever(function () {
    mainLoop()
})
