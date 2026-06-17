import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const res = { testing: "successful" };
    return NextResponse.json(res, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message, stack: e.stack },
      { status: 500 },
    );
  }
};
