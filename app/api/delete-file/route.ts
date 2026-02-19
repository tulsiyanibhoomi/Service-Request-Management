import cloudinary from "@/app/lib/cloudinary";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { public_ids } = await req.json();
  for (const id of public_ids) {
    await cloudinary.uploader.destroy(id);
  }
  return NextResponse.json({ success: true });
}
