package com.apzsotnyk.weightmonitor.models

data class AuthResponse(
    val message: String,
    val token: String,
    val user: User
)