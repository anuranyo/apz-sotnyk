package com.apzsotnyk.weightmonitor.ui.dashboard

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.apzsotnyk.weightmonitor.databinding.ItemReadingHistoryBinding
import com.apzsotnyk.weightmonitor.models.Reading
import java.text.SimpleDateFormat
import java.util.Locale

class ReadingHistoryAdapter :
    ListAdapter<Reading, ReadingHistoryAdapter.ReadingViewHolder>(ReadingDiffCallback()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ReadingViewHolder {
        val binding = ItemReadingHistoryBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return ReadingViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ReadingViewHolder, position: Int) {
        holder.bind(getItem(position))
    }

    class ReadingViewHolder(private val binding: ItemReadingHistoryBinding) :
        RecyclerView.ViewHolder(binding.root) {

        fun bind(reading: Reading) {
            binding.apply {
                // Format timestamp
                val formattedTime = try {
                    val dateFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US)
                    val date = dateFormat.parse(reading.timestamp)
                    date?.let {
                        SimpleDateFormat("MMM dd, yyyy HH:mm", Locale.US).format(it)
                    } ?: reading.timestamp
                } catch (e: Exception) {
                    reading.timestamp
                }

                tvTimestamp.text = formattedTime
                tvScale1.text = "${reading.scale1} kg"
                tvScale2.text = "${reading.scale2} kg"
                tvScale3.text = "${reading.scale3} kg"
                tvScale4.text = "${reading.scale4} kg"
                tvTotalWeight.text = "${reading.totalWeight} kg"
            }
        }
    }

    private class ReadingDiffCallback : DiffUtil.ItemCallback<Reading>() {
        override fun areItemsTheSame(oldItem: Reading, newItem: Reading): Boolean {
            return oldItem.id == newItem.id
        }

        override fun areContentsTheSame(oldItem: Reading, newItem: Reading): Boolean {
            return oldItem == newItem
        }
    }
}