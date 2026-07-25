const express=require("express");
const router=express.Router();

const protect=require("../middleware/authMiddleware");
const{
    createWorkout,
    getAllWorkouts,
    getWorkoutById,
    updateWorkout,
    deleteWorkout
} = require("../controllers/workoutController");

router.post("/",protect,createWorkout);
router.get("/",getAllWorkouts);
router.get("/:id",getWorkoutById);
router.put("/:id",protect,updateWorkout);
router.delete("/:id",protect,deleteWorkout);

module.exports=router;