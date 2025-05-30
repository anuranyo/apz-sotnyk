package com.apzsotnyk.weightmonitor.ui.profile

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.apzsotnyk.weightmonitor.models.User
import com.apzsotnyk.weightmonitor.repositories.AuthRepository
import kotlinx.coroutines.launch

class ProfileViewModel : ViewModel() {
    private val repository = AuthRepository()

    private val _user = MutableLiveData<User?>()
    val user: LiveData<User?> = _user

    private val _isLoading = MutableLiveData<Boolean>()
    val isLoading: LiveData<Boolean> = _isLoading

    private val _error = MutableLiveData<String?>()
    val error: LiveData<String?> = _error

    fun loadUserProfile() {
        _isLoading.value = true
        _error.value = null

        viewModelScope.launch {
            try {
                val result = repository.getProfile()
                result.onSuccess { userProfile ->
                    _user.value = userProfile
                }.onFailure { exception ->
                    _error.value = "Failed to load profile: ${exception.message}"
                }
            } catch (e: Exception) {
                _error.value = "An error occurred: ${e.message}"
            } finally {
                _isLoading.value = false
            }
        }
    }
}