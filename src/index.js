const path = require('path')
const express = require('express')
const hbs = require('hbs')
const { query } = require('express')
const app = express()
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

// Define paths for exprss congig
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup Handlebars engine and views locationS
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Welcome to Weather App',
        name: 'Salik Paudel'
    })
})

//Return weather using geoocode and forecast
app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        })
    }
    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }
            res.send({
                location,
                forecast: forecastData,
                address: req.query.address
            })
        })
    })
})


app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }

    console.log(req.query)
    res.send({
        products: []
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Page',
        name: 'Salik Paudel'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        message: 'Welcome to Help Page',
        title: 'Help',
        name: 'Salik Paudel'
    })
})

app.get('/help/*', (req, res) => {
    res.render('404page', {
        title: '404',
        errorMessage: 'Help article not found',
        name: 'Salik Paudel'
    })
})

app.get('*', (req, res) => {
    res.render('404page', {
        title: 404,
        errorMessage: '404 Page not found',
        name: 'Salikram Paudel'
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})