import express, { Request, Response } from 'express';
import { Car } from '../models/event';

const router = express.Router();

router.get('/cars', async (req: Request, res: Response) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 }); // Updated to match main server
    res.json(cars);
  } catch (err: any) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/cars', async (req: Request, res: Response) => {
  const { name, year, chassisNumber } = req.body;

  if (!name || !year || !chassisNumber) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newCar = await Car.create({ name, year, chassisNumber });
    res.status(201).json(newCar);
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to create car' });
  }
});

export default router;