import Realm from "realm";
import WorkoutSchema from "./models/Workouts";

export const realm = new Realm({ schema: [WorkoutSchema] })