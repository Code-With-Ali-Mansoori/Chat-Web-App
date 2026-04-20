import mongoose from "mongoose";

export const DB_Connection = async (url : string) : Promise<void> => {
  if (!url) throw new Error('MongoDB URL is required');
  try {
    await mongoose.connect(url);
    console.log('DB Connected Successfully! ✅');
    } catch (error) {
        console.log('DB Connected Failed! ❌', error);
    }
};
