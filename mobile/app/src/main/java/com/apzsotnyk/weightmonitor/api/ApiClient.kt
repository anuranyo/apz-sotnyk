package com.apzsotnyk.weightmonitor.api

import com.apzsotnyk.weightmonitor.utils.TokenManager
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object ApiClient {
    private const val BASE_URL = "https://apz-sotnyk-serv.vercel.app/"

    private val authInterceptor = Interceptor { chain ->
        val originalRequest = chain.request()
        val token = TokenManager.token

        val request = if (token.isNullOrBlank()) {
            originalRequest
        } else {
            originalRequest.newBuilder()
                .header("Authorization", "Bearer $token")
                .build()
        }

        chain.proceed(request)
    }

    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BODY
    }

    private val client = OkHttpClient.Builder()
        .addInterceptor(authInterceptor)
        .addInterceptor(loggingInterceptor)
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .build()

    private val retrofit = Retrofit.Builder()
        .baseUrl(BASE_URL)
        .client(client)
        .addConverterFactory(GsonConverterFactory.create())
        .build()

    val apiService: ApiService = retrofit.create(ApiService::class.java)
}