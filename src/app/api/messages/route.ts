import { DB, readDB, writeDB,Payload } from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import { Database } from "@lib/DB";


export const GET = async () => {
  readDB();
  const payload = checkToken();
  const { roomId } = <Payload>payload;
  const foundRoomIndex = (<Database>DB).messages.findIndex(
    (x) => x.roomId === roomId
  );
  if (foundRoomIndex === -1) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  };
  // const roomIdList = [];
  // for (const message of (<Database>DB).messages) {
  //   if (message.roomId === roomId) {
  //     roomIdList.push(message.roomId);
  //   }
  // }
  // const messages = [];
  // for (const roomId of roomIdList) {
  //   const messages = (<Database>DB).messages.find(
  //     (x) => x.roomId === roomId );
  // }

  return NextResponse.json({
    ok: true,
    message: (<Database>DB).messages //filtered
  });

  }

export const POST = async (request: NextRequest) => {
  readDB();
  const body = await request.json();
  const { roomId } = body;

  const foundRoomId= (<Database>DB).rooms.findIndex(
    (x) => x.roomId === roomId);
  if(foundRoomId==-1){
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  }

  const messageId = nanoid();

  writeDB();

  return NextResponse.json({
    ok: true,
    messageId: messageId,
    message: "Message has been sent",
  });
};

export const DELETE = async (request: NextRequest) => {
  const payload = checkToken();
  const { role } = <Payload>payload;

  if (role !== "SUPER_ADMIN") {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }

  const body = await request.json();
  const { messageId } = body;

  readDB();

  const foundIndex = (<Database>DB).messages.findIndex(
    (x) => x.messageId === messageId
  );
  if (foundIndex === -1) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Message is not found",
      },
      { status: 404 }
    );
  }
  (<Database>DB).messages.splice(foundIndex, 1);

  writeDB();

  return NextResponse.json({
    ok: true,
    message: "Message has been deleted",
  });
};
