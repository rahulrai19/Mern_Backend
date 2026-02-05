import mongoose, {Schema} from "mongoose ";

const subscriptionSchema = new Schema({
    subscriber:{
        type:Schema.Types.ObjectId,//subscriber who is subscirbing
        ref:"User"
    },
    channel:{
        type:Schema.Types.ObjectId,// one who get subscribed 
        ref:"User"
    }
},{timeStamps:true})

export const Subscription = mongoose.model("Subscription",subscriptionSchema);
