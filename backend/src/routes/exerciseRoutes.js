const express=require("express");

const {
    createExercise,
    getAllExercises,
    getExerciseById,
    updateExercise,
    deleteExercise,
}=require("../controllers/exerciseController");
const router=express.Router();

router.post("/",createExercise);
router.get("/",getAllExercises);
router.get("/:id",getExerciseById);
router.put("/:id",updateExercise);
router.delete("/:id",deleteExercise);

module.exports=router;