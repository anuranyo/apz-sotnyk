package com.apzsotnyk.weightmonitor.ui.dashboard

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.apzsotnyk.weightmonitor.R
import com.apzsotnyk.weightmonitor.databinding.ItemDeviceBinding
import com.apzsotnyk.weightmonitor.models.Device
import java.text.SimpleDateFormat
import java.util.Locale

class DeviceAdapter(private val onDeviceClick: (Device) -> Unit) :
    ListAdapter<Device, DeviceAdapter.DeviceViewHolder>(DeviceDiffCallback()) {

    private var selectedPosition = RecyclerView.NO_POSITION

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): DeviceViewHolder {
        val binding = ItemDeviceBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return DeviceViewHolder(binding)
    }

    override fun onBindViewHolder(holder: DeviceViewHolder, position: Int) {
        val device = getItem(position)
        holder.bind(device, position == selectedPosition)
    }

    fun setSelectedDevice(device: Device?) {
        val oldSelectedPosition = selectedPosition
        if (device == null) {
            selectedPosition = RecyclerView.NO_POSITION
        } else {
            val newPosition = currentList.indexOfFirst { it.deviceId == device.deviceId }
            if (newPosition != -1) {
                selectedPosition = newPosition
            }
        }

        if (oldSelectedPosition != RecyclerView.NO_POSITION) {
            notifyItemChanged(oldSelectedPosition)
        }
        if (selectedPosition != RecyclerView.NO_POSITION) {
            notifyItemChanged(selectedPosition)
        }
    }

    inner class DeviceViewHolder(private val binding: ItemDeviceBinding) :
        RecyclerView.ViewHolder(binding.root) {

        init {
            binding.root.setOnClickListener {
                val position = adapterPosition
                if (position != RecyclerView.NO_POSITION) {
                    val oldSelectedPosition = selectedPosition
                    selectedPosition = position

                    if (oldSelectedPosition != RecyclerView.NO_POSITION) {
                        notifyItemChanged(oldSelectedPosition)
                    }
                    notifyItemChanged(selectedPosition)

                    onDeviceClick(getItem(position))
                }
            }
        }

        fun bind(device: Device, isSelected: Boolean) {
            binding.apply {
                tvDeviceName.text = device.name
                tvDeviceScales.text = "${device.numberOfScales} scale${if (device.numberOfScales > 1) "s" else ""}"

                // Set device status style
                val statusBg = when (device.status) {
                    "active" -> R.drawable.bg_status_active
                    "maintenance" -> R.drawable.bg_status_maintenance
                    else -> R.drawable.bg_status_inactive
                }
                tvDeviceStatus.background = ContextCompat.getDrawable(root.context, statusBg)
                tvDeviceStatus.text = device.status.capitalize()

                // Format last active time
                if (device.lastActive != null) {
                    try {
                        val dateFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US)
                        val date = dateFormat.parse(device.lastActive)
                        val formattedDate = date?.let {
                            SimpleDateFormat("MMM dd, yyyy hh:mm a", Locale.US).format(it)
                        } ?: "Unknown"
                        tvLastActive.text = "Last active: $formattedDate"
                    } catch (e: Exception) {
                        tvLastActive.text = "Last active: ${device.lastActive}"
                    }
                } else {
                    tvLastActive.text = "Last active: Never"
                }

                // Highlight selected device
                root.setCardBackgroundColor(
                    ContextCompat.getColor(
                        root.context,
                        if (isSelected) R.color.medium_gray else R.color.light_gray
                    )
                )
            }
        }
    }

    private class DeviceDiffCallback : DiffUtil.ItemCallback<Device>() {
        override fun areItemsTheSame(oldItem: Device, newItem: Device): Boolean {
            return oldItem.deviceId == newItem.deviceId
        }

        override fun areContentsTheSame(oldItem: Device, newItem: Device): Boolean {
            return oldItem == newItem
        }
    }
}