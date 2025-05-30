package com.apzsotnyk.weightmonitor.repositories

import com.apzsotnyk.weightmonitor.api.ApiClient
import com.apzsotnyk.weightmonitor.models.DailyAveragesResponse
import com.apzsotnyk.weightmonitor.models.LatestReadingResponse
import com.apzsotnyk.weightmonitor.models.ReadingsResponse
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

class ReadingRepository {
    private val apiService = ApiClient.apiService

    suspend fun getDeviceReadings(
        deviceId: String,
        params: Map<String, String>
    ): Result<ReadingsResponse> {
        return try {
            val response = apiService.getDeviceReadings(deviceId, params)
            Result.success(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getLatestReading(deviceId: String): Result<LatestReadingResponse> {
        return try {
            val response = apiService.getLatestReading(deviceId)
            Result.success(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getDailyAverages(
        deviceId: String,
        startDate: LocalDateTime? = null,
        endDate: LocalDateTime? = null
    ): Result<DailyAveragesResponse> {
        return try {
            val params = mutableMapOf<String, String>()

            val formatter = DateTimeFormatter.ISO_DATE_TIME
            startDate?.let { params["startDate"] = it.format(formatter) }
            endDate?.let { params["endDate"] = it.format(formatter) }

            val response = apiService.getDailyAverages(deviceId, params)
            Result.success(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    fun getReadingHistory(deviceId: String, limit: Int = 10): Flow<Result<ReadingsResponse>> = flow {
        try {
            val params = mapOf(
                "limit" to limit.toString(),
                "skip" to "0"
            )
            val response = apiService.getDeviceReadings(deviceId, params)
            emit(Result.success(response))
        } catch (e: Exception) {
            emit(Result.failure(e))
        }
    }
}