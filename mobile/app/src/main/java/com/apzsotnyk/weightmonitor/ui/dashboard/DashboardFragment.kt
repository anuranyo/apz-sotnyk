package com.apzsotnyk.weightmonitor.ui.dashboard

import android.graphics.Color
import android.os.Bundle
import android.view.LayoutInflater
import android.view.Menu
import android.view.MenuInflater
import android.view.MenuItem
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import com.apzsotnyk.weightmonitor.R
import com.apzsotnyk.weightmonitor.databinding.FragmentDashboardBinding
import com.apzsotnyk.weightmonitor.models.DailyAveragesResponse
import com.apzsotnyk.weightmonitor.models.Device
import com.apzsotnyk.weightmonitor.models.Reading
import com.github.mikephil.charting.components.Legend
import com.github.mikephil.charting.components.XAxis
import com.github.mikephil.charting.data.Entry
import com.github.mikephil.charting.data.LineData
import com.github.mikephil.charting.data.LineDataSet
import com.github.mikephil.charting.formatter.IndexAxisValueFormatter
import com.github.mikephil.charting.interfaces.datasets.ILineDataSet
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class DashboardFragment : Fragment() {
    private var _binding: FragmentDashboardBinding? = null
    private val binding get() = _binding!!

    private val viewModel: DashboardViewModel by viewModels()
    private lateinit var deviceAdapter: DeviceAdapter
    private lateinit var readingHistoryAdapter: ReadingHistoryAdapter

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentDashboardBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setHasOptionsMenu(true)
        setupRecyclerView()
//        setupTimeRangeChips()
        setupChartView()
        setupListeners()
        setupObservers()

        // Load devices from the API
        viewModel.loadDevices()
    }

    private fun setupRecyclerView() {
        // Setup device adapter
        deviceAdapter = DeviceAdapter { device ->
            viewModel.selectDevice(device)
        }

        binding.rvDevices.apply {
            layoutManager = LinearLayoutManager(requireContext())
            adapter = deviceAdapter
        }

        // Setup reading history adapter
        readingHistoryAdapter = ReadingHistoryAdapter()
        binding.rvReadingHistory.apply {
            layoutManager = LinearLayoutManager(requireContext())
            adapter = readingHistoryAdapter
        }
    }

