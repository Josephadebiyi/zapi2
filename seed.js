const mongoose = require('mongoose');
const Business = require('./src/models/Business');
require('dotenv').config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB for seeding...");

        // Clear existing businesses to avoid duplicates if you want a fresh start
        // await Business.deleteMany({});

        const dummyBusiness = await Business.create({
            name: "ZAPI Luxe Salon",
            phone: "+34600111222",
            email: "luxe@zapisalon.com",
            location: "Madrid, Calle Serrano 15, Near El Retiro",
            description: "Premium hair and beauty salon in the heart of Madrid.",
            requiresPayment: true,
            aiPersonality: "casual",
            services: [
                { name: "Haircut & Styling", durationMinutes: 45, price: 35, currency: "EUR" },
                { name: "Manicure", durationMinutes: 30, price: 20, currency: "EUR" }
            ],
            availability: [
                { dayOfWeek: 1, startTime: "09:00", endTime: "20:00" },
                { dayOfWeek: 2, startTime: "09:00", endTime: "20:00" },
                { dayOfWeek: 3, startTime: "09:00", endTime: "20:00" },
                { dayOfWeek: 4, startTime: "09:00", endTime: "20:00" },
                { dayOfWeek: 5, startTime: "09:00", endTime: "21:00" }
            ]
        });

        console.log("------------------------------------------");
        console.log("Dummy Business Created Successfully!");
        console.log("Name: ", dummyBusiness.name);
        console.log("ZAPI ID (Paste this in WhatsApp): ", dummyBusiness._id);
        console.log("------------------------------------------");

        process.exit();
    } catch (error) {
        console.error("Seeding Error:", error);
        process.exit(1);
    }
};

seedData();
