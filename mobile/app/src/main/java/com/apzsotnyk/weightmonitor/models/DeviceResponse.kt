package com.apzsotnyk.weightmonitor.models

data class DevicesResponse(
    val count: Int,
    val devices: List<Device>
)

data class DeviceDetailResponse(
    val device: Device,
    val latestReading: Reading?
)