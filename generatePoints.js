import { parse } from "csv-parse"
import { readFile, writeFile } from "fs/promises"
import path from "path"

(async () => {
    const csvData = parse(await readFile("AllPeoplesByCountry.csv"), { "columns": true, "bom": true })

    const parsed = new Array()

    for await (const {
        "Ctry": countryName, "Population": population, "PercentAdherents": percentAdherent,
        "PeopNameAcrossCountries": intlName, "Latitude": lat, "Longitude": long, JPScale } of csvData) {


        parsed.push([Number(lat), Number(long), Math.max(
            Math.ceil(
                Math.log(
                    Math.round((100 - Number(percentAdherent)) / 100 * population))
                    - 4), 0.5)])
    }

    await writeFile(`web${path.sep}points.json`, JSON.stringify(parsed))
})()
