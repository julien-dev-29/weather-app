/**
 * @class APIRequest
 */
class APIRequest {
    constructor() {
        this.init()
        this.currentGroup = "metric"
        this.location = ""
        this.url = ""
    }

    /**
     * 
     */
    init() {
        // DOM
        this.form = document.querySelector('form')
        this.cardTemplate = document.querySelector("#card")
        this.toggleTempInput = document.querySelector('#toggleTemp')

        // Event
        this.form.addEventListener('submit', (e) => {
            e.preventDefault()
            const data = new FormData(e.target)
            this.location = data.get('location')
            this.populate()
        })
        this.toggleTempInput.addEventListener('change', this.toggleTemp.bind(this))
    }

    /**
    * 
    * @param {PointerEvent} e 
    */
    async populate() {
        console.log(this);
        const response = await fetch(this.queryBuild())
        document.querySelector('#alert').replaceChildren()
        const alert = document.createElement('div')
        try {
            if (response.ok) {
                const data = await response.json()
                console.log(data);
                // Populate HTML
                const clone = this.cardTemplate.content.cloneNode(true)
                clone.querySelector("#address").textContent = data.resolvedAddress
                const conditions = data.currentConditions.conditions
                clone.querySelector("#conditions").textContent = conditions
                clone.querySelector("#conditions-icon").textContent = this.getWeatherIcon(conditions)
                const temp = data.currentConditions.temp
                const tempElmt = clone.querySelector('#temp')
                const windSpeed = data.currentConditions.windspeed
                const windSpeedELmt = clone.querySelector("#windSpeed")
                this.currentGroup === "metric" ?
                    tempElmt.textContent = temp + "°C"
                    :
                    tempElmt.textContent = temp + "°F"
                this.currentGroup === "metric" ?
                    windSpeedELmt.textContent = windSpeed + "km/h"
                    :
                    windSpeedELmt.textContent = windSpeed + " m.p.h"
                console.log(data.currentConditions.winddir);
                clone.querySelector("#windDir").innerHTML = this.getWindDirectionIcon(data.currentConditions.winddir)
                document.querySelector('#display').replaceChildren()
                document.querySelector('#display').append(clone)
            } else {
                console.log(response);
                throw new Error(response.status)
            }
        } catch (err) {
            alert.className = "alert"
            alert.textContent = err
            document.querySelector('#alert').append(alert)
        }
    }

    /**
     * 
     * @param {Number} degrees 
     * @returns 
     */
    getWindDirectionIcon(degrees) {
        if (degrees >= 348.75 || degrees < 11.25) return "⬆️";
        if (degrees < 33.75) return "↗️";
        if (degrees < 56.25) return "↗️";
        if (degrees < 78.75) return "↗️";
        if (degrees < 101.25) return "➡️";
        if (degrees < 123.75) return "↘️";
        if (degrees < 146.25) return "↘️";
        if (degrees < 168.75) return "↘️";
        if (degrees < 191.25) return "⬇️";
        if (degrees < 213.75) return "↙️";
        if (degrees < 236.25) return "↙️";
        if (degrees < 258.75) return "↙️";
        if (degrees < 281.25) return "⬅️";
        if (degrees < 303.75) return "↖️";
        if (degrees < 326.25) return "↖️";
        return "↖️";
    }

    getWeatherIcon(condition) {
        const iconMap = {
            "Clear": "☀️",
            "Partially cloudy": "🌤️",
            "Cloudy": "🌥️",
            "Overcast": "☁️",
            "Mist": "🌫️",
            "Patchy rain possible": "🌦️",
            "Rain": "🌧️",
            "Heavy rain": "🌧️",
            "Snow": "❄️",
            "Thunderstorm": "⛈️",
            "Fog": "🌫️"
        };

        return iconMap[condition] || "❓"; // valeur par défaut
    }

    async toggleTemp() {
        console.log(this.currentGroup);
        this.currentGroup = this.currentGroup === "metric" ? "us" : "metric"
        this.populate(this.location)

    }
    queryBuild() {
        this.url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${this.location}?unitGroup=${this.currentGroup}&key=VP6656SFEG67RN7QUBDHH2K23&contentType=json`
        return this.url
    }
}

export default APIRequest