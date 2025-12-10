import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, phone, email, message } = await request.json();

    // 验证必填字段
    if (!firstName || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 检查环境变量
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('SMTP credentials not configured');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    // 创建邮件传输器 - 使用QQ邮箱SMTP配置
    const transporter = nodemailer.createTransport({
      host: 'smtp.qq.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER, // QQ邮箱地址
        pass: process.env.SMTP_PASS, // QQ邮箱授权码（不是密码）
      },
    });

    // 准备邮件内容
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: '1131811130@qq.com',
      subject: `Contact Form Submission from ${firstName}${lastName ? ' ' + lastName : ''}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #543313;">New Contact Form Submission</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin-top: 20px;">
            <p><strong>First Name:</strong> ${firstName}</p>
            ${lastName ? `<p><strong>Last Name:</strong> ${lastName}</p>` : ''}
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
            <p><strong>Email:</strong> ${email}</p>
            <div style="margin-top: 20px;">
              <strong>Message:</strong>
              <div style="background-color: white; padding: 15px; border-radius: 5px; margin-top: 10px;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            This email was sent from the Animalsox contact form.
          </p>
        </div>
      `,
      text: `
New Contact Form Submission

First Name: ${firstName}
${lastName ? `Last Name: ${lastName}\n` : ''}${phone ? `Phone: ${phone}\n` : ''}Email: ${email}

Message:
${message}
      `,
    };

    // 发送邮件
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error sending email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to send email';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

