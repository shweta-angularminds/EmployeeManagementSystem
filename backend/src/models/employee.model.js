import mongoose, { Schema } from "mongoose";
const employeeSchema = new Schema(
  {
    employee_name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    designation: {
      type: String,
      required: true,
      lowercase: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    department: {
      type: String,
      required: true,
      lowercase: true,
    },
    email:{
      type: String,
      required: true,
      lowercase: true,
    },
    admin_Id: {
      type: Schema.Types.ObjectId,
      ref: "admins",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Employee = mongoose.model("employees", employeeSchema);
