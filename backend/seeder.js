import dotenv from "dotenv";
import workTypes from "./seedData/workTypes.js";
import WorkType from "./models/workTypeModel.js";
import workers from "./seedData/workers.js";
import Worker from "./models/workerModel.js";
import connectDB from "./config/db.js";

dotenv.config();

connectDB();

const importData = async () => {
  try {
    // await WorkType.deleteMany();
    // await WorkType.insertMany(workTypes);
    // =============================================================
    // await Worker.deleteMany();
    // await Worker.insertMany(workers);

    console.log("Data has been imported");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

importData();
