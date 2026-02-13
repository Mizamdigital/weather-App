const API_KEY = "d6c005c9f07a8771f2724cd562982cb0";

const weatherResult =
document.getElementById("weatherResult");

const cityInput =
document.getElementById("cityInput");


/* =========================================
   ENTER KEY SUPPORT
   ========================================= */

cityInput.addEventListener("keypress", e=>{
    if(e.key === "Enter"){
        getWeather();
    }
});


/* =========================================
   EFFECT CONTAINER
   ========================================= */

const effectsContainer =
document.createElement("div");

effectsContainer.style.position = "fixed";
effectsContainer.style.top = "0";
effectsContainer.style.left = "0";
effectsContainer.style.width = "100%";
effectsContainer.style.height = "100%";
effectsContainer.style.pointerEvents = "none";
effectsContainer.style.zIndex = "0";

document.body.appendChild(effectsContainer);


/* =========================================
   LOADER
   ========================================= */

function showLoader(){

    if(document.getElementById("loader")) return;

    const loader =
    document.createElement("div");

    loader.id = "loader";

    loader.style.position = "fixed";
    loader.style.top = "50%";
    loader.style.left = "50%";
    loader.style.transform =
    "translate(-50%, -50%)";

    loader.style.width = "60px";
    loader.style.height = "60px";

    loader.style.border =
    "4px solid rgba(255,255,255,0.3)";

    loader.style.borderTop =
    "4px solid white";

    loader.style.borderRadius = "50%";

    loader.style.animation =
    "spin 1s linear infinite";

    loader.style.zIndex = "9999";

    document.body.appendChild(loader);

}

function hideLoader(){

    const loader =
    document.getElementById("loader");

    if(loader) loader.remove();

}


/* spinner animation */

const spinStyle =
document.createElement("style");

spinStyle.innerHTML = `
@keyframes spin{
0%{transform:translate(-50%,-50%) rotate(0deg);}
100%{transform:translate(-50%,-50%) rotate(360deg);}
}`;

document.head.appendChild(spinStyle);


/* =========================================
   NIGHT CHECK
   ========================================= */

function isNight(data){

    return (
        data.dt < data.sys.sunrise ||
        data.dt > data.sys.sunset
    );

}


/* =========================================
   BACKGROUND CONTROL
   ========================================= */

function setWeatherBackground(data){

    document.body.className = "";

    const condition =
    data.weather[0].main.toLowerCase();

    if(isNight(data)){

        document.body.classList.add("night");
        createStars();
        return;

    }

    switch(condition){

        case "clear":

            if(data.main.temp >= 32){

                document.body.classList.add("hot");

            }else{

                document.body.classList.add("clear");

            }

            clearEffects();

            break;


        case "clouds":

            document.body.classList.add("clouds");
            createClouds();
            break;


        case "rain":
        case "drizzle":

            document.body.classList.add("rain");
            createRain();
            break;


        case "thunderstorm":

            document.body.classList.add("thunderstorm");
            createRain();
            break;


        case "snow":

            document.body.classList.add("snow");
            clearEffects();
            break;


        default:

            document.body.classList.add("default");
            clearEffects();

    }

}


/* =========================================
   EFFECTS
   ========================================= */

function clearEffects(){
    effectsContainer.innerHTML = "";
}


/* RAIN */

function createRain(){

    clearEffects();

    for(let i=0;i<120;i++){

        const drop =
        document.createElement("div");

        drop.style.position="absolute";
        drop.style.width="2px";
        drop.style.height="15px";
        drop.style.background=
        "rgba(255,255,255,0.4)";

        drop.style.left=Math.random()*100+"%";

        drop.style.animation=
        `rainFall ${Math.random()+0.5}s linear infinite`;

        effectsContainer.appendChild(drop);
    }
}

document.head.insertAdjacentHTML(
"beforeend",
`<style>
@keyframes rainFall{
to{transform:translateY(110vh);}
}
</style>`
);


/* CLOUDS */

function createClouds(){

    clearEffects();

    for(let i=0;i<8;i++){

        const cloud =
        document.createElement("div");

        cloud.style.position="absolute";
        cloud.style.width="200px";
        cloud.style.height="60px";

        cloud.style.background=
        "rgba(255,255,255,0.15)";

        cloud.style.borderRadius="50px";

        cloud.style.top=Math.random()*60+"%";

        cloud.style.animation=
        `cloudMove ${Math.random()*40+30}s linear infinite`;

        effectsContainer.appendChild(cloud);
    }
}

