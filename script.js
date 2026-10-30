// Smart Farm IoT Monitoring System
// Simulated sensor data for prototype testing


// Get elements from the HTML page

var moisture = document.getElementById("moisture");
var temperature = document.getElementById("temperature");
var light = document.getElementById("light");
var humidity = document.getElementById("humidity");

var farmStatus = document.getElementById("farmStatus");
var alertBox = document.getElementById("alertBox");
var historyTable = document.getElementById("historyTable");

var scenario = document.getElementById("scenario");


// Create a random number

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// Create sensor readings

function getSensorData() {

    var moistureValue;
    var temperatureValue;
    var lightValue;
    var humidityValue;


    // Healthy condition

    if (scenario.value == "healthy") {

        moistureValue = randomNumber(45, 65);
        temperatureValue = randomNumber(22, 30);
        lightValue = randomNumber(50, 80);
        humidityValue = randomNumber(50, 70);
    }


    // Dry soil condition

    else if (scenario.value == "dry") {

        moistureValue = randomNumber(10, 25);
        temperatureValue = randomNumber(25, 32);
        lightValue = randomNumber(50, 80);
        humidityValue = randomNumber(35, 55);
    }


    // High temperature condition

    else if (scenario.value == "hot") {

        moistureValue = randomNumber(40, 60);
        temperatureValue = randomNumber(36, 42);
        lightValue = randomNumber(60, 90);
        humidityValue = randomNumber(30, 50);
    }


    // Low light condition

    else if (scenario.value == "lowlight") {

        moistureValue = randomNumber(40, 60);
        temperatureValue = randomNumber(22, 30);
        lightValue = randomNumber(10, 25);
        humidityValue = randomNumber(50, 70);
    }


    // Automatic condition

    else {

        moistureValue = randomNumber(15, 75);
        temperatureValue = randomNumber(20, 40);
        lightValue = randomNumber(20, 95);
        humidityValue = randomNumber(35, 80);
    }


    return {
        moisture: moistureValue,
        temperature: temperatureValue,
        light: lightValue,
        humidity: humidityValue
    };
}


// Check whether the readings are safe

function checkConditions(data) {

    var messages = [];
    var status = "healthy";


    // Check soil moisture

    if (data.moisture < 30) {

        messages.push(
            "Soil moisture is low. Irrigation may be required."
        );

        status = "danger";
    }


    // Check temperature

    if (data.temperature > 35) {

        messages.push(
            "Temperature is too high."
        );

        status = "danger";
    }


    // Check light

    if (data.light < 30) {

        messages.push(
            "Light level is low."
        );

        if (status == "healthy") {
            status = "warning";
        }
    }


    return {
        messages: messages,
        status: status
    };
}


// Update the dashboard

function updateDashboard() {

    var data = getSensorData();

    var result = checkConditions(data);


    // Display sensor values

    moisture.innerHTML = data.moisture + "%";
    temperature.innerHTML = data.temperature + "°C";
    light.innerHTML = data.light + "%";
    humidity.innerHTML = data.humidity + "%";


    // Display farm status

    farmStatus.className = "status " + result.status;


    if (result.status == "healthy") {

        farmStatus.innerHTML = "Healthy Conditions";
    }

    else if (result.status == "warning") {

        farmStatus.innerHTML = "Warning";
    }

    else {

        farmStatus.innerHTML = "Attention Required";
    }


    // Display alerts

    alertBox.innerHTML = "";


    if (result.messages.length == 0) {

        alertBox.innerHTML =
            '<p class="no-alert">No alerts at the moment.</p>';
    }

    else {

        for (var i = 0; i < result.messages.length; i++) {

            alertBox.innerHTML +=
                '<p class="alert-message">' +
                result.messages[i] +
                '</p>';
        }
    }


    // Add reading to history

    addHistory(data, result.status);
}


// Add readings to history table

function addHistory(data, status) {

    var time = new Date().toLocaleTimeString();

    var row = historyTable.insertRow(0);


    row.insertCell(0).innerHTML = time;
    row.insertCell(1).innerHTML = data.moisture + "%";
    row.insertCell(2).innerHTML = data.temperature + "°C";
    row.insertCell(3).innerHTML = data.light + "%";


    if (status == "healthy") {
        row.insertCell(4).innerHTML = "Healthy";
    }

    else if (status == "warning") {
        row.insertCell(4).innerHTML = "Warning";
    }

    else {
        row.insertCell(4).innerHTML = "Attention";
    }


    // Keep only the latest 10 readings

    while (historyTable.rows.length > 10) {
        historyTable.deleteRow(10);
    }
}


// Update when the user changes the scenario

scenario.addEventListener("change", updateDashboard);


// Start the application

updateDashboard();


// Automatically update every 5 seconds

setInterval(updateDashboard, 5000);