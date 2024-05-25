
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Home() {

  return (
    <main className="min-h-screen">
      <div className="hero min-h-screen bg-base-300">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Welcome to OpenPods!</h1>
            <h2 className="py-6 text-2xl font-bold">
              No accounts, No subscriptions, No ads.
            </h2>
            <Link href="/topcharts" className="btn btn-primary">View Top Charts</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
