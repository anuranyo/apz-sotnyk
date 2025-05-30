package com.apzsotnyk.weightmonitor.ui.auth

import android.content.Context
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.apzsotnyk.weightmonitor.models.AuthResponse
import com.apzsotnyk.weightmonitor.repositories.AuthRepository
import kotlinx.coroutines.launch

class AuthViewModel : ViewModel() {
    private val repository = AuthRepository()

    private val _loginResult = MutableLiveData<Result<AuthResponse>>()
    val loginResult: LiveData<Result<AuthResponse>> = _loginResult

    private val _registerResult = MutableLiveData<Result<AuthResponse>>()
    val registerResult: LiveData<Result<AuthResponse>> = _registerResult

    private val _isLoading = MutableLiveData<Boolean>()
    val isLoading: LiveData<Boolean> = _isLoading

    fun login(email: String, password: String, context: Context) {
        _isLoading.value = true
        viewModelScope.launch {
            val result = repository.login(email, password, context)
            _loginResult.value = result
            _isLoading.value = false
        }
    }

    fun register(name: String, email: String, password: String, context: Context) {
        _isLoading.value = true
        viewModelScope.launch {
            val result = repository.register(name, email, password, context)
            _registerResult.value = result
            _isLoading.value = false
        }
    }

    fun logout(context: Context) {
        viewModelScope.launch {
            repository.logout(context)
        }
    }
}