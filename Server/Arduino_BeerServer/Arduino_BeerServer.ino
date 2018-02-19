 /*
 *  Senda Birra arduino temperature manager
 */

#include <ESP8266WiFi.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <ArduinoJson.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <Adafruit_FeatherOLED.h>

Adafruit_FeatherOLED oled = Adafruit_FeatherOLED();

const char* kSSID     = "Vengaboys";
const char* kNetworkPassword = "Sandyypapo";


const int kArduinoTemperatureDigitalPin = 0;
const int kMaxSensorsAvailable = 3;
const int kJSONBufferSize = JSON_OBJECT_SIZE(kMaxSensorsAvailable);

WiFiServer server(80);
IPAddress static_ip(192,168,2,254);
IPAddress gateway(192,168,2,1);
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
  startDisplay();
  initializeTemperatureLibrary();
  // We start by connecting to a WiFi network
  displayNetworkName(kSSID);
  
  WiFi.config(static_ip, gateway, subnet);
  WiFi.begin(kSSID, kNetworkPassword);
  while (WiFi.status() != WL_CONNECTED) {
    delay(100);
    displayConnectingScreen();
  }
    
 // Start the server
  displaySuccesfulConnetionMessage();
  delay(2000);
  server.begin();
 // server.on("/favicon.ico", handleFavicon);
  
  displayLocalIp(WiFi.localIP());
  delay (5000);
}

void loop() {  
  // Check if a client has connected
  WiFiClient client = server.available();
  if (!client) {
    updateTemperatureValues();
    oled.clearDisplay();
    oled.setCursor(0,0);
    oled.println("Idle. last temps are:");
    oled.display();
    displayTemperatureValues(false, 1);
    return;
  }
  
  // Wait until the client sends some data
  oled.clearDisplay();
  oled.setCursor(0,0);
  oled.println("new request received");
  oled.display();
  while(!client.available()){
    delay(10);
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
    //root.printTo(Serial);
  }
  else if (req.indexOf("/sensor/2") != -1) {
    root["id"] = 2;
    root["temperature"] = sensorDataInfo[1].temperatureValue;
    root["elapsedMs"] = sensorDataInfo[1].lastTempRequest;
    //root.printTo(Serial);
  }
  else if (req.indexOf("/sensor/3") != -1) {
   root["id"] = 3;
   root["temperature"] = sensorDataInfo[2].temperatureValue;
   root["elapsedMs"] = sensorDataInfo[2].lastTempRequest;
   //root.printTo(Serial);
  }
  else if (req.indexOf("sensors/raw") != -1) {
    root["sensor1"] = sensorDataInfo[0].temperatureValue;
    root["sensor2"] = sensorDataInfo[1].temperatureValue;
    root["sensor3"] = sensorDataInfo[2].temperatureValue;
    //root.printTo(Serial);
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
  delay(10);
  client.stop();
  
  oled.println("Client disonnected");
  oled.display();
  // The client will actually be disconnected 
  // when the function returns and 'client' object is detroyed
}

void initializeTemperatureLibrary() {
  sensors.begin(); 
  sensors.setResolution(12);
  sensors.requestTemperatures();
  
  numberOfSensorsFound = sensors.getDeviceCount();
  updateTemperatureValues();
  
  const int first_line = 0;
  const int second_line = 1;

  displayNumberOfSensors(first_line); 
  displayTemperatureValues(false, second_line);
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
void startDisplay() {
  oled.init();
  oled.clearDisplay();
  oled.setCursor(0, 0);
  oled.println(".. Starting Server ..");
  oled.display();
  int prev_x = 0;
  int prev_y = 8;
  for (int i = 8; i < 8 ; i = i+8) {
    int new_x = prev_x + i;
    int new_y = prev_y + i/2;
    if (new_y > 32) new_y = 8;
   
    oled.drawLine(prev_x, prev_y, new_x, new_y, WHITE);
    prev_x = new_x;
    prev_y = new_y;
    oled.display();
    delay(500);
  }
 

}
void displayNumberOfSensors(const int vertical_index) 
{
  oled.clearDisplay();
  oled.setCursor(0,vertical_index);
  oled.print("Found ");
  oled.print(numberOfSensorsFound);
  oled.println(" sensors:");
  oled.display();
}

void displayTemperatureValues(const bool should_clear, const int vertical_index) 
{
  if (should_clear) 
  {
    oled.clearDisplay();
  }
  
  oled.setCursor(0, vertical_index * 8);
  
  for (int i = 0; i < numberOfSensorsFound; i++) 
  {
    oled.print("S");
    oled.print(i+1);
    oled.print(" ");
    oled.print(sensorDataInfo[i].temperatureValue, 2);
    oled.println(" C");
  }
  oled.display();
}

void displayNetworkName(String networkName) 
{
  oled.clearDisplay();
  oled.setCursor(0,0);
  oled.println("Connecting to: ");
  oled.println(networkName);
  oled.println("");
  oled.display();
}

void handleFavicon() {
  //server.send(404, "text/html; charset=iso-8859-1","<html><head> <title>404 Not Found</title></head><body><h1>Not Found</h1></body></html>");
}

void displayLocalIp(IPAddress ip) {
  oled.clearDisplay();
  oled.setCursor(0, 0);
  oled.println("Server started on:");
  oled.println("");
  // Print the IP address
  oled.println(ip);
  oled.display();
}
void displayConnectingScreen() {
  static int counter = 0;
  counter++;
    oled.print("*");
    if (counter % 22 == 0) {
      oled.clearDisplay();
      oled.setCursor(0,0);
      oled.println("Connecting to: ");
      oled.println(kSSID);
      oled.println("");
    }
    oled.display();
}
void displaySuccesfulConnetionMessage() {
  oled.clearDisplay();
  oled.setCursor(0, 0);
  oled.println("WiFi connected!");
  oled.display();
 }
