'use strict'
const $ = document.querySelector.bind(document)
const backgroundImage=document.querySelector(".bg-Img")
const container= document.querySelector(".container");
const infoText = document.querySelector(".info-text");
const inputField= document.querySelector("input");
const weatherInfo=document.querySelector(".weather-section");
const backButton=container.querySelector(".back");

setInterval(//runs the function at at interval of 1 second
function getcurrentTime(){//function to obtain time ,day, date info and put into HTMl
let currentTimeDate = new Date();
var weekday = new Array(7);
    weekday[1] = "Mon";
    weekday[2] = "Tue";
    weekday[3] = "Wed";
    weekday[4] = "Thu";
    weekday[5] = "Fri";
    weekday[6] = "Sat";
    weekday[7] = "Sun";
var month = new Array();
    month[1] = "Jan";
    month[2] = "Feb";
    month[3] = "Mar";
    month[4] = "Apr";
    month[5] = "May";
    month[6] = "Jun";
    month[7] = "Jul";
    month[8] = "Aug";
    month[9] = "Sep";
    month[10] = "Oct";
    month[11] = "Nov";
    month[12] = "Dec";
    
var currentDay = weekday[currentTimeDate.getDay()];
var currentDate  = currentTimeDate.getDate();
var currentMonth = month[currentTimeDate.getMonth()];
var CurrentYear = currentTimeDate.getFullYear();
var fullDate = ` ${currentDay} ${currentDate} ${currentMonth}, ${CurrentYear}`;
$(".time").innerHTML =`[${fullDate} ] `  + currentTimeDate.toLocaleTimeString();
});

let api_url;

window.addEventListener("load",()=>{//upon loading , function will run to provide current temperature of base city (Caldwell)
    api_url=(`https://api.openweathermap.org/data/2.5/weather?q=Caldwell&units=metric&appid=0461ab343c61a04b435c6ed2fc6d01b9`);
    fetch(api_url).
    then(res => res.json())
   .then(wData=> (weatherDet(wData)));
    function weatherDet(wData){
        if (wData.cod==200){
        let temp = wData.main.temp*(9/5) + 32;
        $(".temperature").innerHTML = Math.floor(temp);
           }}
})

if (inputField){//if inputfield is available, upon entering a string and hittinng Enter , requestApi() runs
    inputField.addEventListener("keydown", k =>{
        if(k.key == "Enter" && inputField.value != ""){
            requestApi(inputField.value)  
        }
    });
};

function requestApi(){//used to fetch api info using the inputfield value
    api_url=(`https://api.openweathermap.org/data/2.5/weather?q=${inputField.value}&units=metric&appid=0461ab343c61a04b435c6ed2fc6d01b9`);
    fetchInfo();
} 

function getLocation(){//upon clicking the button,user is prompted to share their geoloaction or otherwise 
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition,showError);   
        function showPosition(position){//successful geolocation
            const {latitude,longitude}=position.coords; 
            console.log(position);
            api_url=(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=0461ab343c61a04b435c6ed2fc6d01b9`)
            fetchInfo();  
            }  
        function showError(error){//obvious
            console.log('ERR:', error);
            infoText.innerHTML=error.message;
            infoText.classList.add("error");
            }   
        }
}

function fetchInfo(){//function to gain API info
    infoText.classList.add("pending");
    $(".pending").innerHTML="Obtaining info...";
    fetch(api_url).
    then(res => res.json())
    .then(wInfo=> (weatherDetails(wInfo)))//Api info converted to JSON is given the object ,wInfo
}


function weatherDetails(wInfo){//putting thenobtained info into the HTML 
    console.log(wInfo)
    if (wInfo.cod==200){
        container.classList.add("active");
        let city = wInfo.name;
        let country = wInfo.sys.country;
        let temp = wInfo.main.temp*(9/5) + 32;
        let description= wInfo.weather[0].description;
        let feels_like = wInfo.main.feels_like*(9/5) + 32;;
        let humidity = wInfo.main.humidity;
        $(".number").innerHTML = Math.floor(temp);
        $(".weather").innerHTML = description;
        $(".location").innerHTML = `${city}, ${country}`;
        $(".feels").innerHTML = Math.floor(feels_like);
        $(".humidity").innerHTML = `${humidity}%`;

        let id = wInfo.weather[0].id;
        function changeImage(url){//style backgrounds 
            backgroundImage.style.background="url('"+url+"')";
            backgroundImage.style.backgroundRepeat="no-repeat";
            backgroundImage.style.backgroundSize="cover";
            backgroundImage.style.backgroundColor="#9dc2db"
        }
        //each set of ids is accompanied by a different background image 
        if (id>=200&&id<=232){//thunderstorm 
            changeImage('https://th.bing.com/th/id/R.25a81d3a9fd98b4bc763917ce6a6979a?rik=s5jis36eYsQpIw&pid=ImgRaw&r=0');
        }else if (id>=300&&id<=321){//drizzle 
            changeImage('https://th.bing.com/th/id/R.6c9680a5a515d2b459e44911babdb3cd?rik=%2bbMmOXw%2f%2fZl8tQ&pid=ImgRaw&r=0');
        }else if (id>=500&&id<=531){//rain
            changeImage('https://th.bing.com/th/id/R.258e88c6cb21ea8099f08ec2ce2cf999?rik=%2fCfwqAwXw7rkzg&riu=http%3a%2f%2fgetwallpapers.com%2fwallpaper%2ffull%2fb%2fa%2f1%2f944162-raining-wallpaper-1920x1080-for-mac.jpg&ehk=5qd%2fAlfsY325l%2fRwlBZ7ro5%2fkM%2f92%2bnZL%2fIBcSzduXY%3d&risl=&pid=ImgRaw&r=0')
        }else if (id>=600&&id<=622){//snow
            changeImage('https://th.bing.com/th/id/R.48e6824e5ff37b0ba8ad52e2b40ae3ab?rik=oQqQ30mlhDP61g&pid=ImgRaw&r=0');
        }else if (id>=700&&id<=781){//atmosphere.ie.mist, smoke, haze, winds, etc
            changeImage('https://th.bing.com/th/id/OIP.y_499sPqaKtg9NLAS_T_MwHaE8?pid=ImgDet&rs=1');
        }if (id==800){//clear sky
            changeImage('https://th.bing.com/th/id/R.c5e078e3c50284dd2b23396a4749bed7?rik=rwcTZRM3npqLww&pid=ImgRaw&r=0');
        }if (id>=801&&id<=804){//clouds
            changeImage('https://i.pinimg.com/originals/fc/fd/b7/fcfdb71f4bb464b00fc7e5fd3b51be6a.jpg');
        }
    }
    else if (wInfo.cod==404){//code for an invalid input
        infoText.classList.add("error");
        infoText.innerHTML = `${inputField.value} isn't a valid city name`;
    }
}
backButton.addEventListener("click",()=>{
        container.classList.remove("active" );
        infoText.classList.remove("error");
        infoText.innerHTML="";
    })
    
        





   
    





