package com.apzsotnyk.weightmonitor

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.navigation.fragment.NavHostFragment
import com.apzsotnyk.weightmonitor.databinding.ActivityMainBinding
import com.apzsotnyk.weightmonitor.utils.TokenManager
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import com.apzsotnyk.weightmonitor.R

class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Check if user is already logged in
        lifecycleScope.launch {
            val token = TokenManager.getToken(applicationContext).first()
            if (!token.isNullOrBlank()) {
                // User is logged in, navigate to dashboard
                val navHostFragment = supportFragmentManager
                    .findFragmentById(R.id.nav_host_fragment) as NavHostFragment
                val navController = navHostFragment.navController
                val navGraph = navController.navInflater.inflate(R.navigation.nav_graph)
                navGraph.setStartDestination(R.id.dashboardFragment)
                navController.graph = navGraph
            }
        }
    }
}