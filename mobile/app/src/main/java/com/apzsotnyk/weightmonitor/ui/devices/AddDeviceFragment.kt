package com.apzsotnyk.weightmonitor.ui.devices

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.findNavController
import com.apzsotnyk.weightmonitor.databinding.FragmentAddDeviceBinding
import com.google.android.material.tabs.TabLayout

class AddDeviceFragment : Fragment() {
    private var _binding: FragmentAddDeviceBinding? = null
    private val binding get() = _binding!!

    private val viewModel: AddDeviceViewModel by viewModels()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentAddDeviceBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setupToolbar()
        setupTabs()
        setupListeners()
        setupObservers()
    }

    private fun setupToolbar() {
        binding.toolbar.setNavigationOnClickListener {
            findNavController().navigateUp()
        }
    }

    private fun setupTabs() {
        binding.tabLayout.addOnTabSelectedListener(object : TabLayout.OnTabSelectedListener {
            override fun onTabSelected(tab: TabLayout.Tab?) {
                when (tab?.position) {
                    0 -> {
                        binding.newDeviceForm.visibility = View.VISIBLE
                        binding.connectDeviceForm.visibility = View.GONE
                    }
                    1 -> {
                        binding.newDeviceForm.visibility = View.GONE
                        binding.connectDeviceForm.visibility = View.VISIBLE
                    }
                }
            }

            override fun onTabUnselected(tab: TabLayout.Tab?) {}

            override fun onTabReselected(tab: TabLayout.Tab?) {}
        })
    }

    private fun setupListeners() {
        binding.btnRegisterDevice.setOnClickListener {
            val name = binding.etDeviceName.text.toString().trim()
            val location = binding.etLocation.text.toString().trim()
            val notes = binding.etNotes.text.toString().trim()

            val numberOfScales = when {
                binding.radioOne.isChecked -> 1
                binding.radioTwo.isChecked -> 2
                binding.radioThree.isChecked -> 3
                else -> 4
            }

            if (validateNewDeviceForm(name)) {
                viewModel.registerDevice(name, numberOfScales, location, notes)
            }
        }

        binding.btnConnectDevice.setOnClickListener {
            val deviceId = binding.etDeviceId.text.toString().trim()
            val ownerPassword = binding.etOwnerPassword.text.toString().trim()

            if (validateConnectForm(deviceId, ownerPassword)) {
                viewModel.connectToDevice(deviceId, ownerPassword)
            }
        }
    }

    private fun setupObservers() {
        viewModel.isLoading.observe(viewLifecycleOwner) { isLoading ->
            binding.progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
            binding.btnRegisterDevice.isEnabled = !isLoading
            binding.btnConnectDevice.isEnabled = !isLoading
        }

        viewModel.registerResult.observe(viewLifecycleOwner) { result ->
            result.onSuccess {
                Toast.makeText(requireContext(), "Device registered successfully", Toast.LENGTH_SHORT).show()
                findNavController().navigateUp()
            }.onFailure { exception ->
                Toast.makeText(requireContext(), "Failed to register device: ${exception.message}", Toast.LENGTH_SHORT).show()
            }
        }

        viewModel.connectResult.observe(viewLifecycleOwner) { result ->
            result.onSuccess {
                Toast.makeText(requireContext(), "Connected to device successfully", Toast.LENGTH_SHORT).show()
                findNavController().navigateUp()
            }.onFailure { exception ->
                Toast.makeText(requireContext(), "Failed to connect to device: ${exception.message}", Toast.LENGTH_SHORT).show()
            }
        }

        viewModel.error.observe(viewLifecycleOwner) { error ->
            if (!error.isNullOrEmpty()) {
                Toast.makeText(requireContext(), error, Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun validateNewDeviceForm(name: String): Boolean {
        var isValid = true

        if (name.isEmpty()) {
            binding.tilDeviceName.error = "Device name is required"
            isValid = false
        } else {
            binding.tilDeviceName.error = null
        }

        return isValid
    }

    private fun validateConnectForm(deviceId: String, ownerPassword: String): Boolean {
        var isValid = true

        if (deviceId.isEmpty()) {
            binding.tilDeviceId.error = "Device ID is required"
            isValid = false
        } else {
            binding.tilDeviceId.error = null
        }

        if (ownerPassword.isEmpty()) {
            binding.tilOwnerPassword.error = "Owner password is required"
            isValid = false
        } else {
            binding.tilOwnerPassword.error = null
        }

        return isValid
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}