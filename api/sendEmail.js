const https = require('https');

function postJson(url, payload, headers) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const data = JSON.stringify(payload);

    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method: 'POST',
      headers: Object.assign(
        {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
        },
        headers || {}
      ),
    };

    const request = https.request(options, (response) => {
      let body = '';
      response.on('data', (chunk) => {
        body += chunk;
      });
      response.on('end', () => {
        let json = {};
        try {
          json = body ? JSON.parse(body) : {};
        } catch (_err) {
          json = { raw: body };
        }
        resolve({ statusCode: response.statusCode, body: json });
      });
    });

    request.on('error', reject);
    request.write(data);
    request.end();
  });
}

async function logToGoogleSheet(data) {
  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  if (!webhookUrl) {
    return { enabled: false, ok: false };
  }

  const headers = {};
  if (process.env.GOOGLE_SHEET_WEBHOOK_SECRET) {
    headers['X-Webhook-Secret'] = process.env.GOOGLE_SHEET_WEBHOOK_SECRET;
  }

  try {
    const response = await postJson(
      webhookUrl,
      Object.assign({}, data, {
        source: 'esg-waitlist-web',
        sendEmail: false,
        submittedAt: new Date().toISOString(),
      }),
      headers
    );

    const ok = response.statusCode >= 200 && response.statusCode < 300;
    if (!ok) {
      console.error('sheet log failed:', response.statusCode, response.body);
    }
    return { enabled: true, ok: ok };
  } catch (error) {
    console.error('sheet log failed:', error && error.message ? error.message : error);
    return { enabled: true, ok: false };
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ error: 'Missing RESEND_API_KEY on server' });
  }

  const { companyName, personName, email, demoDate } = req.body || {};

  if (!companyName || !personName || !email || !demoDate) {
    return res.status(400).json({ error: 'Missing required form fields' });
  }

  try {
    const resendResponse = await postJson(
      'https://api.resend.com/emails',
      {
        from: 'Zissions <suhasani@zissions.com>',
        to: [email],
        subject: "You're on the Zissions ESG Waitlist",
        html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937; padding: 20px;">
          
          <p>Hi ${personName},</p>

          <p>
            Thank you for registering at <strong>Zissions</strong> for our ESG automation waitlist!
            We have noted your availability for a demo on 
            <strong>${demoDate}</strong>.
          </p>

          <p>
            We will contact you soon.
          </p>

          <br/>

          <p>Best regards,<br/>
          <strong>The ESG Team</strong></p>

        </div>
      `,
      },
      {
        Authorization: 'Bearer ' + process.env.RESEND_API_KEY,
      }
    );

    if (resendResponse.statusCode < 200 || resendResponse.statusCode >= 300) {
      return res.status(500).json({
        error: resendResponse.body && resendResponse.body.message
          ? resendResponse.body.message
          : 'Resend failed to send email',
      });
    }

    const sheetLog = await logToGoogleSheet({
      companyName: companyName,
      personName: personName,
      email: email,
      demoDate: demoDate,
    });

    return res.status(200).json({
      success: true,
      id: resendResponse.body && resendResponse.body.id ? resendResponse.body.id : null,
      sheetLogged: sheetLog.enabled ? sheetLog.ok : null,
    });
  } catch (error) {
    const message = error && error.message ? error.message : 'Unexpected server error while sending email';
    console.error('sendEmail error:', message, error);
    return res.status(500).json({ error: message });
  }
};
