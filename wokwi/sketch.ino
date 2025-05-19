#include "HX711.h"
#include <LiquidCrystal_I2C.h>
#include <EEPROM.h>
#include <WiFi.h>
#include "PubSubClient.h"
#include "DHTesp.h"
#include "ESP32Servo.h"

#define I2C_ADDR  0x27
#define CLK   13
#define DOUT1 18
#define DOUT2 19
#define DOUT3 17
#define DOUT4 16

#define SCALE_FACTOR 420.0
#define TARE_WEIGHT 0.2

#define BUTTON1 27
#define BUTTON2 32
#define BUTTON3 33
#define BUTTON4 34
#define BUTTON5 25

// WiFi credentials
const char* ssid = "Wokwi-GUEST";
const char* pass = "";

// MQTT configuration
const char* mqttServer = "broker.hivemq.com";  // Public MQTT broker for testing
const int mqttPort = 1883;
const char* mqttTopic = "weight-monitor/data";
const char* mqttClientId = "esp32-weight-monitor";  // Unique client ID

byte DOUTS[4] = {DOUT1, DOUT2, DOUT3, DOUT4};
constexpr int channelCount = 4;
HX711 scales[channelCount];
LiquidCrystal_I2C lcd(I2C_ADDR, 16, 2);
WiFiClient espClient;
PubSubClient mqttClient(espClient);

bool buttonStates[5] = {HIGH, HIGH, HIGH, HIGH, HIGH};
bool previousButtonStates[5] = {HIGH, HIGH, HIGH, HIGH, HIGH};
unsigned long lastDebounceTime[5] = {0, 0, 0, 0, 0};
unsigned long debounceDelay = 50; // Debounce time 50 ms

float previousWeights[4] = {0.0, 0.0, 0.0, 0.0};
int selectedScale = -1;
unsigned long lastButtonPressTime = 0;
unsigned long lastMqttSendTime = 0;  // Changed from HTTP to MQTT
unsigned long lastLcdUpdateTime = 0;

// Function prototype, declared before `setup()`
void loadTareValues();
void reconnectMqtt();

void setup() {
  Serial.begin(115200);

  pinMode(BUTTON1, INPUT_PULLUP);
  pinMode(BUTTON2, INPUT_PULLUP);
  pinMode(BUTTON3, INPUT_PULLUP);
  pinMode(BUTTON4, INPUT_PULLUP);
  pinMode(BUTTON5, INPUT_PULLUP);

  lcd.init();
  lcd.backlight();
  lcd.print("HX711-Multi");
  delay(2000);
  lcd.clear();

  for (int i = 0; i < channelCount; i++) {
    scales[i].begin(DOUTS[i], CLK);
    scales[i].set_scale(SCALE_FACTOR);
  }

  loadTareValues();

  WiFi.begin(ssid, pass);
  lcd.print("Connecting WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    lcd.print(".");
  }
  lcd.clear();
  lcd.print("WiFi Connected");
  delay(1000);

  // Set up MQTT connection
  mqttClient.setServer(mqttServer, mqttPort);

  // Try to connect to MQTT broker
  reconnectMqtt();

  lcd.clear();
}

// Properly declared `loadTareValues()`
void loadTareValues() {
  for (int i = 0; i < channelCount; i++) {
    long tareValue = 0;
    EEPROM.get(i * sizeof(long), tareValue);
    scales[i].set_offset(tareValue);
  }
}

