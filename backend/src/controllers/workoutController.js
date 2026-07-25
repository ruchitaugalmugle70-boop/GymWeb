const Workout = require("../models/Workout");

//create workout
const createWorkout=async(req,res)=>{
    try{
        const workout=await Workout.create({
            ...req.body,
            createdBy:req.user.id,
        });
        res.status(201).json({
            success:true,
            data:workout,
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};
//get all workouts
const getAllWorkouts=async(req,res)=>{
    try{
        const workouts=await Workout.find()
        .populate("createdBy","name email")
        .populate("exercises.exercise");

        res.status(200).json({
            success:true,
            count:workouts.length,
            data:workouts,
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};
//get single workout
const getWorkoutById=async(req,res)=>{
    try{
        const workout=await Workout.findById(req.params.id)
        .populate("createdBy","name email")
        .populate("exercises.exercise");
        
        if(!workout){
            return res.status(404).json({
                success:false,
                message:"Workout not found",
            });
        }
        res.status(200).json({
            success:true,
            data:workout,
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};
//update workout
const updateWorkout=async(req,res)=>{
    try{
        const workout=await Workout.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
               new:true,
               runValidators:true, 
            }
        )
        .populate("createdBy","name email")
        .populate("exercises.exercise");

        if(!workout){
            return res.status(404).json({
                success:false,
                message:"workout not found",
            });
        }
        res.status(200).json({
            success:true,
            message:"workout updated successfully",
            data:workout,
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};
//Delete Workout
const deleteWorkout=async(req,res)=>{
    try{
        const workout=await Workout.findByIdAndDelete(req.params.id);

        if(!workout){
            return res.status(404).json({
                success:false,
                message:"workout not found",
            });
        }
        res.status(200).json({
            success:true,
            message:"Workout deleted successfully",
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message,
        });
    }
 };
 module.exports = {
    createWorkout,
    getAllWorkouts,
    getWorkoutById,
    updateWorkout,
    deleteWorkout,
};

