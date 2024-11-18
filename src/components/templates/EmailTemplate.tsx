import * as React from 'react';

interface EmailTemplateProps {
    email: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({ email }) => (
    <div style={styles.container}>
        <div style={styles.header}>
            <h1 style={styles.heading}>Welcome to Our Community!</h1>
        </div>
        <div style={styles.body}>
            <p style={styles.greeting}>Hello, {email}!</p>
            <p style={styles.message}>
                We’re excited to have you on board. Thank you for joining us! You are now part of a vibrant community that strives to make a difference.
            </p>
            <p style={styles.footer}>
                If you have any questions or need assistance, feel free to reach out to our support team.
            </p>
        </div>
    </div>
);

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f4f4f4',
        color: '#333',
        padding: '20px',
        maxWidth: '600px',
        margin: '0 auto',
        borderRadius: '8px',
        border: '1px solid #ddd',
    },
    header: {
        backgroundColor: '#4CAF50',
        padding: '10px 20px',
        borderRadius: '8px 8px 0 0',
        textAlign: 'center',
    },
    heading: {
        color: '#fff',
        margin: '0',
        fontSize: '24px',
    },
    body: {
        padding: '20px',
    },
    greeting: {
        fontSize: '18px',
        fontWeight: 'bold',
    },
    message: {
        fontSize: '16px',
        margin: '10px 0',
        lineHeight: '1.5',
    },
    footer: {
        fontSize: '14px',
        marginTop: '20px',
        color: '#777',
    },
};
