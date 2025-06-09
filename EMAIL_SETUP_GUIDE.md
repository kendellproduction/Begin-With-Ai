# Email Setup Guide for Contact Form

## Overview
The contact form on your BeginningWithAI website now sends emails to `kendellproduction@gmail.com` using a Firebase Function with Nodemailer.

## Required Setup Steps

### 1. Gmail App Password Setup
Since we're using Gmail SMTP, you need to create an "App Password" for security:

1. **Enable 2-Factor Authentication** on your `kendellproduction@gmail.com` account:
   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Click "Security" → "2-Step Verification"
   - Follow the setup process

2. **Generate App Password**:
   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Click "Security" → "App passwords" (only visible after 2FA is enabled)
   - Select "Mail" and "Other (custom name)"
   - Enter "BeginningWithAI Contact Form"
   - Copy the 16-character app password (format: xxxx xxxx xxxx xxxx)

### 2. Configure Firebase Environment Variable

Run this command in your terminal (replace `your-app-password-here` with the actual app password):

```bash
firebase functions:config:set email.password="your-app-password-here"
```

### 3. Deploy the Updated Functions

```bash
cd functions
firebase deploy --only functions
```

## How It Works

1. **User submits contact form** → Frontend sends data to Firebase Function
2. **Firebase Function validates data** → Checks required fields and email format
3. **Nodemailer sends email** → Uses Gmail SMTP with app password
4. **Email arrives at** `kendellproduction@gmail.com` with:
   - Subject: "BeginningWithAI Contact: [user's subject]"
   - Formatted HTML email with user's details
   - Reply-To set to user's email for easy response
5. **Form submission logged** → Saved to Firestore for record keeping

## Email Template

The emails you receive will be beautifully formatted with:
- **Header**: BeginningWithAI branding in sky blue
- **From**: User's name and email
- **Subject**: Their inquiry subject
- **Message**: Their full message with line breaks preserved
- **Easy Reply**: Just hit reply to respond directly to the user

## Troubleshooting

**If emails aren't sending:**
1. Check that 2FA is enabled on `kendellproduction@gmail.com`
2. Verify the app password is correct: `firebase functions:config:get`
3. Check Firebase Function logs: `firebase functions:log`
4. Make sure functions are deployed: `firebase deploy --only functions`

**If you need to update the email password:**
```bash
firebase functions:config:set email.password="new-app-password"
firebase deploy --only functions
```

## Security Notes

- App passwords are safer than your main Gmail password
- The password is stored securely in Firebase environment config
- All emails are sent via secure SMTP (port 587 with TLS)
- User data is validated before processing

## Contact Form Features

✅ **Real email sending** to kendellproduction@gmail.com
✅ **Form validation** (required fields, email format)
✅ **Error handling** with user-friendly messages
✅ **Success confirmation** for users
✅ **Firestore logging** of all submissions
✅ **Beautiful HTML email** template
✅ **Easy reply setup** (reply-to user's email)
✅ **Rate limiting** protection built-in 