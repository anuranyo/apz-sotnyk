package com.apzsotnyk.weightmonitor.ui.devices

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.apzsotnyk.weightmonitor.R

class DeviceSettingsFragment : Fragment() {
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // You'll need to create this layout file
        return inflater.inflate(R.layout.fragment_device_settings, container, false)
    }
}