import express from 'express';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import cors from 'cors';

const app = express();
const PORT = 3000;
const __dirname = path.resolve();
const DATA_FILE = path.join(__dirname, 'data', 'data.json');

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(cors()); // Enable CORS

// Helper function to read data from the JSON file
async function readData() {
  try {
    const data = await readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Helper function to write data to the JSON file
async function writeData(data) {
  try {
    await writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing to file:', error);
  }
}

// Routes
app.get('/items', async (req, res) => {
  try {
    const items = await readData();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching items' });
  }
});

app.post('/items', async (req, res) => {
  try {
    const items = await readData();
    const newItem = { id: Date.now(), ...req.body };
    items.push(newItem);
    await writeData(items);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Error adding item' });
  }
});

app.put('/items/:id', async (req, res) => {
  try {
    const items = await readData();
    const { id } = req.params;
    const itemIndex = items.findIndex(item => item.id === parseInt(id));

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }

    items[itemIndex] = { ...items[itemIndex], ...req.body };
    await writeData(items);
    res.status(200).json(items[itemIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Error updating item' });
  }
});

app.delete('/items/:id', async (req, res) => {
  try {
    const items = await readData();
    const { id } = req.params;
    const filteredItems = items.filter(item => item.id !== parseInt(id));

    if (items.length === filteredItems.length) {
      return res.status(404).json({ error: 'Item not found' });
    }

    await writeData(filteredItems);
    res.status(200).json({ message: 'Item successfully deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting item' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
