package com.apzsotnyk.weightmonitor.models

data class Reading(
    val id: String,
    val deviceId: String,
    val scale1: Double,
    val scale2: Double,
    val scale3: Double,
    val scale4: Double,
    val timestamp: String,
    val totalWeight: Double
)