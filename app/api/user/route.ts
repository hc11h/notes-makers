// GET /api/user/me?token=... returns the current user data if token is valid
export async function GET_ME(req: NextRequest) {
  await dbConnect();
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Token required" }, { status: 400 });
  }
  const user = await User.findOne({ token });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  // Only return safe fields
  return NextResponse.json({ userId: user.userId, createdAt: user.createdAt });
}

import { NextRequest, NextResponse } from "next/server"
import { randomUUID } from "crypto"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import { nanoid } from "nanoid";


export async function POST(req: NextRequest) {
  await dbConnect();

  const token = nanoid(); // could also use nanoid or another crypto method
  const userId = randomUUID();

  try {
    
    const existing = await User.findOne({ token });
    if (existing) {
      return NextResponse.json(
        { error: "Token collision, please try again." },
        { status: 409 }
      );
    }

    const user = await User.create({ token, userId });

    return NextResponse.json({
      token: user.token,
      userId: user.userId,
    });
  } catch (err: any) {
    console.error("User creation error:", err);
    return NextResponse.json(
      { error: "Failed to create user", detail: err.message },
      { status: 500 }
    );
  }
}


export async function GET(req: NextRequest) {
  await dbConnect()
  const token = req.nextUrl.searchParams.get("token")
  if (!token) {
    return NextResponse.json({ valid: false }, { status: 401 })
  }
  const user = await User.findOne({ token })
  if (!user) {
    return NextResponse.json({ valid: false }, { status: 401 })
  }
  return NextResponse.json({ valid: true, userId: user.userId })
}