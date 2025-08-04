const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Car } = require('../models/event.ts');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/cars', async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/cars/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const car = await Car.findById(id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.json(car);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/cars', async (req, res) => {
  try {
    const car = await Car.create(req.body);
    res.status(201).json(car);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.post('/cars/:id/history', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, description } = req.body;
    if (!title || !date || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const car = await Car.findById(id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    car.history.push({ title, date, description });
    await car.save();
    res.status(201).json(car);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/cars/:id/history/:eventId', async (req, res) => {
  try {
    const { id, eventId } = req.params;
    const car = await Car.findById(id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const eventIndex = car.history.findIndex(event => event._id.toString() === eventId);
    if (eventIndex === -1) {
      return res.status(404).json({ message: 'History event not found' });
    }
    car.history.splice(eventIndex, 1);
    await car.save();
    res.status(200).json({ message: 'History event deleted successfully', car });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

describe('Car API Integration Test', () => {
  let testCar;
  let testCarId;

  beforeEach(async () => {
    await Car.deleteMany({});
    
    // Create a test car for each test
    testCar = await Car.create({
      name: 'Test Car',
      year: 2020,
      chassisNumber: 'TEST123',
    });
    testCarId = testCar._id.toString();
  });

  describe('GET /cars', () => {
    it('should return all cars', async () => {
      await Car.create(testCar);

      const res = await request(app)
        .get('/cars')
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe(testCar.name);
    });
  });

  describe('GET /cars/:id', () => {
    it('should return a car by id', async () => {
      const res = await request(app)
        .get(`/cars/${testCarId}`)
        .expect(200);

      expect(res.body.name).toBe(testCar.name);
      expect(res.body.year).toBe(testCar.year);
      expect(res.body.chassisNumber).toBe(testCar.chassisNumber);
    });
    it('should return 404 if car not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/cars/${fakeId}`)
        .expect(404);

      expect(res.body.message).toBe('Car not found');
    });
  });

  describe('POST /cars', () => {
    it('should create a new car', async () => {
      const newCar = {
        name: 'New Test Car',
        year: 2021,
        chassisNumber: 'NEW123', // Different chassis number to avoid conflict
      };

      const res = await request(app)
        .post('/cars')
        .send(newCar)
        .expect(201);

      expect(res.body.name).toBe(newCar.name);
      expect(res.body.year).toBe(newCar.year);
      expect(res.body.chassisNumber).toBe(newCar.chassisNumber);
    });

    it('should fail to create car without required fields', async () => {
      const res = await request(app)
        .post('/cars')
        .send({ name: 'Incomplete Car' })
        .expect(400);

      expect(res.body.message).toBeDefined();
    });
  });

  describe('POST /cars/:id/history', () => {
    it('should create a new history event', async () => {
      const historyEvent = {
        title: 'Test Event',
        date: '2020-01-01',
        description: 'Test Description',
      };

      const res = await request(app)
        .post(`/cars/${testCarId}/history`)
        .send(historyEvent)
        .expect(201);

      expect(res.body.history).toHaveLength(1);
      expect(res.body.history[0].title).toBe(historyEvent.title);
      expect(new Date(res.body.history[0].date).toISOString().split('T')[0]).toBe(historyEvent.date); // Fix date comparison
      expect(res.body.history[0].description).toBe(historyEvent.description);
    });

    it('should fail to create history event without required fields', async () => {
      const incompleteEvent = {
        title: 'Incomplete Event',
      };

      const res = await request(app)
        .post(`/cars/${testCarId}/history`)
        .send(incompleteEvent)
        .expect(400);

      expect(res.body.message).toBeDefined();
    });

    it('should fail to create history event with invalid car id', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const historyEvent = {
        title: 'Test Event',
        date: '2020-01-01',
        description: 'Test Description',
      };

      const res = await request(app)
        .post(`/cars/${fakeId}/history`)
        .send(historyEvent)
        .expect(404);

      expect(res.body.message).toBe('Car not found');
    });
  });

  describe('DELETE /cars/:id/history/:eventId', () => {
    let historyEventId;
    beforeEach(async () => {
      testCar.history.push({
        title: 'Test Event',
        date: new Date('2020-01-01'),
        description: 'Test Description',
      });
      await testCar.save();
      historyEventId = testCar.history[0]._id.toString();
    });

    it('should delete a history event', async () => {
      const res = await request(app)
        .delete(`/cars/${testCarId}/history/${historyEventId}`)
        .expect(200);

      expect(res.body.car.history).toHaveLength(0); // Fix: access car.history, not history directly
    });

    it('should fail to delete non-existent history event', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .delete(`/cars/${testCarId}/history/${fakeId}`)
        .expect(404);

      expect(res.body.message).toBe('History event not found');
    });

    it('should fail to delete history event with invalid car id', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .delete(`/cars/${fakeId}/history/${historyEventId}`)
        .expect(404);
      
      expect(res.body.message).toBe('Car not found'); // Fix: should be "Car not found"
    });
  });
});
