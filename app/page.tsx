import Link from 'next/link';
import NavBar from './components/NavBar';

export default function Home() {

  return (
    <main>
      <div className="hero min-h-screen bg-base-300">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Welcome to OpenPods!</h1>
            <h2 className="py-6 text-2xl font-bold">
              No accounts, No subscriptions, No ads.
            </h2>
            <Link href="/topcharts" className="btn bg-primary hover:bg-base-100">View Top Charts</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
