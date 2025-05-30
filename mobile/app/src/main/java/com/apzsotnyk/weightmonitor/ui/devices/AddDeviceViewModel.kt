package com.apzsotnyk.weightmonitor.ui.devices

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.apzsotnyk.weightmonitor.repositories.DeviceRepository
import kotlinx.coroutines.launch

class AddDeviceViewModel : ViewModel() {
    private val repository = DeviceRepository()

    private val _isLoading = MutableLiveData<Boolean>()
    val isLoading: LiveData<Boolean> = _isLoading

    private val _registerResult = MutableLiveData<Result<Map<String, Any>>>()
    val registerResult: LiveData<Result<Map<String, Any>>> = _registerResult

    private val _connectResult = MutableLiveData<Result<Map<String, Any>>>()
    val connectResult: LiveData<Result<Map<String, Any>>> = _connectResult

    private val _error = MutableLiveData<String?>()
    val error: LiveData<String?> = _error

    fun registerDevice(name: String, numberOfScales: Int, location: String? = null, notes: String? = null) {
        _isLoading.value = true
        _error.value = null

        viewModelScope.launch {
            try {
                val result = repository.registerDevice(name, numberOfScales)
                _registerResult.value = result
            } catch (e: Exception) {
                _error.value = "An error occurred: ${e.message}"
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun connectToDevice(deviceId: String, ownerPassword: String) {
        _isLoading.value = true
        _error.value = null

        viewModelScope.launch {
            try {
                val result = repository.connectToDevice(deviceId, ownerPassword)
                _connectResult.value = result
            } catch (e: Exception) {
                _error.value = "An error occurred: ${e.message}"
            } finally {
                _isLoading.value = false
            }
        }
    }
}