document.head.insertAdjacentHTML(
"beforeend",
`<style>
@keyframes cloudMove{
from{transform:translateX(-200px);}
to{transform:translateX(120vw);}
}
</style>`
);


/* STARS */

function createStars(){

    clearEffects();

    for(let i=0;i<150;i++){

        const star =
        document.createElement("div");

        star.style.position="absolute";
        star.style.width="2px";
        star.style.height="2px";

        star.style.background="white";

        star.style.top=Math.random()*100+"%";
        star.style.left=Math.random()*100+"%";

        star.style.animation=
        `starTwinkle ${Math.random()*3+2}s infinite`;

        effectsContainer.appendChild(star);
    }
}

document.head.insertAdjacentHTML(
"beforeend",
`<style>
@keyframes starTwinkle{
0%,100%{opacity:0.2;}
50%{opacity:1;}
}
</style>`
);


/* =========================================
   WEATHER ICON
   ========================================= */

function getIcon(iconCode){
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}



/* =========================================
   FORMAT TIME
   ========================================= */

function formatTime(unix){

    return new Date(unix*1000)
    .toLocaleTimeString([],{
        hour:"2-digit",
        minute:"2-digit"
    });

}


/* =========================================
   HOURLY FORECAST
   ========================================= */

function renderHourly(data){

    let html =
    `<div style="margin-top:20px">
    <h4>24-Hour Forecast</h4>
    <div style="display:flex;overflow:auto;gap:12px;">`;

    data.list.slice(0,8).forEach(item=>{

        html+=`
        <div style="
        background:rgba(255,255,255,0.1);
        padding:10px;
        border-radius:10px;
        min-width:80px;
        text-align:center;">
        
        <div>
        ${formatTime(item.dt)}
        </div>

        <img src="${getIcon(item.weather[0].icon)}">

        <div>
        ${Math.round(item.main.temp)}°C
        </div>

        </div>`;
    });

    html+=`</div></div>`;

    return html;
}


/* =========================================
   7 DAY FORECAST
   ========================================= */

function renderDaily(data){

    let html =
    `<div style="margin-top:20px">
    <h4>7-Day Forecast</h4>`;

    data.daily.slice(1,8).forEach(day=>{

        html+=`
        <div style="
        display:flex;
        justify-content:space-between;
        margin:8px 0;
        background:rgba(255,255,255,0.1);
        padding:8px;
        border-radius:8px;
        ">

        <div>
        ${new Date(day.dt*1000)
        .toLocaleDateString(undefined,
        {weekday:"short"})}
        </div>

        <img src="${getIcon(day.weather[0].icon)}">

        <div>
        ${Math.round(day.temp.min)}°
        /
        ${Math.round(day.temp.max)}°
        </div>

        </div>`;
    });

    html+=`</div>`;

    return html;
}


/* =========================================
   UPDATE UI
   ========================================= */

async function updateWeatherUI(data){

    setWeatherBackground(data);

    const sunrise =
    formatTime(data.sys.sunrise);

    const sunset =
    formatTime(data.sys.sunset);

    weatherResult.innerHTML = `
    
    <h2>${data.name}</h2>

    <img src="${getIcon(data.weather[0].icon)}">

    <div class="temp">
    ${Math.round(data.main.temp)}°C
    </div>

    <div>
    ${data.weather[0].description}
    </div>

    <div>
    Humidity: ${data.main.humidity}%
    </div>

    <div>
    Sunrise: ${sunrise}
    </div>

    <div>
    Sunset: ${sunset}
    </div>

    `;

    /* get hourly + daily */

    const lat = data.coord.lat;
    const lon = data.coord.lon;

    const forecast =
    await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    const forecastData =
    await forecast.json();

    weatherResult.innerHTML +=
    renderHourly(forecastData);

}


/* =========================================
   GET WEATHER
   ========================================= */

async function getWeather(){

    const city =
    cityInput.value.trim();

    if(!city) return;

    showLoader();

    try{

        const res =
        await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        const data =
        await res.json();

        hideLoader();

        if(data.cod==="404"){

            weatherResult.innerHTML=
            "City not found";

            return;
        }

        updateWeatherUI(data);

    }
    catch(e){

        hideLoader();

    };

}


/* =========================================
   GEOLOCATION
   ========================================= */

function detectLocation(){

    navigator.geolocation.getCurrentPosition(
    async pos=>{

        showLoader();

        const lat =
        pos.coords.latitude;

        const lon =
        pos.coords.longitude;

        const res =
        await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );

        const data =
        await res.json();

        hideLoader();

        updateWeatherUI(data);

    });
}

detectLocation();