// Reconnect to MQTT broker
void reconnectMqtt() {
  int attempts = 0;
  lcd.clear();
  lcd.print("MQTT connecting");

  // Loop until connected or max attempts
  while (!mqttClient.connected() && attempts < 5) {
    Serial.println("Attempting MQTT connection...");

    if (mqttClient.connect(mqttClientId)) {
      Serial.println("Connected to MQTT broker");
      lcd.clear();
      lcd.print("MQTT Connected");
      delay(1000);
    } else {
      Serial.print("Failed, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" Retrying in 2 seconds");
      lcd.print(".");
      delay(2000);
      attempts++;
    }
  }

  if (!mqttClient.connected()) {
    lcd.clear();
    lcd.print("MQTT Failed");
    Serial.println("Failed to connect to MQTT after max attempts");
    delay(1000);
  }
}

void loop() {
  // Ensure MQTT is connected
  if (!mqttClient.connected()) {
    reconnectMqtt();
  }
  mqttClient.loop();

  updateButtonStates();

  // Timer to return to all sensors mode
  if (millis() - lastButtonPressTime > 500) {
    selectedScale = -1;
  }

  // Update display every 300 ms
  if (millis() - lastLcdUpdateTime > 300) {
    if (selectedScale >= 0) {
      displaySingleScale(selectedScale);
    } else {
      displayAllScales();
    }
    lastLcdUpdateTime = millis();
  }

  // Send data via MQTT every 10 seconds
  if (millis() - lastMqttSendTime >= 10000) {
    sendMqttData();
    lastMqttSendTime = millis();
  }
}

// 🔹 Update button states (with debounce)
void updateButtonStates() {
  for (int i = 0; i < 4; i++) {
    int reading = digitalRead(getButtonPin(i));

    // If button state changed, reset debounce timer
    if (reading != previousButtonStates[i]) {
      lastDebounceTime[i] = millis();
    }

    // If debounce time passed and state changed
    if ((millis() - lastDebounceTime[i]) > debounceDelay) {
      if (reading == LOW && buttonStates[i] == HIGH) {
        Serial.print("Button ");
        Serial.print(i + 1);
        Serial.println(" pressed");

        selectedScale = i;
        lastButtonPressTime = millis();
      }
      buttonStates[i] = reading;
    }
    previousButtonStates[i] = reading;
  }
}

// Get button pin
int getButtonPin(int buttonIndex) {
  switch (buttonIndex) {
    case 0: return BUTTON1;
    case 1: return BUTTON2;
    case 2: return BUTTON3;
    case 3: return BUTTON4;
    default: return -1;
  }
}

// 🔹 Display single scale
void displaySingleScale(int scaleNumber) {
  static float lastWeight = -1000;
  float currentWeight = getAdjustedWeight(scaleNumber);

  if (abs(currentWeight - lastWeight) > 0.05) {
    lastWeight = currentWeight;

    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Scale ");
    lcd.print(scaleNumber + 1);
    lcd.print(": ");
    lcd.print(currentWeight, 2);
    lcd.print(" kg");
  }
}

// 🔹 Display all scales
void displayAllScales() {
  static float lastWeights[4] = {-1000, -1000, -1000, -1000};
  bool updated = false;

  for (int i = 0; i < channelCount; i++) {
    float currentWeight = getAdjustedWeight(i);
    if (abs(currentWeight - lastWeights[i]) > 0.05) {
      lastWeights[i] = currentWeight;
      updated = true;
    }
  }

  if (updated) {
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("S1:"); lcd.print(lastWeights[0], 2);
    lcd.print(" S2:"); lcd.print(lastWeights[1], 2);

    lcd.setCursor(0, 1);
    lcd.print("S3:"); lcd.print(lastWeights[2], 2);
    lcd.print(" S4:"); lcd.print(lastWeights[3], 2);
  }
}

// 🔹 Get weight with tare adjustment
float getAdjustedWeight(int scaleIndex) {
  return scales[scaleIndex].get_units() - TARE_WEIGHT;
}

// 🔹 Send data via MQTT instead of HTTP
void sendMqttData() {
  float currentWeights[4];

  for (int i = 0; i < channelCount; i++) {
    currentWeights[i] = getAdjustedWeight(i);
  }

  // Create JSON payload
  String jsonPayload = "{";
  jsonPayload += "\"user_id\":1,";
  jsonPayload += "\"scale1\":" + String(currentWeights[0], 2) + ",";
  jsonPayload += "\"scale2\":" + String(currentWeights[1], 2) + ",";
  jsonPayload += "\"scale3\":" + String(currentWeights[2], 2) + ",";
  jsonPayload += "\"scale4\":" + String(currentWeights[3], 2);
  jsonPayload += "}";

  Serial.println("MQTT Payload: " + jsonPayload);

  // Publish to MQTT topic
  if (mqttClient.connected()) {
    if (mqttClient.publish(mqttTopic, jsonPayload.c_str())) {
      Serial.println("MQTT message sent successfully");
    } else {
      Serial.println("Failed to send MQTT message");
    }
  } else {
    Serial.println("MQTT Disconnected");
    reconnectMqtt();
  }
}