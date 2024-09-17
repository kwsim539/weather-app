import sunny from '../assets/images/sunny.png';
import cloudy from '../assets/images/cloudy.png';
import rainy from '../assets/images/rainy.png';
import snowy from '../assets/images/snowy.png';
import loadingGift from '../assets/images/loading.gif';
import {useEffect, useState} from "react";

const WeatherApp = () => {
    const [data, setData] = useState({});
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(false);
    const api_key = `${import.meta.env.VITE_API_KEY}`;

    useEffect(() =>{
        const fetchDefaultWeather = async () => {
            setLoading(true);
            const defaultLocation = 'Chicago';
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${defaultLocation}&units=metric&appid=${api_key}`;
            const res = await fetch(url);
            const defaultData = await res.json();
            setData(defaultData);
            setLoading(false);
        }
        fetchDefaultWeather();
    }, [])

    const handleInputChange = (e) => {
        setLocation(e.target.value);
    }
    const search = async () => {
        setLoading(true)
        if (location.trim() !== "") {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${api_key}`;
            const response = await fetch(url);
            const searchData = await response.json();
            console.log(searchData);
            if (searchData.cod !== 200) {
                setData({notFound: true});
            } else {
                setData(searchData);
                setLocation('');
            }
            setLoading(false);
            console.log("data: ", data)
        }
    }
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === 13) {
            search();
        }
    }
    const weatherImages = {
        Clear: sunny,
        Clouds: cloudy,
        Rain: rainy,
        Snowy: snowy,
        Hazard: cloudy,
        Mist: cloudy
    }
    const weatherImage = data.weather ? weatherImages[data.weather[0].main] : null;

    const backgroundImages = {
        Clear: 'clear',
        Clouds: 'clouds',
        Rain: 'rain',
        Snow: 'snow',
        Haze: 'haze',
        Mist: 'mist',
    }

    const backgroundImage = data.weather ? backgroundImages[data.weather[0].main] : 'default-bg';

    const currentDate = new Date();

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];

    const dayOfWeek = daysOfWeek[currentDate.getDay()];
    const month = months[currentDate.getMonth()];
    const dayOfMonth = currentDate.getDate();

    const formattedDate = `${dayOfWeek}, ${dayOfMonth} ${month}`;

    return (
        <div className={'container ' + backgroundImage}>
            <div className={'weather-app ' + backgroundImage}>
                <div className="search">
                    <div className="search__top">
                        <i className="fa-solid fa-location-dot"></i>
                        <div className="location">{data.name ?  data.name : null}</div>
                    </div>
                    <div className="search__bar">
                        <input type="text" placeholder="Enter Your City" value={location} onChange={handleInputChange} onKeyDown={handleKeyDown} />
                        <i role="button" title="Search" className="fa-solid fa-magnifying-glass" onClick={search}></i>
                    </div>
                </div>
                {loading ? (<img className='loader' src={loadingGift} /> ) : data.notFound ? (<div className="not-found">Not Found! 🤔</div>) : (
                    <>
                        <div className="weather">
                            <img src={weatherImage} alt="sunny"/>
                            <div className="weather__type">{data.weather ? `${data.weather[0].main}` : null}</div>
                            <div className="weather__temp">{data.main ? `${Math.floor(data.main.temp)}°` : null}</div>
                            <div className="weather-date">
                                <p>{formattedDate}</p>
                            </div>
                        </div>

                        <div className="weather-data">
                            <div className="weather-humidity">
                                <div className="weather-data__name">Humidity</div>
                                <i className="fa-solid fa-droplet"></i>
                                <div className="weather-data__data">{data.main ? `${data.main.humidity}%` : null}</div>
                            </div>
                            <div className="weather-wind">
                                <div className="weather-data__name">Wind</div>
                                <i className="fa-solid fa-wind"></i>
                                <div className="weather-data__data">{data.wind ? `${data.wind.speed} km/h` : null}</div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default WeatherApp;
