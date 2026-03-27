import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

export const POST = async (req: Request) => {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET)
    throw new Error("Please provide a webhook secret in the .env file");

  const headerPayload = await headers();
  const svix_signature = headerPayload.get("svix-signature");
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");

  if (!svix_id || !svix_signature || !svix_timestamp) {
    return new Response("Error -- No svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.log(err);
    return new Response("Error -- svix verification failed", { status: 400 });
  }

  const eventType = evt.type;

  if (eventType === "user.created") {
    const {
      id,
      email_addresses,
      first_name,
      last_name,
      primary_email_address_id,
      phone_numbers,
      primary_phone_number_id,
    } = evt.data;
    const primaryEmail = email_addresses.find(
      (email) => email.id === primary_email_address_id,
    )?.email_address;
    const primaryPhone = phone_numbers.find(
      (phone) => phone.id === primary_phone_number_id,
    )?.phone_number;

    // if (!primaryEmail) {
    //   return new Response("Error -- No primary email", { status: 400 });
    // }

    try {
      const user = await prisma.user.create({
        data: {
          id: id,
          email: primaryEmail ? primaryEmail : "example@gmail.com",
          name: (first_name || "") + " " + (last_name || "") || "New User",
          phone: primaryPhone ? primaryPhone : "",
        },
      });
      console.log("\n\n", JSON.stringify(user), "\n");
      console.log(`successfully created user ${id} in database!`);
    } catch (error) {
      return new Response(`Error -- ${error}`, { status: 400 });
    }
  }

  return new Response("", { status: 200 });
};
