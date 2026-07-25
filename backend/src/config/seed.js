const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Exercise = require("../models/Exercise");
const Workout = require("../models/Workout");

const seedDatabase = async () => {
    try {
        console.log("🌱 Syncing database exercises and workouts...");

        // 1. Create Default Admin/Trainer User
        let adminUser = await User.findOne({ email: "admin@gym.com" });
        if (!adminUser) {
            const hashedPassword = await bcrypt.hash("password123", 10);
            adminUser = await User.create({
                name: "Coach Gym",
                email: "admin@gym.com",
                password: hashedPassword,
                role: "admin",
                age: 30,
                gender: "Male",
                height: 180,
                weight: 80
            });
            console.log("👤 Default Admin User created: admin@gym.com / password123");
        }

        // 2. Define Exercises with working, stable YouTube video URLs
        const exercisesData = [
            {
                name: "Standard Push-Up",
                description: "A classic chest and upper body exercise. Place your hands shoulder-width apart, lower your body until your chest nearly touches the floor, keep your elbows tucked, and push back up while keeping a rigid core.",
                muscleGroup: "Chest",
                difficulty: "Beginner",
                equipement: "Bodyweight",
                imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=400&auto=format&fit=crop",
                videoUrl: "https://www.youtube.com/embed/kYv_3j3xTNo",
                caloriesBurnedPerMinute: 8
            },
            {
                name: "Bodyweight Squat",
                description: "Fundamental lower body strength exercise. Feet shoulder-width apart, chest tall, bend your knees and push hips back to lower down to parallel, keeping weight in your heels. Drive back up.",
                muscleGroup: "Legs",
                difficulty: "Beginner",
                equipement: "Bodyweight",
                imageUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=400&auto=format&fit=crop",
                videoUrl: "https://www.youtube.com/embed/HI7km-hjvcI",
                caloriesBurnedPerMinute: 7
            },
            {
                name: "Pull-Up",
                description: "Excellent back and bicep builder. Hang from a pull-up bar, pull yourself upwards until your chin is over the bar, squeezing your shoulder blades. Lower yourself with complete control.",
                muscleGroup: "Back",
                difficulty: "Advanced",
                equipement: "Pull-up Bar",
                imageUrl: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=400&auto=format&fit=crop",
                videoUrl: "https://www.youtube.com/embed/n9_D4e-eH4s",
                caloriesBurnedPerMinute: 10
            },
            {
                name: "Dumbbell Bicep Curl",
                description: "Isolation exercise for the biceps. Hold dumbbells at your side, keep your elbows close to your body, curl the weights towards your shoulders, and slowly lower them back down.",
                muscleGroup: "Arms",
                difficulty: "Intermediate",
                equipement: "Dumbbells",
                imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=400&auto=format&fit=crop",
                videoUrl: "https://www.youtube.com/embed/VPm48b64eM0",
                caloriesBurnedPerMinute: 5
            },
            {
                name: "Forearm Plank",
                description: "Static core stability exercise. Place forearms on the floor, elbows under shoulders, legs straight out, lifting your torso so your body is in a straight line from head to toe. Keep core locked.",
                muscleGroup: "Abs",
                difficulty: "Beginner",
                equipement: "Bodyweight",
                imageUrl: "https://images.unsplash.com/photo-1566241477600-ac026ad43874?q=80&w=400&auto=format&fit=crop",
                videoUrl: "https://www.youtube.com/embed/ynUw0YsrmSg",
                caloriesBurnedPerMinute: 4
            },
            {
                name: "Cardio Burpees",
                description: "Full body conditioning exercise. From standing, drop to squat, jump feet back to plank, complete a push-up, jump feet forward, and explosively jump vertically with hands overhead.",
                muscleGroup: "Cardio",
                difficulty: "Advanced",
                equipement: "Bodyweight",
                imageUrl: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=400&auto=format&fit=crop",
                videoUrl: "https://www.youtube.com/embed/vH8SgWp0L8A",
                caloriesBurnedPerMinute: 12
            }
        ];

        // 3. Upsert Exercises so existing references remain intact while details get updated
        const synchedExercises = [];
        for (const ex of exercisesData) {
            const doc = await Exercise.findOneAndUpdate(
                { name: ex.name },
                ex,
                { upsert: true, new: true }
            );
            synchedExercises.push(doc);
        }
        console.log(`💪 Synced ${synchedExercises.length} standard exercises.`);

        // Helper to find exercise ID by name
        const findId = (name) => synchedExercises.find(e => e.name === name)._id;

        // 4. Define Workouts referencing the exercises
        const workoutsData = [
            {
                title: "Full Body Blast",
                description: "A fast-paced, high-intensity routine designed to burn fat, build stamina, and work every major muscle group in the body using minimal equipment.",
                category: "Full Body",
                difficulty: "Intermediate",
                createdBy: adminUser._id,
                exercises: [
                    { exercise: findId("Bodyweight Squat"), sets: 3, reps: 15, restTime: 45 },
                    { exercise: findId("Standard Push-Up"), sets: 3, reps: 12, restTime: 45 },
                    { exercise: findId("Cardio Burpees"), sets: 3, reps: 10, restTime: 60 },
                    { exercise: findId("Forearm Plank"), sets: 3, reps: 1, restTime: 30 }
                ]
            },
            {
                title: "Upper Body strength",
                description: "Focus on building raw strength in the chest, back, biceps, and shoulders. Take your time on reps, concentrating on muscle contraction.",
                category: "strength",
                difficulty: "Advanced",
                createdBy: adminUser._id,
                exercises: [
                    { exercise: findId("Pull-Up"), sets: 4, reps: 8, restTime: 90 },
                    { exercise: findId("Standard Push-Up"), sets: 4, reps: 15, restTime: 60 },
                    { exercise: findId("Dumbbell Bicep Curl"), sets: 3, reps: 12, restTime: 60 }
                ]
            },
            {
                title: "HIIT Core Shredder",
                description: "Get your heart rate up and trim down your midsection with this short, high-effort core conditioning and cardio sequence.",
                category: "HIIT",
                difficulty: "Beginner",
                createdBy: adminUser._id,
                exercises: [
                    { exercise: findId("Forearm Plank"), sets: 4, reps: 1, restTime: 30 },
                    { exercise: findId("Cardio Burpees"), sets: 4, reps: 8, restTime: 45 },
                    { exercise: findId("Bodyweight Squat"), sets: 3, reps: 20, restTime: 30 }
                ]
            }
        ];

        // 5. Upsert Workouts
        const synchedWorkouts = [];
        for (const w of workoutsData) {
            const doc = await Workout.findOneAndUpdate(
                { title: w.title },
                w,
                { upsert: true, new: true }
            );
            synchedWorkouts.push(doc);
        }
        console.log(`🔥 Synced ${synchedWorkouts.length} custom workouts.`);
        console.log("✨ Seeding completed successfully!");
    } catch (error) {
        console.error("❌ Seeding database failed:", error);
    }
};

module.exports = seedDatabase;
