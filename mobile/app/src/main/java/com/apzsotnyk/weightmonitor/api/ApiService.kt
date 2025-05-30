package com.apzsotnyk.weightmonitor.api

import com.apzsotnyk.weightmonitor.models.*
import retrofit2.http.*

interface ApiService {
    // Auth endpoints
    @POST("api/auth/register")
    suspend fun register(@Body request: RegisterRequest): AuthResponse

    @POST("api/auth/login")
    suspend fun login(@Body request: LoginRequest): AuthResponse

    @GET("api/auth/profile")
    suspend fun getProfile(): Map<String, User>

    @PUT("api/auth/profile")
    suspend fun updateProfile(@Body request: Map<String, String>): Map<String, Any>

    // Device endpoints
    @GET("api/devices")
    suspend fun getUserDevices(): DevicesResponse

    @GET("api/devices/{id}")
    suspend fun getDeviceById(@Path("id") deviceId: String): DeviceDetailResponse

    @POST("api/devices")
    suspend fun registerDevice(@Body request: Map<String, Any>): Map<String, Any>

    @PUT("api/devices/{id}")
    suspend fun updateDevice(
        @Path("id") deviceId: String,
        @Body request: Map<String, Any>
    ): Map<String, Any>

    @POST("api/devices/connect")
    suspend fun connectToDevice(@Body request: Map<String, String>): Map<String, Any>

    @DELETE("api/devices/{id}")
    suspend fun deleteDevice(@Path("id") deviceId: String): Map<String, String>

    // Reading endpoints
    @GET("api/readings/{deviceId}")
    suspend fun getDeviceReadings(
        @Path("deviceId") deviceId: String,
        @QueryMap params: Map<String, String>
    ): ReadingsResponse

    @GET("api/readings/{deviceId}/latest")
    suspend fun getLatestReading(@Path("deviceId") deviceId: String): LatestReadingResponse

    @GET("api/readings/{deviceId}/daily")
    suspend fun getDailyAverages(
        @Path("deviceId") deviceId: String,
        @QueryMap params: Map<String, String>
    ): DailyAveragesResponse

    @DELETE("api/readings/{deviceId}")
    suspend fun deleteDeviceReadings(
        @Path("deviceId") deviceId: String,
        @QueryMap params: Map<String, String>
    ): Map<String, String>
}