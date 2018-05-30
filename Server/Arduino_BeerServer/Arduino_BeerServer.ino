/*
   Senda Birra arduino temperature manager
*/

#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <WiFiClient.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <ArduinoJson.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <Adafruit_FeatherOLED.h>
#define BUTTON_C 2

Adafruit_FeatherOLED oled = Adafruit_FeatherOLED();

const char* kSSID     = "Vengaboys";
const char* kNetworkPassword = "Sandyypapo";

boolean C_buttonPressed = false;

const uint8_t kButtonPin = 2;
const int kArduinoTemperatureDigitalPin = 0;
const int kMaxSensorsAvailable = 3;
const int kJSONBufferSize = JSON_OBJECT_SIZE(kMaxSensorsAvailable);

const int kDefaultNetworkTimeout = 20;
IPAddress assignedIP;

ESP8266WebServer server(80);
IPAddress static_ip(192, 168, 2, 254);
IPAddress gateway(192, 168, 2, 1);
IPAddress subnet(255, 255, 255, 0);

struct SensorData {
  DeviceAddress address;
  float temperatureValue;
  unsigned long lastTempRequest;
};

OneWire  oneWire(kArduinoTemperatureDigitalPin);
DallasTemperature sensors(&oneWire);

SensorData sensorDataInfo[kMaxSensorsAvailable];

uint8_t numberOfSensorsFound = 0;
uint8_t screenToShow = 0;
unsigned long lastReadTime = 0;
unsigned long conversionTime = 0;

void setup() {
  Serial.begin(115200);
  initializeDisplay();
  initializeTemperatureLibrary();

  if (isNetworkNameNotEmpty(kSSID)) {
    // We start by connecting to a WiFi network
    displayNetworkName(kSSID);
    if (tryConnectingToNetwork(kSSID, kNetworkPassword, kDefaultNetworkTimeout)) {
      // Start the server
      displaySuccesfulConnetionMessage();
      delay(2000);
      server.on("/", handleRoot);
      server.on("/sensors", handleIndividualSensor);
      server.on("/sensors/raw", handleAllSensors);
      server.onNotFound ( handleNotFound );
      server.begin();
      assignedIP = WiFi.localIP();
      displayLocalIp(assignedIP);
      delay (2000);
    } else {
      displayWLConnectionTimeoutScreen(kSSID, 2000);
    }
  } else {
    displayWLNetworkNamInvalidMessage();
    delay(2000);
  }

  initializeInterrupts();

}
void handleRoot(){
  String apiHelpText = "Welcome to the SendaBirra API\n";
  apiHelpText += "API :\n";
  apiHelpText += "/sensors/raw -> returns array of sensors\n";
  apiHelpText += "/sensors?id=sensor # -> returns the specifics of a single sensor according to its id argument";
  server.send ( 200, "text/plain", apiHelpText);
}

void handleNotFound() {
  String message = "File Not Found\n\n";
	message += "URI: ";
	message += server.uri();
	message += "\nMethod: ";
	message += ( server.method() == HTTP_GET ) ? "GET" : "POST";
	message += "\nArguments: ";
	message += server.args();
	message += "\n";

	for ( uint8_t i = 0; i < server.args(); i++ ) {
		message += " " + server.argName ( i ) + ": " + server.arg ( i ) + "\n";
	}

	server.send ( 404, "text/plain", message );
  displayInvalidRequest();
}
void handleIndividualSensor()
{
  if (server.argName(0) == "id")
  {
    displayNewClientMessage();
    int value = server.arg(0).toInt();
    if (value <= kMaxSensorsAvailable)
    {
      StaticJsonBuffer<kJSONBufferSize> jsonBuffer;
      JsonObject &root = jsonBuffer.createObject();
      root["id"] = value;
      root["temperature"] = sensorDataInfo[value - 1].temperatureValue;
      root["elapsedMs"] = sensorDataInfo[value - 1].lastTempRequest;
      String jsonPart;
      root.printTo(jsonPart);
      server.send(200, "application/json", jsonPart);
    }
    else
    {
      server.send(200, "text/plain", "Invalid argument for sensor: " + server.args());
    }
  }

  else
  {
    server.send(200, "text/plain", "Invalid argument for sensor: " + server.args());
  }
}
void handleAllSensors()
{
  displayNewClientMessage();
  StaticJsonBuffer<kJSONBufferSize> jsonBuffer;
  JsonObject &root = jsonBuffer.createObject();
  root["sensor1"] = sensorDataInfo[0].temperatureValue;
  root["sensor2"] = sensorDataInfo[1].temperatureValue;
  root["sensor3"] = sensorDataInfo[2].temperatureValue;
  String jsonPart;
  root.printTo(jsonPart);
  server.send(200, "application/json", jsonPart);
}
void loop() {
  // Check if a client has connected
  server.handleClient();
  updateTemperatureValues();
  
  if (C_buttonPressed)
  {
    displayLocalIp(assignedIP);
  }
  else
  {
    displayTemperatureValues();
  }
}

