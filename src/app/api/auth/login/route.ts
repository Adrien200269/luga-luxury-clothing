import { NextResponse } from "next/server";
import { prisma } from "@/services/db";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const trimmedEmail = String(email || "").trim().toLowerCase();
    const trimmedPass = String(password || "").trim();

    const validAdminEmails = ["admin@luga.studio", "adrien@luga.studio", "admin"];
    const validAdminPasswords = ["luga2026", "luga", "admin"];

    const isMatch =
      validAdminEmails.includes(trimmedEmail) && validAdminPasswords.includes(trimmedPass);

    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid atelier credentials. Access denied." },
        { status: 401 }
      );
    }

    const actualEmail = trimmedEmail.includes("@") ? trimmedEmail : "admin@luga.studio";

    // Upsert or fetch admin user from Supabase database
    const user = await prisma.user.upsert({
      where: { email: actualEmail },
      update: {
        role: "ADMIN",
        name: "Sabja Shrestha // Atelier Director",
      },
      create: {
        email: actualEmail,
        name: "Sabja Shrestha // Atelier Director",
        role: "ADMIN",
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name || "Atelier Director",
        role: user.role,
        lastLogin: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("API POST /api/auth/login error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
