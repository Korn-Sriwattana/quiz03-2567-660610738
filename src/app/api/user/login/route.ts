import jwt from "jsonwebtoken";
import { Database } from "@lib/DB";
import { DB, readDB } from "@lib/DB";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  
  const body = await request.json();
  const { username, password } = body;
  
  readDB();

  const user = (<Database>DB).users.find(
    (user) => user.username === username && user.password === password  //มีuser และ passwordนี้อยู่ไหม
  );
  
  if (!user) {
    return NextResponse.json(
      {
        ok: false,
        message: "Username or Password is incorrect",
      },
      { status: 400 }
    );
  }

  const secret = process.env.JWT_SECRET || "This is another secret"

  const token = jwt.sign(
    { username, role: user.role}, //สิ่งนี้คือpayload เอาไว้บอกว่าคุณอยากใส่อะไรเข้าไปในtokenบ้าง
    secret, //เหมือนกุญแจ
    { expiresIn: "8h" } //อยากให้tokenนี้มีอายุขัยเท่าไหร่
  );
  // const token = "Replace this with token creation";

  return NextResponse.json({ ok: true, token });
};
