package com.apzsotnyk.weightmonitor.models

data class ReadingsResponse(
    val total: Int,
    val count: Int,
    val page: Int,
    val totalPages: Int,
    val readings: List<Reading>
)

data class LatestReadingResponse(
    val reading: Reading
)
