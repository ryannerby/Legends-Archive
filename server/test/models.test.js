const mongoose = require('mongoose')
const { Car } = require('../models/event.ts');

describe('Car Model Test', () => {
  const validCarData = {
    name: 'Test Car',
    year: 2020,
    chassisNumber: '1234567890',
    imageUrl: 'test.jpg',
  }

  it('should create and save a car successfully', async () => {
    const car = new Car(validCarData);
    const savedCar = await car.save();

    expect(savedCar._id).toBeDefined();
    expect(savedCar.name).toBe(validCarData.name);
    expect(savedCar.year).toBe(validCarData.year);
    expect(savedCar.chassisNumber).toBe(validCarData.chassisNumber);
    expect(savedCar.history).toEqual([]);
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
});