const mongoose = require('mongoose')
const { Car } = require('../models/event.ts');

describe('Car Model Test', () => {
  const validCarData = {
    name: 'Test Car',
    year: 2020,
    chassisNumber: '1234567890',
    imageUrl: 'test.jpg',
  }

  beforeEach(async () => {
    await Car.deleteMany({});
  });

  it('should create and save a car successfully', async () => {
    const car = new Car(validCarData);
    const savedCar = await car.save();

    expect(savedCar._id).toBeDefined();
    expect(savedCar.name).toBe(validCarData.name);
    expect(savedCar.year).toBe(validCarData.year);
    expect(savedCar.chassisNumber).toBe(validCarData.chassisNumber);
    expect(savedCar.history).toEqual([]);
    expect(savedCar.createdAt).toBeDefined();
    expect(savedCar.updatedAt).toBeDefined();
  });

  it('should not create a car with missing required fields', async () => {
    const carWithoutRequiredFields = new Car({ name: 'Test Car' });
    let err;
    try {
      await carWithoutRequiredFields.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.message).toContain('Car validation failed');
    expect(err.errors.year).toBeDefined();
    expect(err.errors.chassisNumber).toBeDefined();
  });

  it('should not create a car with duplicate chassis number', async () => {
    // Create first car
    await Car.create(validCarData);
    
    // Try to create second car with same chassis number
    const duplicateCar = new Car({
      name: 'Another Car',
      year: 2021,
      chassisNumber: '1234567890', // Same chassis number
    });

    let err;
    try {
      await duplicateCar.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.message).toContain('Car validation failed');
    expect(err.code).toBe(11000); // MongoDB duplicate key error
  });

  it('should handle car with history events', async () => {
    const carWithHistory = new Car({
      ...validCarData,
      history: [
        {
          title: 'Engine Rebuild',
          date: new Date('2023-01-15'),
          description: 'Complete engine overhaul',
        },
        {
          title: 'Oil Change',
          date: new Date('2023-06-20'),
          description: 'Regular maintenance',
        },
      ],
    });

    const savedCar = await carWithHistory.save();

    expect(savedCar.history).toHaveLength(2);
    expect(savedCar.history[0].title).toBe('Engine Rebuild');
    expect(savedCar.history[1].title).toBe('Oil Change');
    expect(savedCar.history[0]._id).toBeDefined();
    expect(savedCar.history[1]._id).toBeDefined();
  });

  it('should validate year field as number', async () => {
    const carWithInvalidYear = new Car({
      name: 'Test Car',
      year: 'not a number',
      chassisNumber: '1234567890',
    });

    let err;
    try {
      await carWithInvalidYear.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.message).toContain('Car validation failed');
    expect(err.errors.year).toBeDefined();
  });

  it('should trim string fields', async () => {
    const carWithWhitespace = new Car({
      name: '  Test Car  ',
      year: 2020,
      chassisNumber: '  1234567890  ',
    });

    const savedCar = await carWithWhitespace.save();

    expect(savedCar.name).toBe('Test Car');
    expect(savedCar.chassisNumber).toBe('1234567890');
  });

  it('should handle car without image', async () => {
    const carWithoutImage = new Car({
      name: 'Test Car',
      year: 2020,
      chassisNumber: '1234567890',
    });

    const savedCar = await carWithoutImage.save();

    expect(savedCar.imageUrl).toBeNull();
  });

  it('should sort cars by creation date', async () => {
    const car1 = await Car.create({
      name: 'First Car',
      year: 2020,
      chassisNumber: 'CHASSIS001',
    });

    // Wait a bit to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10));

    const car2 = await Car.create({
      name: 'Second Car',
      year: 2021,
      chassisNumber: 'CHASSIS002',
    });

    const cars = await Car.find().sort({ createdAt: -1 });

    expect(cars[0]._id.toString()).toBe(car2._id.toString());
    expect(cars[1]._id.toString()).toBe(car1._id.toString());
  });
});