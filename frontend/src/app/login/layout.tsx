import { ReactNode } from 'react';

export const metadata = {
  title: 'Login',
  description: 'Login to your account',
};

export default function SigninLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen flex justify-center items-center bg-gray-50 p-6">
      {children}
    </main>
  );
}