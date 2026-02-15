// import { NextRequest, NextResponse } from "next/server";
// import cloudinary from "cloudinary";

// export async function POST(req: NextRequest) {
//   try {
//     console.log("HI");
//     const { public_ids } = await req.json();
//     console.log(public_ids);

//     if (!public_ids || !Array.isArray(public_ids)) {
//       return NextResponse.json(
//         { error: "Invalid public_ids" },
//         { status: 400 },
//       );
//     }

//     const results: any[] = [];

//     for (const id of public_ids) {
//       console.log(id);
//       const res = await cloudinary.v2.uploader.destroy(id);
//       results.push(res);
//     }

//     return NextResponse.json({ success: true, results });
//   } catch (error: any) {
//     console.log(error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// POST /api/delete-file
import cloudinary from "@/app/lib/cloudinary"; // server-only, uses API key + secret
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { public_ids } = await req.json();
  for (const id of public_ids) {
    await cloudinary.uploader.destroy(id);
  }
  return NextResponse.json({ success: true });
}
