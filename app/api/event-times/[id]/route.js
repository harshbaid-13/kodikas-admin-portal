import { NextResponse } from "next/server";
import { connectToDatabase } from "@utils/db";
import EventTimings from "@models/eventTimings";
import { getDetails } from "@utils/getDetails";
import mongoose from "mongoose";
import Admin from "@models/admin";

export async function POST(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const data = await req.json();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          message: "Not a valid Id",
        },
        { status: 404 }
      );
    }
    const admin = getDetails(req);
    const adminData = await Admin.findById(admin?.id);
    if (!adminData) {
      return NextResponse.json(
        {
          message: "admin not found",
        },
        { status: 404 }
      );
    }
    if (!adminData.isSuperAdmin) {
      return NextResponse.json(
        {
          message: "Only super admins are allowed to update status of a link",
        },
        { status: 400 }
      );
    }
    if (data.startTime > data.endTime) {
      return NextResponse.json(
        {
          message: "Start time should be less than End time",
        },
        { status: 400 }
      );
    }
    const newUpdate = await EventTimings.findByIdAndUpdate(id, data, {
      new: true,
    });

    return NextResponse.json(
      { message: "Timings update successfully", newUpdate },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
