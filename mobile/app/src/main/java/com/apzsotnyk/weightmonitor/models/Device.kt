package com.apzsotnyk.weightmonitor.models

data class Device(
    val id: String,
    val deviceId: String,
    val name: String,
    val numberOfScales: Int,
    val scale1Limit: Double? = null,
    val scale2Limit: Double? = null,
    val scale3Limit: Double? = null,
    val scale4Limit: Double? = null,
    val createdAt: String,
    val lastActive: String? = null,
    val status: String = "active",
    val location: String? = null,
    val notes: String? = null
)