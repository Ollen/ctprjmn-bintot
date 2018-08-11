

#include <SimpleTimer.h>
#include <ArduinoJson.h>
#include <NewPing.h>
#include <DHT.h>
#include <math.h>

#include "SoftwareSerial.h"
#include "HX711.h"

// Timer Object
SimpleTimer sensorTimer;
SimpleTimer rfidTimer;

// PINS
#define TRIG_PIN  2
#define ECHO_PIN  3
#define DHT_PIN   4
#define TILT_S1   5
#define TILT_S2   6
#define RST_PIN   9
#define SDA_PIN   10
#define CLK_PIN   11
#define DOUT_PIN   12

// CONST VAR 
#define TRASH_ID      1
#define TRASH_HEIGHT  30 //Centimeters
#define DIST_MAX      35
#define DHT_TYPE      DHT11

// Initialize Sensors
NewPing sonar(TRIG_PIN, ECHO_PIN);
DHT dht(DHT_PIN, DHT_TYPE);
HX711 scale(DOUT_PIN, CLK_PIN);

// XBee Serial
SoftwareSerial XBee(8,7);

// Array that will store NUID of RFID
byte nuidPICC[4];

// Function Protoypes
void sendJSONData();
double getSonarDistance();
int getTiltPos();
bool readCard();
void printHex();

void setup() {
  Serial.begin(9600);
  XBee.begin(9600);
  pinMode(TILT_S1, INPUT);
  pinMode(TILT_S2, INPUT);
  dht.begin();
  
  float calibration_factor = 95000;
  scale.set_scale(calibration_factor);  //Calibration Factor obtained from first sketch
  scale.tare(); //Reset scale to 0

  Serial.println("Starting sensor timer");
  sensorTimer.setInterval(2000, sendJSONSensorData);
  
}

void loop() {
  sensorTimer.run();
  //rfidTimer.run();
}

/**
 * Sends JSON Sensor Data via XBee serial
 */
void sendJSONSensorData() {
  
  float sonarDistance = getSonarDistance();
  float t = dht.readTemperature();
  float h = dht.readHumidity();
  double w = getWeight();
  int tiltPos = getTiltPos();
  
  // Convert to JSON
  StaticJsonBuffer<200> jsonBuffer;
  JsonObject& root = jsonBuffer.createObject();
  root["dataType"] = "sensor";
  root["trashID"] = TRASH_ID;
  root["trashHeight"] = TRASH_HEIGHT;
  root["trashWeight"] = w;
  
  // Calculate Waste Percentage
  if (sonarDistance > 30) {
    sonarDistance = 30;
  }
  root["sonarDistance"] = sonarDistance;
  root["wastePercent"] = (1 - (sonarDistance / TRASH_HEIGHT)) * 100;
  
  root["temperature"] = t;
  root["humidity"] = h;
  root["tiltPos"] = tiltPos;
  root.printTo(Serial);
  Serial.println();
  
  
  root.printTo(XBee);
  XBee.println();
}


/**
 * Fetch the Sonar Distance
 */
double getSonarDistance() {
  long sonarTimeDelay = sonar.ping_median(5);
  double sonarDistance = (sonarTimeDelay / 2) / 29.154;
  return sonarDistance;
}

/**
 * Fetch Tile Posisitoin
 */
int getTiltPos(){
  int S1 = digitalRead(TILT_S1);
  int S2 = digitalRead(TILT_S2);
  return (S1 << 1) | S2; //BITWISE MATH
}


//Return the weight carried by the load cell in kg
double getWeight(){
  return fabs(scale.get_units());
}

