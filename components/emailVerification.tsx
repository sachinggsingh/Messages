import * as React from 'react';

interface EmailTemplateProps {
  firstName: string;
  verifyCode: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  verifyCode,
}) => (
  <div style={{
    fontFamily: 'Arial, sans-serif',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
  }}>
    <div style={{
      backgroundColor: '#ffffff',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    }}>
      <h1 style={{
        color: '#1f2937',
        fontSize: '24px',
        marginBottom: '16px',
      }}>Welcome, {firstName}!</h1>
      
      <p style={{
        color: '#4b5563',
        fontSize: '16px',
        lineHeight: '1.5',
        marginBottom: '24px',
      }}>
        Thank you for signing up! To complete your registration, please use the following verification code:
      </p>

      <div style={{
        backgroundColor: '#f3f4f6',
        padding: '16px',
        borderRadius: '6px',
        textAlign: 'center',
        marginBottom: '24px',
      }}>
        <code style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#1f2937',
          letterSpacing: '4px',
        }}>{verifyCode}</code>
      </div>

      <p style={{
        color: '#4b5563',
        fontSize: '14px',
        lineHeight: '1.5',
      }}>
        This code will expire in 1 hour. If you didn&apos;t request this verification code, please ignore this email.
      </p>
    </div>
  </div>
);