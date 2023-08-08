import { connectToDatabase } from "@utils/db";
import { NextResponse } from "next/server";
import Team from "@models/team";
import User from "@models/user";
import Payment from "@models/payment";
import EventDay from "@models/eventDay";

export async function GET() {
  try {
    await connectToDatabase();
    const teams = await Team.count({ payment: true });
    const users = await User.count({});
    const transactions = await Payment.count({});
    const todaysTransactions = await Payment.count({
      createdAt: {
        $gt: new Date(new Date().getDate()),
        $lt: new Date().setDate(new Date().getDate() + 1),
      },
    });
    const teamsAttended = await EventDay.count({});
    return NextResponse.json({
      teams: teams,
      users: users,
      transactions: transactions,
      todaysTransactions: todaysTransactions,
      teamsAttended: teamsAttended,
    });
  } catch (error) {
    console.error("Error ", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}