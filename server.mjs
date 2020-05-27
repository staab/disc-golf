import fs from "fs"
import express from "express"
import sirv from "sirv"
import compression from "compression"

Error.stackTraceLimit = 100

const {NODE_ENV, PORT} = process.env

const courses = {
  'duthie-park': {
    city: 'Troy, ID',
    name: 'Duthie Park',
    view: {lon: 46.7396579, lat: -116.7687484, zoom: 16},
    start: {lon: 46.739667, lat: -116.768900},
    holes: [
      {name: 'Hole #1', lon: 46.740005, lat: -116.768771, par: 3},
      {name: 'Hole #2', lon: 46.740444, lat: -116.769297, par: 3},
      {name: 'Hole #3', lon: 46.739791, lat: -116.769158, par: 3},
      {name: 'Hole #4', lon: 46.739784, lat: -116.769466, par: 3},
      {name: 'Hole #5', lon: 46.739364, lat: -116.769664, par: 3},
      {name: 'Hole #6', lon: 46.738950, lat: -116.769490, par: 3},
      {name: 'Hole #7', lon: 46.738939, lat: -116.769194, par: 3},
      {name: 'Hole #8', lon: 46.738858, lat: -116.768961, par: 3},
      {name: 'Hole #9', lon: 46.739397, lat: -116.768877, par: 3},
    ],
  },
}

try {
  express()
    .use((req, res, next) => {
      // The 'x-forwarded-proto' check is for Heroku
      if (
        NODE_ENV === "production" &&
        !req.secure &&
        req.get("x-forwarded-proto") !== "https"
      ) {
        return res.redirect("https://" + req.get("host") + req.url)
      }

      next()
    })
    .use(
      compression({threshold: 0}),
      sirv("public", {dev: NODE_ENV === "development"}),
      (req, res, next) => {
        const [subdomain] = req.hostname === 'localhost' || req.hostname === '192.168.0.4' ? ['duthie-park'] : req.subdomains
        const course = courses[subdomain]
        const url = course ? `https://${subdomain}.anhyzer.io` : 'https://anhyzer.io'
        const title = course ? `${course.name} Disc Golf Course` : 'Disc Golf Courses'

        fs.readFile("public/_index.html", (err, contents) => {
          if (err) {
            console.error(err)
          }

          res.writeHead(200, {
            "Content-Type": "text/html",
          })

          res.end(
            contents.toString("utf-8")
              .replace(/{{URL}}/g, url)
              .replace(/{{TITLE}}/g, title)
              .replace(/{{COURSE}}/g, JSON.stringify(course))
          )
        })
      }
    )
    .listen(PORT, async err => {
      if (err) throw err
      console.log(`Listening at ${process.env.PORT}`)
    })
} catch (err) {
  console.error(err)
}

