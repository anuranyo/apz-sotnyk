package com.apzsotnyk.weightmonitor.ui.settings

import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.lifecycle.lifecycleScope
import androidx.navigation.fragment.findNavController
import com.apzsotnyk.weightmonitor.R
import com.apzsotnyk.weightmonitor.databinding.FragmentSettingsBinding
import com.apzsotnyk.weightmonitor.ui.auth.AuthViewModel
import com.apzsotnyk.weightmonitor.utils.TokenManager
import kotlinx.coroutines.launch

class SettingsFragment : Fragment() {
    private var _binding: FragmentSettingsBinding? = null
    private val binding get() = _binding!!

    private val authViewModel: AuthViewModel by viewModels()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentSettingsBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setupToolbar()
        setupListeners()
    }

    private fun setupToolbar() {
        binding.toolbar.setNavigationOnClickListener {
            findNavController().navigateUp()
        }
    }

    private fun setupListeners() {
        binding.btnLogout.setOnClickListener {
            logout()
        }

        // Example setting items
        binding.tvProfileSettingsItem.setOnClickListener {
            Toast.makeText(requireContext(), "Profile settings (not implemented)", Toast.LENGTH_SHORT).show()
        }

        binding.tvDarkModeItem.setOnClickListener {
            Toast.makeText(requireContext(), "Dark mode is always on in this app", Toast.LENGTH_SHORT).show()
        }

        binding.tvNotificationsItem.setOnClickListener {
            Toast.makeText(requireContext(), "Notifications settings (not implemented)", Toast.LENGTH_SHORT).show()
        }

        binding.tvAboutItem.setOnClickListener {
            Toast.makeText(requireContext(), "Weight Monitor App for ESP32 Devices", Toast.LENGTH_SHORT).show()
        }

        binding.tvHelp.setOnClickListener {
            Toast.makeText(requireContext(), "Help & Support (not implemented)", Toast.LENGTH_SHORT).show()
        }
    }

    private fun logout() {
        lifecycleScope.launch {
            TokenManager.clearToken(requireContext())
            findNavController().navigate(R.id.action_settings_to_login)
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}