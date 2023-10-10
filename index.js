const express = require('express')
const app = express()
const port = 3000

//import body parser
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//import route posts
const activitiesRouter = require('./route/activities');
const todosRouter = require('./route/todos');
app.use('/activity-groups', activitiesRouter); // use route posts di Express
app.use('/todo-items', todosRouter); // use route posts di Express

app.listen(port, () => {
  console.log(`app running at http://localhost:${port}`)
})