import prisma from "@prisma/prisma-client";
import { NextResponse } from "next/server";

export async function GET() {
  const addy = await prisma.additionally.findMany();

  return NextResponse.json(addy);
}
