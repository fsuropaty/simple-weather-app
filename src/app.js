const temperatureEl = document.getElementById("temperature")
const cityEl = document.getElementById("city")
const settingsEl = document.getElementById("settings")
const pilihProvinsiEl = document.getElementById("pilih-provinsi")
const pilihKotaEl = document.getElementById("pilih-kota")
const weatherEl = document.getElementById("weather")
const dialog = document.getElementById("dialog")
const terapkan = document.getElementById("terapkan")

pilihProvinsiEl.addEventListener("change", (e) => {
	getCity(pilihProvinsiEl.value)
})

terapkan.addEventListener("click", (e) => {
	const province = pilihProvinsiEl.value
	const city = pilihKotaEl.value
	localStorage.setItem("province", province)
	localStorage.setItem("city", city)

	e.preventDefault()
	dialog.close()

	fetchingData(province, city)
})

settingsEl.addEventListener("click", () => {
	dialog.showModal()
})

function init() {
	dateFunc()
	getProvince()
	checkLocalStorage()
}

function checkLocalStorage() {
	const provinceCache = localStorage.getItem("province")
	const cityCache = localStorage.getItem("city")

	fetchingData(provinceCache, cityCache)
}

async function getProvince() {
	let provinceValue
	let provinceName

	const res = await fetch(
		"https://cuaca-gempa-rest-api.vercel.app/weather/indonesia"
	)
	const data = await res.json()
	const provinces = data.data.areas

	for (let index = 0; index < provinces.length; index++) {
		provinceName = provinces[index].domain
		provinceValue = provinceName.replace(" ", "-").toLowerCase()

		const opsiProvinsi = document.createElement("option")

		opsiProvinsi.text = provinceName
		opsiProvinsi.value = provinceValue

		pilihProvinsiEl.add(opsiProvinsi)
	}
}

async function getCity(province) {
	let cityName
	let cityValue

	const res = await fetch(
		`https://cuaca-gempa-rest-api.vercel.app/weather/${province}`
	)
	const data = await res.json()
	const cities = data.data.areas

	if (pilihKotaEl.options.length > 0) {
		for (let i = pilihKotaEl.options.length - 1; i >= 0; i--) {
			pilihKotaEl.options[i].remove()
		}
	}

	for (let index = 0; index < cities.length; index++) {
		cityName = cities[index].description
		cityValue = cityName

		const opsiKota = document.createElement("option")

		opsiKota.text = cityName
		opsiKota.value = cityValue

		pilihKotaEl.add(opsiKota)
	}
}

async function fetchingData(province, city) {
	await fetch(
		`https://cuaca-gempa-rest-api.vercel.app/weather/${province}/${city}`
	)
		.then((response) => response.json())
		.then((data) => {
			const temperature = data.data.params[5].times[11].celcius.replace(
				" ",
				" °"
			)
			const weather = data.data.params[6].times[11].name
			const city = data.data.description

			cityEl.innerHTML = city
			temperatureEl.innerHTML = temperature
			weatherEl.innerHTML = weather
		})
		.catch((error) => {
			console.error("Error fetching JSON data:", error)
		})
}

function clockFunc() {
	let currentTime = new Date()

	// Extract hours, minutes and seconds
	let hours = currentTime.getHours()
	let minutes = currentTime.getMinutes()
	let seconds = currentTime.getSeconds()

	// Format hours, minutes and seconds
	if (hours < 10) {
		hours = "0" + hours
	}
	if (minutes < 10) {
		minutes = "0" + minutes
	}
	if (seconds < 10) {
		seconds = "0" + seconds
	}

	// Generate the clock output
	let clockOutput = `${hours}:${minutes}:${seconds}`

	// Update the clock on the page
	document.getElementById("clock").innerHTML = clockOutput
}

function dateFunc() {
	let currentDate = new Date()

	let date = currentDate.getDate()
	let month = currentDate.getMonth() + 1
	let year = currentDate.getFullYear()

	switch (month) {
		case 1:
			month = "Januari"
			break
		case 2:
			month = "Februari"
			break
		case 3:
			month = "March"
			break
		case 4:
			month = "April"
			break
		case 5:
			month = "Mei"
			break
		case 6:
			month = "Juni"
			break
		case 7:
			month = "Juli"
			break
		case 8:
			month = "Agustus"
			break
		case 9:
			month = "September"
			break
		case 10:
			month = "Oktober"
			break
		case 11:
			month = "November"
			break
		case 12:
			month = "Desember"
			break

		default:
			break
	}

	let dateOutput = `${date} ${month} ${year}`
	document.getElementById("date").innerHTML = dateOutput
}

setInterval(clockFunc, 1000)

init()
