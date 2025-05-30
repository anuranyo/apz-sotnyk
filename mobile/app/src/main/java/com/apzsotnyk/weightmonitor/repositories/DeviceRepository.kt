package com.apzsotnyk.weightmonitor.repositories

import com.apzsotnyk.weightmonitor.api.ApiClient
import com.apzsotnyk.weightmonitor.models.Device
import com.apzsotnyk.weightmonitor.models.DeviceDetailResponse
import com.apzsotnyk.weightmonitor.models.DevicesResponse

class DeviceRepository {
    private val apiService = ApiClient.apiService

    suspend fun getUserDevices(): Result<DevicesResponse> {
        return try {
            val response = apiService.getUserDevices()
            Result.success(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getDeviceById(deviceId: String): Result<DeviceDetailResponse> {
        return try {
            val response = apiService.getDeviceById(deviceId)
            Result.success(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun registerDevice(name: String, numberOfScales: Int): Result<Map<String, Any>> {
        return try {
            val params = mapOf(
                "name" to name,
                "numberOfScales" to numberOfScales
            )
            val response = apiService.registerDevice(params)
            Result.success(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun updateDevice(deviceId: String, params: Map<String, Any>): Result<Map<String, Any>> {
        return try {
            val response = apiService.updateDevice(deviceId, params)
            Result.success(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun connectToDevice(deviceId: String, ownerPassword: String): Result<Map<String, Any>> {
        return try {
            val params = mapOf(
                "deviceId" to deviceId,
                "ownerPassword" to ownerPassword
            )
            val response = apiService.connectToDevice(params)
            Result.success(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun deleteDevice(deviceId: String): Result<Map<String, String>> {
        return try {
            val response = apiService.deleteDevice(deviceId)
            Result.success(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}