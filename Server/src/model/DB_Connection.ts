import mongoose from "mongoose";

export const DB_Connection = async (url : string) : Promise<void> => {
    try {
        await mongoose.connect(url);
        console.log('DB Connected Successfully! ✅');
        
    } catch (error) {
        console.log('DB Connected Failed! ❌', error);
    }
};
