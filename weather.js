"use strict"

let timer;
let displayedLocation = ""
const options = {
    weekday: "long",
    month: "long",
    day: "numeric",
};

function inputDebounce(){

    
    clearTimeout(timer);
    
    timer = setTimeout(getCords, 300);
}

async function getCords(){
    const photonAPI = "https://photon.komoot.io/api/?q=";
    let inputBox = document.getElementById("input");
    let input = inputBox.value;
    let photonUrl = photonAPI + input;

    let addressList = document.getElementById("addressDropdown");
    addressList.innerHTML = "";
    addressList.classList.remove("populated");

    try{
        const response = await fetch(photonUrl);
        if(!response.ok){
            throw new Error(`Photon status: ${response.status}`);
        }

        const result = await response.json();
        

        for(let i=0; i<result.features.length; i++){
            let item = document.createElement("li");
            let houseNum = result.features[i].properties.housenumber || "";
            let street = result.features[i].properties.street || "";
            item.city = result.features[i].properties.city || "";
            item.state = result.features[i].properties.state || "";
            let zip = result.features[i].properties.postcode || "";
            let country = result.features[i].properties.country || "";
            let seperator = ", ";
            item.cords = result.features[i].geometry.coordinates;
    
            let address = houseNum + " " + street + seperator + item.city + seperator +
                item.state + " " + zip + seperator + country;
            
            item.textContent = address;
            item.addEventListener("click", () =>{
                inputBox.value = item.textContent;
                inputBox.cords = item.cords;

                displayedLocation = `${item.city}, ${item.state}`;
                getWeather();
            });
            addressList.appendChild(item);
            addressList.classList.add("populated");

        }

    } catch(error){
        console.log(error.message);
    }
}

async function getWeather(){
    const meteoAPI = "https://api.open-meteo.com/v1/forecast?"
    let inputBox = document.getElementById("input");
    let firstAddress = document.getElementById("addressDropdown").firstChild;
    let lat = ``;
    let long = ``;

    if(inputBox.cords === undefined && firstAddress === null){
        alert("Enter valid address");
        return;
    }
    if(inputBox.cords === undefined){
        lat = `latitude=${firstAddress.cords[1]}`;
        long = `longitude=${firstAddress.cords[0]}`;
        displayedLocation = `${firstAddress.city}, ${firstAddress.state}`;
    }else{
        lat = `latitude=${inputBox.cords[1]}`;
        long = `longitude=${inputBox.cords[0]}`;
    }


    

    const urlParams = `&temperature_unit=fahrenheit&daily=temperature_2m_min,temperature_2m_max,weather_code`;
    let meteoUrl = `${meteoAPI}${lat}&${long}&${urlParams}`;

    let addressList = document.getElementById("addressDropdown");
    addressList.innerHTML = "";
    addressList.classList.remove("populated");

    let weatherList = document.getElementById("weatherForecast");
    weatherList.innerHTML = "";

    let displayLocation = document.getElementById("displayedLocation");
    displayLocation.textContent = `Forecast for ${displayedLocation}`;
    
    try{
        const response = await fetch(meteoUrl);
        if(!response.ok){
            throw new Error(`Meteo status: ${response.status}`);
        }
        const result = await response.json();

        let dailyTemps = result.daily;

        for(let i = 0; i<dailyTemps.time.length; i++){
            let item = document.createElement("li");
            let cardDate = document.createElement("h4");
            let cardImg = document.createElement("p");
            cardImg.classList.add("cardImg");
            let cardWeather = document.createElement("p");
            cardWeather.classList.add("cardWeather");
            let cardTemp = document.createElement("p");
            cardTemp.classList.add("cardTemp");

            let minTemp = dailyTemps.temperature_2m_min[i];
            let maxTemp = dailyTemps.temperature_2m_max[i];
            let [weather, weatherImg] = weatherCode(+dailyTemps.weather_code[i]);

            let date = new Date(dailyTemps.time[i]+"T00:00:00");
            date = date.toLocaleDateString("en", options);

            cardDate.textContent = date;
            item.appendChild(cardDate);

            cardImg.textContent = weatherImg;
            item.appendChild(cardImg);

            cardWeather.textContent = weather;
            item.appendChild(cardWeather);

            cardTemp.textContent = `${minTemp}°F - ${maxTemp}°F`;
            item.appendChild(cardTemp);


            weatherList.appendChild(item);
        }

    }catch(error){
        console.log(error.message);
    }
}

function weatherCode(code){
    switch(code){
        case 0:
            return ["clear sky", "☀️"];
        case 1:
        case 2:
        case 3:
            return ["partly cloudy", "🌤️"];
        case 45:
        case 48:
            return ["foggy", "🌫️"];
        case 51:
        case 53:
        case 55:
            return ["drizzles", "🌦️"];
        case 56:
        case 57:
            return ["freezing drizzle", "🌦️"];
        case 61:
        case 63:
        case 65:
            return ["rain", "🌧️"];
        case 66:
        case 67:
            return ["hail", "🌧️"];
        case 71:
        case 73:
        case 75:
        case 77:
            return ["snow", "🌨️"];
        case 80:
        case 81:
        case 82:
            return ["rain showers", "🌦️"];
        case 85:
        case 86:
            return ["snow showers", "🌨️"];
        case 95:
        case 96:
        case 99:
            return ["thunderstorm", "⛈️"];
        default:
            return ["unknown weather", "🤷"]
    }
}

document.addEventListener("DOMContentLoaded", () => {

    let item = document.getElementById("input");
    let addressDropdown = document.getElementById("addressDropdown");
    item.addEventListener("keydown", (event) => {
        if(event.key == "Enter"){
            let addresses = addressDropdown.childNodes;
            for(let i = 0; i<addresses.length; i++){
                if(addresses[i].classList.contains("selected")){
                    item.value = addresses[i].textContent;
                    item.cords = addresses[i].cords;
                    displayedLocation = `${addresses[i].city}, ${addresses[i].state}`;
                }
            }
            getWeather();
        }else if(event.key == "ArrowDown"){
            if(addressDropdown.hasChildNodes()){
                let addresses = addressDropdown.childNodes;
                let selected = false;

                loop: for(let i=0; i<addresses.length; i++){
                    if(addresses[i].classList.contains("selected")){
                        if(i == addresses.length-1){
                            selected = true;
                            break loop;
                        }else{
                        addresses[i].classList.remove("selected");
                        addresses[i+1].classList.add("selected")
                        selected = true;

                        break loop;
                        }
                    }
                }

                if(selected == false){
                    addresses[0].classList.add("selected");
                }
            }
        }else if(event.key == "ArrowUp"){
            if(addressDropdown.hasChildNodes()){
                let addresses = addressDropdown.childNodes;
                let selected = false;
                loop: for(let i=0; i<addresses.length; i++){
                    if(addresses[i].classList.contains("selected")){
                        if(i != 0){
                            addresses[i].classList.remove("selected");
                            addresses[i-1].classList.add("selected");
                            selected = true;
                            break loop;
                        }
                        

                        
                    }
                }

                if(selected == false){
                    addresses[0].classList.add("selected");
                }
            }
        }
    })

});