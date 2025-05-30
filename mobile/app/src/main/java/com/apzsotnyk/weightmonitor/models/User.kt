package com.apzsotnyk.weightmonitor.models

data class User(
    val id: String,
    val name: String,
    val email: String,
    val role: String,
    val createdAt: String? = null,
    val lastLogin: String? = null
)