const Progress=require("../models/Progress");
const Workout = require("../models/Workout");
const createProgress=async(req,res)=>{
    try{
        const progress=await Progress.create({
            userId:req.user.id,
            workoutId:req.body.workoutId,
            completed:req.body.completed || false,
            caloriesBurned:req.body.caloriesBurned || 0,
            workoutDuration:req.body.workoutDuration || 0
        });
        res.status(201).json(progress);
    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};
const getMyProgress=async(req,res)=>{
    try{
        const progress=await Progress.find({
            userId:req.user.id
        }).populate("workoutId");
        res.json(progress);

    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};
module.exports={
    createProgress,
    getMyProgress
};