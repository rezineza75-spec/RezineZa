// contact.service.ts
import db from "../lib/db";
import { Resend } from "resend";
import type { CreateContactDto } from "@/dtos/contact.dto";

const resend = new Resend(process.env.RESEND_API_KEY);
export async function getAllContacts() {
    return db.contactRequest.findMany({
        orderBy: { createdAt: "desc" }
    });
}
  export async function deleteContact(id: number) {
    const existing = await db.contactRequest.findUnique({ where: { id } });
    if (!existing) return null;
    await db.contactRequest.delete({ where: { id } });
    return true;
}

export async function createContact(data: CreateContactDto, userId?: string) {
  const contactEmail = process.env.CONTACT_EMAIL;
  if (!contactEmail) throw new Error("CONTACT_EMAIL non configuré");

  // 1. Sauvegarder en base
  const contact = await db.contactRequest.create({
    data: {
      name: data.name,
      email: data.email,
      subject: data.subject ?? null,
      message: data.message,
      userId: userId ?? null,
    }
  });


  // 2. Envoyer l'email
  await resend.emails.send({
    from: "Rézine'Za <onboarding@resend.dev>",
    to: contactEmail,
    subject: `Contact Rézine'Za - ${data.name}`,
    html: `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8"/>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital@0;1&family=Lato:wght@300;400;700&display=swap" rel="stylesheet"/>
    </head>
    <body style="margin:0; padding:0; background-color:#f5f3ee; font-family:'Lato', sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f3ee; padding:40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 24px rgba(64,88,130,0.10);">
              <tr>
                <td style="background-color:#405882; padding:36px 40px 28px 40px; text-align:center;">
                  <h1 style="margin:0; color:#ffffff; font-size:26px; font-weight:normal; font-family:'Playfair Display', serif; font-style:italic; letter-spacing:2px;">Rézine'Za</h1>
                  <p style="margin:6px 0 0 0; color:#9C9475; font-size:11px; letter-spacing:3px; text-transform:uppercase; font-family:'Lato', sans-serif;">Bijoux, accessoires & décoration</p>
                  <div style="width:40px; height:1px; background-color:#9C9475; margin:14px auto 0 auto;"></div>
                </td>
              </tr>
              <tr>
                <td style="background-color:#9C9475; padding:10px 40px; text-align:center;">
                  <p style="margin:0; color:#ffffff; font-size:11px; letter-spacing:3px; text-transform:uppercase; font-family:'Lato', sans-serif;">✉ &nbsp; Nouvelle demande de contact</p>
                </td>
              </tr>
              <tr>
                <td style="padding:40px 40px 28px 40px;">
                  <p style="margin:0 0 24px 0; color:#405882; font-size:15px; line-height:1.7; font-family:'Playfair Display', serif; font-style:italic;">
                    Vous avez reçu une nouvelle demande via le formulaire de contact de votre site.
                  </p>
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f8f5; border-radius:8px; border-left:4px solid #9C9475;">
                    <tr>
                      <td style="padding:28px;">
                        <p style="margin:0 0 4px 0; color:#9C9475; font-size:10px; text-transform:uppercase; letter-spacing:2px; font-family:'Lato', sans-serif;">Nom</p>
                        <p style="margin:0 0 16px 0; padding-bottom:16px; border-bottom:1px solid #e8e4d8; color:#405882; font-size:16px; font-weight:700; font-family:'Lato', sans-serif;">${data.name}</p>

                        <p style="margin:0 0 4px 0; color:#9C9475; font-size:10px; text-transform:uppercase; letter-spacing:2px; font-family:'Lato', sans-serif;">Email</p>
                        <p style="margin:0 0 16px 0; padding-bottom:16px; border-bottom:1px solid #e8e4d8; color:#333333; font-size:15px; font-family:'Lato', sans-serif;">${data.email}</p>

                        ${data.subject ? `
                        <p style="margin:0 0 4px 0; color:#9C9475; font-size:10px; text-transform:uppercase; letter-spacing:2px; font-family:'Lato', sans-serif;">Sujet</p>
                        <p style="margin:0 0 16px 0; padding-bottom:16px; border-bottom:1px solid #e8e4d8; color:#333333; font-size:15px; font-family:'Lato', sans-serif;">${data.subject}</p>
                        ` : ""}

                        <p style="margin:0 0 4px 0; color:#9C9475; font-size:10px; text-transform:uppercase; letter-spacing:2px; font-family:'Lato', sans-serif;">Message</p>
                        <p style="margin:0; color:#333333; font-size:15px; line-height:1.8; font-family:'Lato', sans-serif;">${data.message}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="background-color:#405882; padding:22px 40px; text-align:center;">
                  <p style="margin:0; color:#fff; font-size:11px; line-height:1.8; font-family:'Lato', sans-serif; letter-spacing:1px;">
                    Cet email a été envoyé automatiquement depuis votre site<br/>
                    <span style="color:#9C9475; font-family:'Playfair Display', serif; font-style:italic; font-size:14px;">Rézine'Za</span>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `,
  });

  return contact;
}

