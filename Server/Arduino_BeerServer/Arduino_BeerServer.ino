 /*
 *  Senda Birra arduino temperature manager
 */

#include <ESP8266WiFi.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <ArduinoJson.h>

#define ANDRES_AND_ARI

#ifdef HAROLD_AND_JOSE_ANGEL
const char* kSSID     = "";
const char* kNetworkPassword = "";
#endif

#ifdef ANDRES_AND_ARI
const char* kSSID     = "";
const char* kNetworkPassword = "";
#endif
const int kArduinoTemperatureDigitalPin = 0;
const int kMaxSensorsAvailable = 3;
const int kJSONBufferSize = JSON_OBJECT_SIZE(kMaxSensorsAvailable);

WiFiServer server(80);
IPAddress static_ip(192,168,1,254);
IPAddress gateway(192,168,1,1);
IPAddress subnet(255,255,255,0);

struct SensorData {
  DeviceAddress address;
  float temperatureValue;
  unsigned long lastTempRequest;
};

OneWire  oneWire(kArduinoTemperatureDigitalPin);
DallasTemperature sensors(&oneWire);

SensorData sensorDataInfo[kMaxSensorsAvailable];
uint8_t numberOfSensorsFound = 0;

void setup() {
  Serial.begin(115200);
  delay(100);
  initializeTemperatureLibrary();
  // We start by connecting to a WiFi network
 
  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(kSSID);
  
  //WiFi.config(static_ip, gateway, subnet);
  WiFi.begin(kSSID, kNetworkPassword);
  unsigned long counter = 0;
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    counter++;
    Serial.print("*");
    if (counter % 10 == 0) {
      Serial.println();
    }
  }

  Serial.println("");
  Serial.println("WiFi connected");  
 // Start the server
  server.begin();
  Serial.print("Server started on :");

  // Print the IP address
  Serial.println(WiFi.localIP());
}

void loop() {  
  // Check if a client has connected
  WiFiClient client = server.available();
  if (!client) {
    updateTemperatureValues();
    return;
  }
  
  // Wait until the client sends some data
  Serial.println("new client");
  while(!client.available()){
    delay(1);
  }
  
  // Read the first line of the request
  String req = client.readStringUntil('\r');
  Serial.println(req);
  client.flush();
  
  // Match the request
  String stringVal;
  StaticJsonBuffer<kJSONBufferSize> jsonBuffer;
  JsonObject& root = jsonBuffer.createObject();
  
  if (req.indexOf("/sensor/1") != -1) {
    root["id"] = 1;
    root["temperature"] = sensorDataInfo[0].temperatureValue;
    root["elapsedMs"] = sensorDataInfo[0].lastTempRequest;
    root.printTo(Serial);
  }
  else if (req.indexOf("/sensor/2") != -1) {
    root["id"] = 2;
    root["temperature"] = sensorDataInfo[1].temperatureValue;
    root["elapsedMs"] = sensorDataInfo[1].lastTempRequest;
    root.printTo(Serial);
  }
  else if (req.indexOf("/sensor/3") != -1) {
   root["id"] = 3;
   root["temperature"] = sensorDataInfo[2].temperatureValue;
   root["elapsedMs"] = sensorDataInfo[2].lastTempRequest;
   root.printTo(Serial);
  }
  else if (req.indexOf("sensors/raw") != -1) {
    root["sensor1"] = sensorDataInfo[0].temperatureValue;
    root["sensor2"] = sensorDataInfo[1].temperatureValue;
    root["sensor3"] = sensorDataInfo[2].temperatureValue;
    root.printTo(Serial);
  }
  else {
    Serial.println("invalid request. stopping client " + req);
    client.stop();
    return;
  }
  
  client.flush();
  size_t length = root.measureLength();
  char jsonPart[length + 1];
  root.printTo(jsonPart, length + 1);
  client.println("HTTP/1.1 200 OK");
  client.println("Content-Type: application/json;charset=utf-8");
  client.println("Server: BeerServer Arduino");
  client.println("Connection: close");
  client.println();
  client.println(jsonPart);
  client.println();
  delay(1);
  client.stop();
  Serial.println("Client disonnected");
  
  // The client will actually be disconnected 
  // when the function returns and 'client' object is detroyed
}

void initializeTemperatureLibrary() {
  sensors.begin(); 
  sensors.setResolution(12);
  sensors.requestTemperatures();
  
  numberOfSensorsFound = sensors.getDeviceCount();
  Serial.print("Found ");
  Serial.print(numberOfSensorsFound, DEC);
  Serial.println(" sensors");
 
  updateTemperatureValues();
 
  for (int i = 0; i < numberOfSensorsFound; i++) {
    Serial.print("Info: ");
    Serial.print("Address = ");
    printAddress(sensorDataInfo[i].address);
    Serial.print(" Temp = ");
    Serial.print(sensorDataInfo[i].temperatureValue, DEC);
    Serial.print(" at = " + sensorDataInfo[i].lastTempRequest);
    Serial.println("");
  }
}
void updateTemperatureValues() {
  sensors.requestTemperatures();
 
 for (int i = 0; i < numberOfSensorsFound; i++) {
      sensorDataInfo[i].temperatureValue = sensors.getTempCByIndex(i);
      sensors.getAddress(sensorDataInfo[i].address, i);
      sensorDataInfo[i].lastTempRequest = millis();
    }
}

// function to print a device address
void printAddress(DeviceAddress deviceAddress)
{
  for (uint8_t i = 0; i < 8; i++)
  {
    if (deviceAddress[i] < 16) Serial.print("0");
    Serial.print(deviceAddress[i], HEX);
  }
}
