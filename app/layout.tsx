import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mini AI Support Inbox',
  description: 'Customer message triage and reply assistance powered by AI.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
