const mongoose=require("mongoose");
const exerciseSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    muscleGroup:{
        type:String,
        required:true
    },
    difficulty:{
        type:String,
        enum:["Beginner","Intermediate","Advanced"],
        default:"Beginner",
    },
    equipement:{
        type:String,
        default:"Bodyweight",
    },
    imageUrl:{
        type:String,
    },
    videoUrl:{
        type:String,
    },
    caloriesBurnedPerMinute:{
        type:Number,
        default:0,
    },

},
{
    timestamps:true,
}
);
module.exports = mongoose.model("Exercise", exerciseSchema);