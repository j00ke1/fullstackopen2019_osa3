const express = require('express');
const app = express();

let persons = [
  {
    id: 1,
    name: 'Teemu Pukki',
    number: '4634858621'
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
];

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>');
});

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
