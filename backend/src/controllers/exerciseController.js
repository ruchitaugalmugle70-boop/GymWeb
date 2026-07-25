const Exercise=require("../models/Exercise");
//creating exercise
const createExercise=async(req,res)=>{
    try{
        const exercise=await Exercise.create(req.body);
        res.status(201).json({
            success:true,
            data:exercise,
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }
};
//geting exercises
const getAllExercises=async(req,res)=>{
    try{
        const exercise=await Exercise.find();
        res.status(200).json({
            success:true,
            count:exercise.length,
            data:exercise,
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message,
        });
    }

};
//get single exercise
const getExerciseById=async(req,res)=>{
    try{
        const exercise=await Exercise.findById(req.params.id);

        if(!exercise){
            return res.status(404).json({
                success:false,
                message:"Exercise not found",
            });
        }
        res.status(200).json({
            success:true,
            data:exercise,

        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};
//Update Exercise
const updateExercise=async(req,res)=>{
    try{
        const exercise= await Exercise.findByIdAndUpdate(req.params.id,
            req.body,
            {
                new:true,
                runValidators:true,
            }
        );
        if(!exercise){
            return res.status(404).json({
                success:false,
                message:"Exercise not found",
            });
        }
        res.status(200).json({
            success:true,
            data:exercise,
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};
//Delete Exercise
const deleteExercise=async(req,res)=>{
    try{
        const exercise=await Exercise.findByIdAndDelete(req.params.id);
        if(!exercise){
            return res.status(404).json({
                success:false,
                message:"Exercise not found",
            });
        }
        res.status(200).json({
            success:true,
            message:"Exercise deleted successfully",
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};
module.exports={
    createExercise,
    getAllExercises,
    getExerciseById,
    updateExercise,
    deleteExercise,
};