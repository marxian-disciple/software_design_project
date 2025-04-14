const express = require('express');
const router = express.Router();

// POST /signup/google
router.post('/signup/google', (req, res) => {
    try {
        const { uid, email, name, photoURL } = req.body;

        console.log("Received Google Sign-Up:", { uid, email, name, photoURL });

        // TODO: Save to DB here later

        res.status(200).json({ message: "User received successfully", uid });
    } catch (error) {
        console.error("Error processing Google sign-up:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


module.exports = router;


