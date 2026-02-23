import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { companyName, personName, email, demoDate } = req.body;

  try {
    await resend.emails.send({
      from: 'Zissions <suhasani@zissions.com>',
      to: email,
      subject: 'You’re on the Zissions Early Access List 🌱',
      html: `
        <div style="font-family:Arial;padding:20px">
          <h2>Welcome to Zissions</h2>
          <p>Hi ${personName},</p>
          <p>You’re officially on our ESG automation early access list.</p>
          <p>We’ll connect with you before your demo date: <strong>${demoDate}</strong></p>
          <br/>
          <p>– Team Zissions</p>
        </div>
      `,
    });

    return res.status(200).json({ success: true });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