void initializeTemperatureLibrary() {
  
  sensors.begin();
  int resolution = 12;
  conversionTime = 750 / (1 << (12 - resolution));
  sensors.setResolution(resolution);
  sensors.requestTemperatures();
  lastReadTime = millis();
  numberOfSensorsFound = sensors.getDeviceCount();
  updateTemperatureValues();

  const int first_line = 0;
  const int second_line = 1;

  displayNumberOfSensors(first_line);
}
void updateTemperatureValues()
{
  if (millis() - lastReadTime > conversionTime)
  {
    sensors.requestTemperatures();

    for (int i = 0; i < numberOfSensorsFound; i++)
    {
      sensorDataInfo[i].temperatureValue = sensors.getTempCByIndex(i);
      sensors.getAddress(sensorDataInfo[i].address, i);
      sensorDataInfo[i].lastTempRequest = millis();
    }
    lastReadTime = millis();
  }
}

void handleButtonPress() {
  C_buttonPressed = !digitalRead(2);
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

void initializeDisplay() {
  oled.init();
  oled.clearDisplay();
  oled.setCursor(0, 0);
  oled.println(".. Starting Server ..");
  oled.display();
}

void displayNumberOfSensors(const int vertical_index)
{
  oled.clearDisplay();
  oled.setCursor(0, vertical_index);
  oled.print("Found ");
  oled.print(numberOfSensorsFound);
  oled.println(" sensors:");
  oled.display();
}

void displayTemperatureValues()
{
  oled.clearDisplay();
  oled.setCursor(0, 0);
  oled.println("Idle. Temperatures:");
  for (int i = 0; i < numberOfSensorsFound; i++)
  {
    oled.print("S");
    oled.print(i + 1);
    oled.print(" ");
    oled.print(sensorDataInfo[i].temperatureValue, 2);
    oled.println(" C");
  }
  oled.display();
}

void displayNetworkName(String networkName)
{
  oled.clearDisplay();
  oled.setCursor(0, 0);
  oled.println("Connecting to: ");
  oled.println(networkName);
  oled.println("");
  oled.display();
}
void displayInvalidRequest() {
  oled.clearDisplay();
  oled.setCursor(0,0);
  oled.println("File Not Found at ");
  oled.println(server.uri());
  oled.println("Arguments " + server.args());
}

void displayLocalIp(IPAddress ip) {
  oled.clearDisplay();
  oled.setCursor(0, 0);
  oled.println("Server started on:");
  oled.println("");
  // Print the IP address
  oled.println(ip.toString());
  oled.display();
}

void displayConnectingScreen() {
  static int counter = 0;
  counter++;
  oled.print("*");
  if (counter % 22 == 0) {
    oled.clearDisplay();
    oled.setCursor(0, 0);
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

void displayNewClientMessage() {
  oled.clearDisplay();
  oled.setCursor(0, 0);
  oled.println("new request received");
  oled.display();
}

void displayWLConnectionTimeoutScreen(String kSSID, int timeout) {
  oled.clearDisplay();
  oled.setCursor(0, 0);
  oled.println("Could not connect to:");
  oled.println(kSSID);
  oled.display();
  delay(timeout);

}

void displayWLNetworkNamInvalidMessage() {
  oled.clearDisplay();
  oled.setCursor(0, 0);
  oled.println("Network Name is empty");
  oled.println("Only displaying data.");
  oled.display();
}

void initializeInterrupts() {
  pinMode(kButtonPin, INPUT);
  attachInterrupt(digitalPinToInterrupt(kButtonPin), handleButtonPress, CHANGE);
}
bool tryConnectingToNetwork (String networkName, String password, int timeOutValue) {
  // WiFi.config(static_ip, gateway, subnet);
  WiFi.mode (WIFI_STA);
  WiFi.begin(kSSID, kNetworkPassword);
  int current_timeout = timeOutValue;
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    displayConnectingScreen();

    if (current_timeout <= 0) {
      return false;
      break;
    }
    current_timeout--;
  }

  return true;
}
bool isNetworkNameNotEmpty(String text) {
  return text != "";
}
