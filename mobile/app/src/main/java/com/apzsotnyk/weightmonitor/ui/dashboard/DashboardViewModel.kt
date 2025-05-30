package com.apzsotnyk.weightmonitor.ui.dashboard

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.apzsotnyk.weightmonitor.models.DailyAveragesResponse
import com.apzsotnyk.weightmonitor.models.Device
import com.apzsotnyk.weightmonitor.models.Reading
import com.apzsotnyk.weightmonitor.repositories.DeviceRepository
import com.apzsotnyk.weightmonitor.repositories.ReadingRepository
import kotlinx.coroutines.launch
import java.time.LocalDateTime

class DashboardViewModel : ViewModel() {
    private val deviceRepository = DeviceRepository()
    private val readingRepository = ReadingRepository()

    private val _devicesLoading = MutableLiveData<Boolean>()
    val devicesLoading: LiveData<Boolean> = _devicesLoading

    private val _devices = MutableLiveData<List<Device>>()
    val devices: LiveData<List<Device>> = _devices

    private val _selectedDevice = MutableLiveData<Device?>()
    val selectedDevice: LiveData<Device?> = _selectedDevice

    private val _latestReading = MutableLiveData<Reading?>()
    val latestReading: LiveData<Reading?> = _latestReading

    private val _chartData = MutableLiveData<DailyAveragesResponse?>()
    val chartData: LiveData<DailyAveragesResponse?> = _chartData

    private val _chartLoading = MutableLiveData<Boolean>()
    val chartLoading: LiveData<Boolean> = _chartLoading

    private val _timeRange = MutableLiveData<TimeRange>()
    val timeRange: LiveData<TimeRange> = _timeRange

    private val _error = MutableLiveData<String?>()
    val error: LiveData<String?> = _error

    private val _readingHistory = MutableLiveData<List<Reading>>()
    val readingHistory: LiveData<List<Reading>> = _readingHistory

    private val _historyLoading = MutableLiveData<Boolean>()
    val historyLoading: LiveData<Boolean> = _historyLoading

    init {
        _timeRange.value = TimeRange.DAY
    }

    fun loadReadingHistory(deviceId: String) {
        _historyLoading.value = true

        viewModelScope.launch {
            try {
                readingRepository.getReadingHistory(deviceId, 5)
                    .collect { result ->
                        result.onSuccess { response ->
                            _readingHistory.value = response.readings
                        }.onFailure { exception ->
                            _error.value = "Failed to load reading history: ${exception.message}"
                            _readingHistory.value = emptyList()
                        }
                        _historyLoading.value = false
                    }
            } catch (e: Exception) {
                _error.value = "An error occurred: ${e.message}"
                _readingHistory.value = emptyList()
                _historyLoading.value = false
            }
        }
    }

    fun loadDevices() {
        _devicesLoading.value = true
        _error.value = null

        viewModelScope.launch {
            try {
                val result = deviceRepository.getUserDevices()
                result.onSuccess { response ->
                    _devices.value = response.devices

                    // If there are devices and no device is selected, select the first one
                    if (response.devices.isNotEmpty() && _selectedDevice.value == null) {
                        selectDevice(response.devices[0])
                    }
                }.onFailure { exception ->
                    _error.value = "Failed to load devices: ${exception.message}"
                }
            } catch (e: Exception) {
                _error.value = "An error occurred: ${e.message}"
            } finally {
                _devicesLoading.value = false
            }
        }
    }

    fun selectDevice(device: Device) {
        if (_selectedDevice.value?.deviceId != device.deviceId) {
            _selectedDevice.value = device
            loadLatestReading(device.deviceId)
            loadChartData(device.deviceId)
        }
    }

    fun clearSelectedDevice() {
        _selectedDevice.value = null
        _latestReading.value = null
        _chartData.value = null
    }

    fun setTimeRange(range: TimeRange) {
        if (_timeRange.value != range) {
            _timeRange.value = range
            _selectedDevice.value?.let { device ->
                loadChartData(device.deviceId)
            }
        }
    }

    private fun loadLatestReading(deviceId: String) {
        viewModelScope.launch {
            try {
                val result = readingRepository.getLatestReading(deviceId)
                result.onSuccess { response ->
                    _latestReading.value = response.reading
                }.onFailure {
                    // If we cannot get the latest reading, it's not critical
                    _latestReading.value = null
                }
            } catch (e: Exception) {
                _latestReading.value = null
            }
        }
    }

    private fun loadChartData(deviceId: String) {
        _chartLoading.value = true

        viewModelScope.launch {
            try {
                val now = LocalDateTime.now()
                val startDate = when (_timeRange.value) {
                    TimeRange.DAY -> now.minusDays(1)
                    TimeRange.WEEK -> now.minusWeeks(1)
                    TimeRange.MONTH -> now.minusMonths(1)
                    else -> now.minusDays(1)
                }

                val result = readingRepository.getDailyAverages(deviceId, startDate, now)
                result.onSuccess { response ->
                    _chartData.value = response
                }.onFailure {
                    _chartData.value = null
                    _error.value = "Failed to load chart data"
                }
            } catch (e: Exception) {
                _chartData.value = null
                _error.value = "An error occurred: ${e.message}"
            } finally {
                _chartLoading.value = false
            }
        }
    }

    fun refreshData() {
        loadDevices()

        _selectedDevice.value?.let { device ->
            loadLatestReading(device.deviceId)
            loadChartData(device.deviceId)
        }
    }

    enum class TimeRange {
        DAY, WEEK, MONTH
    }
}