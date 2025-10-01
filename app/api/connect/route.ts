import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

// POST /api/connect
// Body: { token: string }
export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const { token } = await req.json();
    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "Token required" }, { status: 400 });
    }
    const user = await User.findOne({ token });
    if (!user) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }
    // Optionally, update user with device info, last connected, etc.
    return NextResponse.json({ success: true, userId: user.userId });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
