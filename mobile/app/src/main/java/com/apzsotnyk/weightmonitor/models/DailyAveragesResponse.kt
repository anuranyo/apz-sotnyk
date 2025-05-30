package com.apzsotnyk.weightmonitor.models

data class DailyAveragesResponse(
    val deviceId: String,
    val startDate: String,
    val endDate: String,
    val count: Int,
    val averages: List<DailyAverage>
)

data class DailyAverage(
    val date: String,
    val scale1Avg: Double,
    val scale2Avg: Double,
    val scale3Avg: Double,
    val scale4Avg: Double,
    val totalAvg: Double,
    val count: Int
)