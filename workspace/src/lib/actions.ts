
'use server';

import { z } from 'zod';
import { Resend } from 'resend';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  email: z.string().email({ message: "Veuillez entrer une adresse email valide." }),
  phone: z.string().optional(),
  subject: z.string().min(5, { message: "Le sujet doit contenir au moins 5 caractères." }),
  message: z.string().min(10, { message: "Le message doit contenir au moins 10 caractères." }),
});

export async function sendContactForm(prevState: any, formData: FormData) {
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
        console.error("La clé API Resend n'est pas définie dans les variables d'environnement.");
        return { success: false, message: "Le service d'envoi d'e-mails est actuellement indisponible." };
    }

    const rawFormData = Object.fromEntries(formData.entries());
    const parsed = contactFormSchema.safeParse(rawFormData);

    if (!parsed.success) {
        const errorMessages = parsed.error.errors.map(e => e.message).join(', ');
        return { success: false, message: errorMessages };
    }
    
    const { name, email, phone, subject, message } = parsed.data;

    // L'adresse de destination, celle qui reçoit les e-mails.
    const toEmail = 'lestrucsdemumu@gmail.com'; 
    
    // L'adresse d'expédition. Doit être un domaine vérifié dans votre compte Resend.
    const fromEmail = 'contact@lestrucsdemumu.fr'; 
    
    const resend = new Resend(resendApiKey);

    try {
        const data = await resend.emails.send({
            from: `Formulaire Site <${fromEmail}>`,
            to: [toEmail],
            subject: `Nouveau message de ${name} : ${subject}`,
            reply_to: email, // Permet de répondre directement à l'utilisateur
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: sans-serif; line-height: 1.6; }
                        .container { padding: 20px; border: 1px solid #eee; border-radius: 5px; }
                        h1 { color: #333; }
                        p { margin-bottom: 10px; }
                        strong { color: #555; }
                        hr { border: 0; border-top: 1px solid #eee; margin: 20px 0; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Nouveau message depuis le site "Les Trucs de Mumu"</h1>
                        <p><strong>Nom :</strong> ${name}</p>
                        <p><strong>Email de contact :</strong> ${email}</p>
                        ${phone ? `<p><strong>Téléphone :</strong> ${phone}</p>` : ''}
                        <hr>
                        <h2>Sujet : ${subject}</h2>
                        <p>${message.replace(/\n/g, '<br>')}</p>
                    </div>
                </body>
                </html>
            `,
        });

        if (data.error) {
            console.error('Erreur Resend:', data.error);
            return { success: false, message: `L'envoi a échoué : ${data.error.message}` };
        }

        return { success: true, message: "Votre message a bien été envoyé !" };

    } catch (e: unknown) {
        const error = e as Error;
        console.error("Erreur inattendue lors de l'envoi de l'email:", error);
        return { success: false, message: `Une erreur inattendue s'est produite: ${error.message}` };
    }
}
