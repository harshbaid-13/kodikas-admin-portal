import EventDay from "@models/eventDay";
import { getToken } from "next-auth/jwt";
import { connectToDatabase } from "@utils/db";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import EventTimings from "@models/eventTimings";
import Admin from "@models/admin";
import Team from "@models/team";
export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const token = await getToken({ req });
    const admin = await Admin.findOne({ username: token?.username });
    if (!admin) {
      return NextResponse.json({ error: "Not valid user", success: false });
    }

    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(null);
    }

    const details = await Team.findById(id)
      .populate("leader")
      .populate("members");

    return NextResponse.json(details);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server error" },
      { status: 500 }
    );
  }
}
