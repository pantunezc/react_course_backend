require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
const Person = require("./models/person");

let persons = [];
app.use(cors());
app.use(express.json());
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body "));
app.use(express.static("dist"));
morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

/* const generateId = () => {
  return Math.floor(Math.random() * 1000);
}; */

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  /* const existingPerson = Person.find((person) => person.name === body.name);

  if (existingPerson) {
    return response.status(400).json({
      error: "name must be unique",
    });
  } */

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      console.error(error);
      response.status(500).end();
    });
});

app.get("/info", (req, res) => {
  Person.countDocuments()
    .then((numPersons) => {
      const timestamp = new Date().toLocaleString();
      res.send(`<p>Phonebook has info for ${numPersons} people </p>
                <p> ${timestamp} </p>`);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).end();
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
