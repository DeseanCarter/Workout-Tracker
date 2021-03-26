const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
let path = require('path');

const PORT = process.env.PORT || 3000;

const db = require("./models");

const app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", { useNewUrlParser: true, useUnifiedTopology: true,
useCreateIndex: true,
useFindAndModify: false});

// let routesApi = require("./routes/api.js");
// let routesHTML = require("./routes/html.js");

// routesApi(app)
// routesHTML(app)

app.get("/api/workouts", (req, res) => {
    db.Workout.find({})
      .then(dbWorkout => {
        // console.log(dbWorkout)
        res.json(dbWorkout);
      })
      .catch(err => {
        res.json(err);
      });
  });

  app.get("/api/stats", (req, res) => {
    res.sendFile(path.join(__dirname + `/public/stats.html`));
  });

  app.get("/exercise", (req, res) => {
    res.sendFile(path.join(__dirname + `/public/exercise.html`));
  });

  app.put("/api/workouts/:id", (req, res) => {
   db.Workout.updateOne({_id: req.params.id}, {
        $push: { exercises: {
            type: req.body.type,
            name: req.body.name,
            distance: req.body.distance,
            duration: req.body.duration,
            weight: req.body.weight,
            reps: req.body.reps,
            sets: req.body.sets,
        }}
   })
   .then(dbWorkout => {
       res.json(dbWorkout);
   })
  .catch(err => {
      res.json(err)
  })
  });  

  app.post("/api/workouts", ({data}, res) => {
    db.Workout.create(data)
    .then(dbWorkout => {
        res.json(dbWorkout);
      })
      .catch(err => {
        res.json(err);
      })
    })

  // Start the server
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
});