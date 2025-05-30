package com.apzsotnyk.weightmonitor.utils

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "user_preferences")

object TokenManager {
    private val TOKEN_KEY = stringPreferencesKey("jwt_token")
    private val USER_ID_KEY = stringPreferencesKey("user_id")

    var token: String? = null
        private set

    suspend fun saveToken(context: Context, token: String) {
        this.token = token
        context.dataStore.edit { preferences ->
            preferences[TOKEN_KEY] = token
        }
    }

    suspend fun saveUserId(context: Context, userId: String) {
        context.dataStore.edit { preferences ->
            preferences[USER_ID_KEY] = userId
        }
    }

    fun getToken(context: Context): Flow<String?> {
        return context.dataStore.data.map { preferences ->
            preferences[TOKEN_KEY]?.also {
                token = it
            }
        }
    }

    fun getUserId(context: Context): Flow<String?> {
        return context.dataStore.data.map { preferences ->
            preferences[USER_ID_KEY]
        }
    }

    suspend fun clearToken(context: Context) {
        token = null
        context.dataStore.edit { preferences ->
            preferences.remove(TOKEN_KEY)
            preferences.remove(USER_ID_KEY)
        }
    }
}