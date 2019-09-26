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

/* let persons = [
  {
    id: 1,
    name: 'Teemu Pukki',
    number: '4634858456'
  },
  {
    id: 2,
    name: 'Sergio Aguero',
    number: '78315965'
  },
  {
    id: 3,
    name: 'Harry Kane',
    number: '1384321999'
  }
]; */

app.get('/', (req, res) => {
  res.send('<h1>Welcome to Phonebook</h1>');
});

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons);
  });
});

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id).then(person => {
    res.json(person.toJSON());
  });
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(p => p.id !== id);
  res.status(204).end();
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

app.get('/info', (req, res) => {
  const date = new Date();
  res.send(`
    <p>Phonebook has info for ${persons.length} people.</p>
    <p>${date}</p>
  `);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
