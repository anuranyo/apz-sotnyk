const mqtt = require('mqtt');
require('dotenv').config();

// Import models
const Reading = require('../models/Reading');
const Device = require('../models/Device');

// MQTT Configuration
const mqttOptions = {
  host: process.env.MQTT_BROKER,
  port: process.env.MQTT_PORT,
  clientId: process.env.MQTT_CLIENT_ID + '_' + Math.random().toString(16).substring(2, 8),
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 1000,
};

// Initialize MQTT client
const client = mqtt.connect(`mqtt://${process.env.MQTT_BROKER}`, mqttOptions);

// Connect and subscribe to topic
const connectMqtt = () => {
  client.on('connect', () => {
    console.log('Connected to MQTT broker');
    
    // Subscribe to the main topic and device-specific topics
    client.subscribe(process.env.MQTT_TOPIC, (err) => {
      if (!err) {
        console.log(`Subscribed to ${process.env.MQTT_TOPIC}`);
      } else {
        console.error('Subscription error:', err);
      }
    });
    
    // We'll subscribe to device-specific topics dynamically when devices are registered
    // Format: weight-monitor/device/[deviceId]
  });
  
  // Handle MQTT messages
  client.on('message', async (topic, message) => {
    try {
      console.log(`Received message on topic: ${topic}`);
      const payload = JSON.parse(message.toString());
      
      // Check if message contains device_id
      if (!payload.device_id) {
        console.warn('Received message without device_id, trying to match by user_id');
        
        // If device_id is not provided, try to find device by user_id
        if (payload.user_id) {
          const device = await Device.findOne({ userId: payload.user_id });
          if (device) {
            payload.device_id = device.deviceId;
          } else {
            console.warn('Could not match message to a device');
            return;
          }
        } else {
          console.warn('Message has neither device_id nor user_id, ignoring');
          return;
        }
      }
      
      // Create new reading in database
      const reading = new Reading({
        deviceId: payload.device_id,
        userId: payload.user_id,
        scale1: payload.scale1 || 0,
        scale2: payload.scale2 || 0,
        scale3: payload.scale3 || 0,
        scale4: payload.scale4 || 0,
        timestamp: payload.timestamp || Date.now()
      });
      
      await reading.save();
      console.log('Reading saved to database');
      
      // Check if any weight limit is exceeded
      const device = await Device.findOne({ deviceId: payload.device_id });
      if (device) {
        let limitExceeded = false;
        let exceededScale = '';
        
        // Check each scale against corresponding limit
        if (device.scale1Limit && payload.scale1 > device.scale1Limit) {
          limitExceeded = true;
          exceededScale = 'Scale 1';
        } else if (device.scale2Limit && payload.scale2 > device.scale2Limit) {
          limitExceeded = true;
          exceededScale = 'Scale 2';
        } else if (device.scale3Limit && payload.scale3 > device.scale3Limit) {
          limitExceeded = true;
          exceededScale = 'Scale 3';
        } else if (device.scale4Limit && payload.scale4 > device.scale4Limit) {
          limitExceeded = true;
          exceededScale = 'Scale 4';
        }
        
        if (limitExceeded) {
          console.log(`Weight limit exceeded on ${exceededScale} for device ${payload.device_id}`);
          
          // Send alert message back to the device
          const alertTopic = `weight-monitor/device/${payload.device_id}/alert`;
          const alertMessage = JSON.stringify({
            type: 'LIMIT_EXCEEDED',
            scale: exceededScale,
            timestamp: Date.now()
          });
          
          client.publish(alertTopic, alertMessage, { qos: 1 });
          console.log(`Alert published to ${alertTopic}`);
        }
      }
    } catch (error) {
      console.error('Error processing MQTT message:', error);
    }
  });
  
  // Handle errors
  client.on('error', (error) => {
    console.error('MQTT error:', error);
  });
};

module.exports = { connectMqtt, client };