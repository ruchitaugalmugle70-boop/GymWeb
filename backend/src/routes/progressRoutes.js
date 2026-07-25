const express=require("express");
const router=express.Router();
const protect=require("../middleware/authMiddleware");

const{
    createProgress,
    getMyProgress
}=require("../controllers/progressController");
router.post(
    "/",
    protect,
    createProgress
);
router.get(
    "/my-progress",
    protect,
    getMyProgress
);
module.exports=router;