//    private fun setupTimeRangeChips() {
//        binding.chipDay.setOnClickListener {
//            viewModel.setTimeRange(DashboardViewModel.TimeRange.DAY)
//        }
//
//        binding.chipWeek.setOnClickListener {
//            viewModel.setTimeRange(DashboardViewModel.TimeRange.WEEK)
//        }
//
//        binding.chipMonth.setOnClickListener {
//            viewModel.setTimeRange(DashboardViewModel.TimeRange.MONTH)
//        }
//    }

    private fun setupChartView() {
        binding.lineChart.apply {
            description.isEnabled = false
            legend.textColor = ContextCompat.getColor(requireContext(), R.color.primary_text)
            legend.textSize = 12f
            legend.form = Legend.LegendForm.CIRCLE

            xAxis.apply {
                position = XAxis.XAxisPosition.BOTTOM
                textColor = ContextCompat.getColor(requireContext(), R.color.primary_text)
                setDrawGridLines(false)
                granularity = 1f
            }

            axisLeft.apply {
                textColor = ContextCompat.getColor(requireContext(), R.color.primary_text)
                setDrawGridLines(true)
                gridColor = ContextCompat.getColor(requireContext(), R.color.medium_gray)
                granularity = 1f
            }

            axisRight.apply {
                isEnabled = false
            }

            setTouchEnabled(true)
            isDragEnabled = true
            setScaleEnabled(true)
            setPinchZoom(true)
            setNoDataText("No data available")
            setNoDataTextColor(ContextCompat.getColor(requireContext(), R.color.secondary_text))

            // Set animations
            animateX(1000)
        }
    }

    private fun setupListeners() {
        binding.swipeRefreshLayout.setOnRefreshListener {
            viewModel.refreshData()
        }

        binding.fabAddDevice.setOnClickListener {
            findNavController().navigate(R.id.action_dashboard_to_addDevice)
        }

        binding.btnAddFirstDevice.setOnClickListener {
            findNavController().navigate(R.id.action_dashboard_to_addDevice)
        }

        binding.btnViewDetails.setOnClickListener {
            viewModel.selectedDevice.value?.let { device ->
                val action = DashboardFragmentDirections.actionDashboardToDeviceDetail(device.deviceId)
                findNavController().navigate(action)
            }
        }

        binding.btnDeviceSettings.setOnClickListener {
            viewModel.selectedDevice.value?.let { device ->
                val action = DashboardFragmentDirections.actionDashboardToDeviceDetail(device.deviceId)
                findNavController().navigate(action)
            }
        }

        binding.btnViewAllHistory.setOnClickListener {
            viewModel.selectedDevice.value?.let { device ->
                // Refresh history data
                viewModel.loadReadingHistory(device.deviceId)
                Toast.makeText(
                    requireContext(),
                    "Showing the latest readings. Full history view coming soon!",
                    Toast.LENGTH_SHORT
                ).show()
            }
        }

        // If you have a profile button in your layout
        try {
            binding.btnProfile?.setOnClickListener {
                findNavController().navigate(R.id.action_dashboard_to_profile)
            }
        } catch (e: Exception) {
            // Button might not exist yet
        }
    }

    private fun setupObservers() {
        // Observe devices loading state
        viewModel.devicesLoading.observe(viewLifecycleOwner) { isLoading ->
            binding.devicesProgressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
            binding.swipeRefreshLayout.isRefreshing = isLoading
        }

        // Observe devices list
        viewModel.devices.observe(viewLifecycleOwner) { devices ->
            deviceAdapter.submitList(devices)

            // Show empty view if no devices
            if (devices.isEmpty()) {
                binding.rvDevices.visibility = View.GONE
                binding.emptyDevicesView.visibility = View.VISIBLE
            } else {
                binding.rvDevices.visibility = View.VISIBLE
                binding.emptyDevicesView.visibility = View.GONE
            }
        }

        // Observe selected device
        viewModel.selectedDevice.observe(viewLifecycleOwner) { device ->
            deviceAdapter.setSelectedDevice(device)
            updateSelectedDeviceUI(device)

            // Load reading history when device is selected
            device?.deviceId?.let { deviceId ->
                viewModel.loadReadingHistory(deviceId)
            }
        }

        // Observe latest reading
        viewModel.latestReading.observe(viewLifecycleOwner) { reading ->
            updateReadingUI(reading)
        }

        // Observe chart data
        viewModel.chartData.observe(viewLifecycleOwner) { data ->
            if (data != null && data.averages.isNotEmpty()) {
                updateChartData(data)
                binding.lineChart.visibility = View.VISIBLE
                binding.tvNoChartData.visibility = View.GONE
            } else {
                binding.lineChart.visibility = View.GONE
                binding.tvNoChartData.visibility = View.VISIBLE
            }
        }

        // Observe chart loading state
        viewModel.chartLoading.observe(viewLifecycleOwner) { isLoading ->
            binding.chartProgressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
        }

//        // Observe time range
//        viewModel.timeRange.observe(viewLifecycleOwner) { range ->
//            when (range) {
//                DashboardViewModel.TimeRange.DAY -> binding.chipDay.isChecked = true
//                DashboardViewModel.TimeRange.WEEK -> binding.chipWeek.isChecked = true
//                DashboardViewModel.TimeRange.MONTH -> binding.chipMonth.isChecked = true
//            }
//        }

        // Observe reading history
        viewModel.readingHistory.observe(viewLifecycleOwner) { readings ->
            readingHistoryAdapter.submitList(readings)

            if (readings.isEmpty()) {
                binding.rvReadingHistory.visibility = View.GONE
                binding.tvNoHistoryData.visibility = View.VISIBLE
            } else {
                binding.rvReadingHistory.visibility = View.VISIBLE
                binding.tvNoHistoryData.visibility = View.GONE
            }
        }

        // Observe history loading state
        viewModel.historyLoading.observe(viewLifecycleOwner) { isLoading ->
            binding.historyProgressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
        }

        // Observe errors
        viewModel.error.observe(viewLifecycleOwner) { error ->
            if (!error.isNullOrEmpty()) {
                Toast.makeText(requireContext(), error, Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun updateSelectedDeviceUI(device: Device?) {
        if (device == null) {
            binding.cardSelectedDevice.visibility = View.GONE
            binding.cardNoDevice.visibility = View.VISIBLE
            binding.tvChartTitle.visibility = View.GONE
            binding.cardChart.visibility = View.GONE
            binding.tvHistoryTitle.visibility = View.GONE
            binding.cardHistory.visibility = View.GONE
            return
        }

        binding.cardSelectedDevice.visibility = View.VISIBLE
        binding.cardNoDevice.visibility = View.GONE
        binding.tvChartTitle.visibility = View.VISIBLE
        binding.cardChart.visibility = View.VISIBLE
        binding.tvHistoryTitle.visibility = View.VISIBLE
        binding.cardHistory.visibility = View.VISIBLE

        // Update device info
        binding.tvDeviceName.text = device.name

        // Set device status style
        val statusBg = when (device.status) {
            "active" -> R.drawable.bg_status_active
            "maintenance" -> R.drawable.bg_status_maintenance
            else -> R.drawable.bg_status_inactive
        }
        binding.tvDeviceStatus.background = ContextCompat.getDrawable(requireContext(), statusBg)
        binding.tvDeviceStatus.text = device.status.replaceFirstChar {
            if (it.isLowerCase()) it.titlecase(Locale.getDefault()) else it.toString()
        }

        // Format last active time
        if (device.lastActive != null) {
            try {
                val dateFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US)
                val date = dateFormat.parse(device.lastActive)
                val formattedDate = date?.let {
                    SimpleDateFormat("MMM dd, yyyy hh:mm a", Locale.US).format(it)
                } ?: "Unknown"
                binding.tvLastActive.text = "Last active: $formattedDate"
            } catch (e: Exception) {
                binding.tvLastActive.text = "Last active: ${device.lastActive}"
            }
        } else {
            binding.tvLastActive.text = "Last active: Never"
        }

        // Show/hide scale cards based on device configuration
        binding.cardScale2.visibility = if (device.numberOfScales >= 2) View.VISIBLE else View.GONE
        binding.cardScale3.visibility = if (device.numberOfScales >= 3) View.VISIBLE else View.GONE
        binding.cardScale4.visibility = if (device.numberOfScales >= 4) View.VISIBLE else View.GONE
    }

    private fun updateReadingUI(reading: Reading?) {
        // Default value if reading is null
        val defaultValue = "0.00 kg"

        if (reading == null) {
            binding.tvScale1.text = defaultValue
            binding.tvScale2.text = defaultValue
            binding.tvScale3.text = defaultValue
            binding.tvScale4.text = defaultValue
            return
        }

        binding.tvScale1.text = "${reading.scale1.toFloat()} kg"
        binding.tvScale2.text = "${reading.scale2.toFloat()} kg"
        binding.tvScale3.text = "${reading.scale3.toFloat()} kg"
        binding.tvScale4.text = "${reading.scale4.toFloat()} kg"
    }

    private fun updateChartData(data: DailyAveragesResponse) {
        // Create separate entries for each scale
        val entries1 = ArrayList<Entry>()
        val entries2 = ArrayList<Entry>()
        val entries3 = ArrayList<Entry>()
        val entries4 = ArrayList<Entry>()
        val labels = ArrayList<String>()

        // Process data points
        data.averages.forEachIndexed { index, dailyAverage ->
            entries1.add(Entry(index.toFloat(), dailyAverage.scale1Avg.toFloat()))
            entries2.add(Entry(index.toFloat(), dailyAverage.scale2Avg.toFloat()))
            entries3.add(Entry(index.toFloat(), dailyAverage.scale3Avg.toFloat()))
            entries4.add(Entry(index.toFloat(), dailyAverage.scale4Avg.toFloat()))

            // Format date for label
            try {
                val dateFormat = SimpleDateFormat("yyyy-MM-dd", Locale.US)
                val date = dateFormat.parse(dailyAverage.date)
                labels.add(SimpleDateFormat("MM/dd", Locale.US).format(date ?: Date()))
            } catch (e: Exception) {
                labels.add(dailyAverage.date)
            }
        }

        // Create dataset list that implements ILineDataSet
        val dataSets = ArrayList<ILineDataSet>()

        // Only add datasets for scales that the device has
        viewModel.selectedDevice.value?.let { device ->
            // Always add Scale 1
            val dataSet1 = LineDataSet(entries1, "Scale 1")
            dataSet1.apply {
                color = Color.BLUE
                setCircleColor(Color.BLUE)
                lineWidth = 2f
                circleRadius = 4f
                setDrawValues(false)
                mode = LineDataSet.Mode.CUBIC_BEZIER
            }
            dataSets.add(dataSet1)

            // Add Scale 2 if device has it
            if (device.numberOfScales >= 2) {
                val dataSet2 = LineDataSet(entries2, "Scale 2")
                dataSet2.apply {
                    color = Color.RED
                    setCircleColor(Color.RED)
                    lineWidth = 2f
                    circleRadius = 4f
                    setDrawValues(false)
                    mode = LineDataSet.Mode.CUBIC_BEZIER
                }
                dataSets.add(dataSet2)
            }

            // Add Scale 3 if device has it
            if (device.numberOfScales >= 3) {
                val dataSet3 = LineDataSet(entries3, "Scale 3")
                dataSet3.apply {
                    color = Color.GREEN
                    setCircleColor(Color.GREEN)
                    lineWidth = 2f
                    circleRadius = 4f
                    setDrawValues(false)
                    mode = LineDataSet.Mode.CUBIC_BEZIER
                }
                dataSets.add(dataSet3)
            }

            // Add Scale 4 if device has it
            if (device.numberOfScales >= 4) {
                val dataSet4 = LineDataSet(entries4, "Scale 4")
                dataSet4.apply {
                    color = Color.YELLOW
                    setCircleColor(Color.YELLOW)
                    lineWidth = 2f
                    circleRadius = 4f
                    setDrawValues(false)
                    mode = LineDataSet.Mode.CUBIC_BEZIER
                }
                dataSets.add(dataSet4)
            }
        }

        // Set data to chart with proper ILineDataSet implementation
        val lineData = LineData(dataSets)
        binding.lineChart.data = lineData

        // Set X-axis labels
        binding.lineChart.xAxis.valueFormatter = IndexAxisValueFormatter(labels)
        binding.lineChart.xAxis.labelCount = labels.size.coerceAtMost(7)

        // Set minimum and maximum Y-axis values for better scaling
        binding.lineChart.axisLeft.axisMinimum = 0f

        // Refresh the chart
        binding.lineChart.invalidate()
    }

    override fun onCreateOptionsMenu(menu: Menu, inflater: MenuInflater) {
        inflater.inflate(R.menu.menu_dashboard, menu)
        super.onCreateOptionsMenu(menu, inflater)
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            R.id.action_profile -> {
                findNavController().navigate(R.id.action_dashboard_to_profile)
                true
            }
            R.id.action_settings -> {
                findNavController().navigate(R.id.action_dashboard_to_settings)
                true
            }
            R.id.action_refresh -> {
                viewModel.refreshData()
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}