import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, email, message } = await req.json();

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Forward the request to the existing mail API
    const mailResponse = await fetch(
      `${req.headers.get("origin")}/api/mail`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      }
    );

    if (mailResponse.ok) {
      return NextResponse.json(
        { message: "Message sent successfully!" },
        { status: 200 }
      );
    } else {
      const errorData = await mailResponse.json();
      return NextResponse.json(
        { error: errorData.error || "Failed to send message" },
        { status: mailResponse.status }
      );
    }
  } catch (error) {
    console.error("Error in contact API:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}