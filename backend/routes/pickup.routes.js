const express = require("express");

const router = express.Router();

const Pickup = require("../models/pickup")


router.post("/",async(req, res)=>{
    try{
        const newPickup = new Pickup(req.body)
        await newPickup.save();
        res.status(201).json({
            success: true,
            message: "Pickup Schedule Successfully!"

        })

    }catch(err){
        res.status(500).json({
            success: false,
            error: err.message
        })

    }

})



router.get("/", async(req, res)=>{
    try{
        const pickups = await Pickup.find().sort({
            createdAt: -1
        })
        res.json(pickups)

    }catch(err){
        res.status(500).json({
            success: false,
            error: err.message
        })

    }
})


module.exports = router