const { calculateDistance } = require('../services/distance');
const { calculatePrice } = require('../services/pricing');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }
    try {
        const { pickupAddress, destinationAddress, city, vehicleType = 'Economy' } = req.body;

        // Validate required fields
        if (!pickupAddress || !destinationAddress || !city) {
            res.status(400).json({
                error: 'Missing required fields: pickupAddress, destinationAddress, city'
            });
            return;
        }

        // Calculate distance using mock logic
        const distance = await calculateDistance(pickupAddress, destinationAddress);

        // Check if distance is too far
        if (distance > 1000) {
            res.status(422).json({
                error: 'Too far to offer ride'
            });
            return;
        }

        // Calculate price
        let price;
        try {
            price = calculatePrice(city, vehicleType, distance, pickupAddress, destinationAddress);
        } catch (err) {
            res.status(400).json({ error: err.message });
            return;
        }

        // Logic to determine if email is required
        const isEmailRequired = (
            distance > 30 || 
            price < 50 || 
            !['London', 'Paris'].includes(city) 
        );

        res.json(isEmailRequired);
    } catch (error) {
        res.status(500).json({
            error: error.message || 'Internal server error'
        });
    }
}; 