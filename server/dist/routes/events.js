"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const event_1 = require("../models/event");
const router = express_1.default.Router();
router.get('/cars', async (req, res) => {
    try {
        const cars = await event_1.Car.find().sort({ createdAt: -1 }); // Updated to match main server
        res.json(cars);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});
router.post('/cars', async (req, res) => {
    const { name, year, chassisNumber } = req.body;
    if (!name || !year || !chassisNumber) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    try {
        const newCar = await event_1.Car.create({ name, year, chassisNumber });
        res.status(201).json(newCar);
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to create car' });
    }
});
exports.default = router;
//# sourceMappingURL=events.js.map