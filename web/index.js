import color from "color"
import L from "leaflet"
import "leaflet.heat"
import {parse} from "csv-parse/browser/esm/sync"

import "./style.css"
import "../node_modules/leaflet/dist/leaflet.css"


(async () => {
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: await import("leaflet/dist/images/marker-icon-2x.png").then(i => i.default),
        iconUrl: await import("leaflet/dist/images/marker-icon.png").then(i => i.default),
        shadowUrl: await import("leaflet/dist/images/marker-shadow.png").then(i => i.default),
    })

    const map = L.map("map").setView([51.505, -0.09], 13)
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a>"
    }).addTo(map)

    const latestYearFor = {}
    const countryToTuberc = {}

    for (const rec of parse(await fetch("/TB_burden_countries_2023-09-14.csv").then(r => r.text()), { columns: true })) {
        if (Number(rec.year) > (latestYearFor[rec.country] ?? 0)) {
            countryToTuberc[rec.iso2] = countryToTuberc[rec.iso3] = Number(rec["e_inc_100k"])
            latestYearFor[rec.country] = Number(rec.year)
        }
    }
    
    console.log(latestYearFor)
    console.log(countryToTuberc)
    console.log(Math.max(...Object.values(countryToTuberc)))

    const countries = L.geoJson(await fetch("World_Countries_Generalized.geojson").then(r => r.json()), {
        style: function (feat) {
            console.log(feat.properties["ISO"], Math.min(countryToTuberc[feat.properties["ISO"]] ?? 0, 700) / 700)
            return ({
                color: color.hsl((1 - Math.min(countryToTuberc[feat.properties["ISO"]] ?? 0, 700) / 700) * 128, 100, 50).hex()
            })
        }
    }).addTo(map)

    const heat = L.heatLayer(await fetch("points.json").then(r => r.json()), { radius: 50, max: 4, minOpacity: 0.2 }).addTo(map)
})()