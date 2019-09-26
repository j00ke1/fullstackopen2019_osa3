require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const Person = require('./models/person');

app.use(express.static('build'));
app.use(cors());
app.use(bodyParser.json());
morgan.token('data', (req, res) => {
  return JSON.stringify(req.body);
});
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :data')
);

//Routes
app.get('/', (req, res) => {
  res.send('<h1>Welcome to Phonebook</h1>');
});

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons);
  });
});

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person.toJSON());
      } else {
        res.status(404).end();
      }
    })
    .catch(err => next(err));
});

app.delete('/api/persons/:id', (req, res) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end();
    })
    .catch(err => next(err));
});

app.post('/api/persons/', (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'Name or number missing'
    });
  }

  /* if (persons.find(p => p.name === body.name)) {
    return res.status(400).json({
      error: 'Name must be unique'
    });
  } */

  const newPerson = new Person({
    name: body.name,
    number: body.number
  });

  newPerson.save().then(savedPerson => {
    res.status(201).json(savedPerson.toJSON());
  });
});

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body;

  const person = {
    name: body.name,
    number: body.number
  };

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson.toJSON());
    })
    .catch(err => next(err));
});

app.get('/info', (req, res) => {
  const date = new Date();
  Person.countDocuments({}, (err, count) => {
    res.send(`
      <p>Phonebook has info for ${count} people.</p>
      <p>${date}</p>
    `);
  });
});

//Error handling middleware
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'Unknown endpoint' });
};

app.use(unknownEndpoint);

const errorHandler = (err, req, res, next) => {
  console.error(err.message);

  if (err.name === 'CastError' && err.kind == 'ObjectId') {
    return res.status(400).send({ error: 'Malformatted id' });
  }

  next(err);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
