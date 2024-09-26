import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    ok: true,
    fullName: "Korn Sriwattana",
    studentId: "660610738",
  });
};
