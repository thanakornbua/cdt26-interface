import Link from "next/link";

export default function CreditsPage() {
  return (
    <main className="credits">
      <header>
        <div>
          <p className="eyebrow">SeismoGuard-R</p>
          <h1>Credits</h1>
          <p className="subtitle">
            This project was created for Coding Thailand 2026: AI Inspires the Future: Regional
            Coding and AI Competition (Regional Round).
          </p>
        </div>
        <Link className="nav-link" href="/">Back to Dashboard</Link>
      </header>

      <section className="credit-card">
        <h2>Project Team</h2>
        <ul className="credit-list">
          <li>Thanakorn Buathongtanakarn</li>
          <li>Chanasorn Sawankamthorn</li>
          <li>Chonlawat Naksukpan</li>
          <li>Khwanrudee Titapurachet</li>
        </ul>
      </section>

      <section className="credit-card">
        <h2>Component Credits</h2>
        <ul className="credit-list">
          <li>Frame Graphs component (FrameGraphModal) built with Recharts.</li>
          <li>Next.js App Router and React powering the dashboard interface.</li>
        </ul>
      </section>

      <section className="credit-card">
        <h2>License</h2>
        <p>Licensed under the MIT License. See the LICENSE file for details.</p>
      </section>
    </main>
  );
}
