"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const multer_1 = __importDefault(require("multer"));
const event_1 = require("./models/event");
const upload = (0, multer_1.default)({ dest: 'uploads/' });
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/cars', async (req, res) => {
    try {
        const cars = await event_1.Car.find().sort({ createdAt: -1 });
        res.json(cars);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
app.get('/cars/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const car = await event_1.Car.findById(id);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }
        res.json(car);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
app.post('/cars', upload.single('image'), async (req, res) => {
    try {
        const { name, year, chassisNumber } = req.body;
        let imageUrl = null;
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        }
        const car = await event_1.Car.create({ name, year, chassisNumber, imageUrl });
        res.status(201).json(car);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
app.use('/uploads', express_1.default.static('uploads'));
app.post('/cars/:id/history', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, date, description } = req.body;
        if (!title || !date || !description) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const car = await event_1.Car.findById(id);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }
        car.history.push({ title, date, description });
        await car.save();
        res.status(201).json(car);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
app.delete('/cars/:id/history/:eventId', async (req, res) => {
    try {
        const { id, eventId } = req.params;
        const car = await event_1.Car.findById(id);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }
        console.log('eventId:', eventId);
        console.log('car.history:', car.history.map(h => h._id?.toString()));
        const eventIndex = car.history.findIndex((h) => h._id?.toString() === eventId);
        if (eventIndex === -1) {
            return res.status(404).json({ message: 'History event not found' });
        }
        car.history.splice(eventIndex, 1);
        await car.save();
        res.status(200).json({ message: 'History event deleted', car });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
const PORT = process.env.PORT || 5001;
mongoose_1.default.connect(process.env.MONGO_URI)
    .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
    .catch(err => {
    console.error('Error connecting to MongoDB:', err);
});
//# sourceMappingURL=server.js.map