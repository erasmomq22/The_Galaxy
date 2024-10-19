const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 3000;

let currentCharacterId = 1;
const apiUrl = 'https://swapi.dev/api/people/';

app.get('/api/character', async (req, res) => {
  try {
    const response = await fetch(`${apiUrl}${currentCharacterId}/`);
    const character = await response.json();
    res.json(character);
  } catch (error) {
    res.status(500).send('Error fetching character data');
  }
});

app.get('/api/character/next', async (req, res) => {
  currentCharacterId = (currentCharacterId % 82) + 1; // Hay 82 personajes en SWAPI
  res.redirect('/api/character');
});

app.get('/api/character/previous', async (req, res) => {
  currentCharacterId = (currentCharacterId === 1) ? 82 : currentCharacterId - 1;
  res.redirect('/api/character');
});

app.get('/api/character/search/:name', async (req, res) => {
  try {
    const response = await fetch(`${apiUrl}?search=${req.params.name}`);
    const data = await response.json();
    if (data.results.length > 0) {
      res.json(data.results[0]);
    } else {
      res.status(404).send('Character not found');
    }
  } catch (error) {
    res.status(500).send('Error fetching character data');
  }
});

app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
