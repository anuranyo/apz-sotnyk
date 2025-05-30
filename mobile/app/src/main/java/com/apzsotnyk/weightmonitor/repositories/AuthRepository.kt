package com.apzsotnyk.weightmonitor.repositories

import android.content.Context
import com.apzsotnyk.weightmonitor.api.ApiClient
import com.apzsotnyk.weightmonitor.models.AuthResponse
import com.apzsotnyk.weightmonitor.models.LoginRequest
import com.apzsotnyk.weightmonitor.models.RegisterRequest
import com.apzsotnyk.weightmonitor.models.User
import com.apzsotnyk.weightmonitor.utils.TokenManager

class AuthRepository {
    private val apiService = ApiClient.apiService

    suspend fun login(email: String, password: String, context: Context): Result<AuthResponse> {
        return try {
            val request = LoginRequest(email, password)
            val response = apiService.login(request)
            TokenManager.saveToken(context, response.token)
            TokenManager.saveUserId(context, response.user.id)
            Result.success(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun register(name: String, email: String, password: String, context: Context): Result<AuthResponse> {
        return try {
            val request = RegisterRequest(name, email, password)
            val response = apiService.register(request)
            TokenManager.saveToken(context, response.token)
            TokenManager.saveUserId(context, response.user.id)
            Result.success(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getProfile(): Result<User> {
        return try {
            val response = apiService.getProfile()
            Result.success(response["user"]!!)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun logout(context: Context) {
        TokenManager.clearToken(context)
    }
}
