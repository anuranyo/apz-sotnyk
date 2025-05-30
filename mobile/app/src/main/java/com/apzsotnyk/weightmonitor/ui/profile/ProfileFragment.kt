package com.apzsotnyk.weightmonitor.ui.profile

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.findNavController
import com.apzsotnyk.weightmonitor.databinding.FragmentProfileBinding

class ProfileFragment : Fragment() {
    private var _binding: FragmentProfileBinding? = null
    private val binding get() = _binding!!

    private val viewModel: ProfileViewModel by viewModels()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentProfileBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setupToolbar()
        setupObservers()

        // Load user profile
        viewModel.loadUserProfile()
    }

    private fun setupToolbar() {
        binding.toolbar.setNavigationOnClickListener {
            findNavController().navigateUp()
        }
    }

    private fun setupObservers() {
        viewModel.user.observe(viewLifecycleOwner) { user ->
            if (user != null) {
                binding.tvUserName.text = user.name
                binding.tvUserEmail.text = user.email
                binding.tvUserRole.text = "Role: ${user.role}"

                // Format created date if available
                user.createdAt?.let { createdAt ->
                    binding.tvAccountCreated.text = "Account created: ${formatDate(createdAt)}"
                    binding.tvAccountCreated.visibility = View.VISIBLE
                } ?: run {
                    binding.tvAccountCreated.visibility = View.GONE
                }

                // Format last login if available
                user.lastLogin?.let { lastLogin ->
                    binding.tvLastLogin.text = "Last login: ${formatDate(lastLogin)}"
                    binding.tvLastLogin.visibility = View.VISIBLE
                } ?: run {
                    binding.tvLastLogin.visibility = View.GONE
                }
            }
        }

        viewModel.isLoading.observe(viewLifecycleOwner) { isLoading ->
            binding.progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
            binding.profileContent.visibility = if (isLoading) View.GONE else View.VISIBLE
        }

        viewModel.error.observe(viewLifecycleOwner) { error ->
            if (!error.isNullOrEmpty()) {
                Toast.makeText(requireContext(), error, Toast.LENGTH_SHORT).show()
            }
        }

        // Setup button click listeners
        binding.btnEditProfile.setOnClickListener {
            Toast.makeText(requireContext(), "Edit profile functionality coming soon!", Toast.LENGTH_SHORT).show()
        }

        binding.btnChangePassword.setOnClickListener {
            Toast.makeText(requireContext(), "Change password functionality coming soon!", Toast.LENGTH_SHORT).show()
        }
    }

    private fun formatDate(dateString: String): String {
        return try {
            // Implement date formatting logic here
            // For simplicity, we're just returning the string as is
            dateString
        } catch (e: Exception) {
            dateString
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}