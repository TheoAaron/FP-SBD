import Head from 'next/head';
import Navbar from '../components/navbar';

export default function Home() {
  return (
    <>
      <Head>
        <title>FP SBD</title>
      </Head>
      <Navbar />
      <main className="p-4">
        <h1>Selamat datang!</h1>
      </main>
    </>
  );
}
