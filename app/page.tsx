"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FrameGraphModal } from "./FrameGraphModal";

type RobotState = {
  fsm_class?: number;
  alert_kind?: string;
  simulation?: string;
  env?: {
    temperature_c?: number;
    humidity_pct?: number;
    dht_temperature_c?: number | null;
    dht_humidity_pct?: number | null;
    status?: string;
  } | null;
  seismic?: {
    ratio?: number;
    Mpd?: number | null;
    seismic_class?: number;
    in_burst?: boolean;
  } | null;
  board_frame?: Record<string, unknown>;
};

const defaultRobotUrl = "http://192.168.4.1:5000";

function format(value: unknown, digits = 1) {
  return typeof value === "number" && Number.isFinite(value) ? value.toFixed(digits) : "--";
}

export default function Home() {
  const [robotUrl, setRobotUrl] = useState(
    process.env.NEXT_PUBLIC_ROBOT_API_URL || defaultRobotUrl,
  );
  const [state, setState] = useState<RobotState>({});
  const [status, setStatus] = useState("Connecting");
  const [showGraphModal, setShowGraphModal] = useState(false);

  const apiBase = useMemo(() => robotUrl.replace(/\/$/, ""), [robotUrl]);

  async function loadState() {
    try {
      const res = await fetch(`${apiBase}/api/state`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setState(await res.json());
      setStatus("Live");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Offline");
    }
  }

  async function simulate(kind: "fire" | "earthquake" | "clear") {
    setStatus("Sending command");
    try {
      const res = await fetch(`${apiBase}/api/simulate/${kind}`, { method: "POST" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await loadState();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Command failed");
    }
  }

  useEffect(() => {
    loadState();
    const id = window.setInterval(loadState, 1500);
    return () => window.clearInterval(id);
  }, [apiBase]);

  const cls = state.fsm_class ?? 0;
  const env = state.env ?? {};
  const seismic = state.seismic ?? {};

  return (
    <main>
      <header>
        <div>
          <p className="eyebrow">SeismoGuard-R</p>
          <h1>Computer Dashboard</h1>
        </div>
        <div className="header-actions">
          <Link className="nav-link" href="/credits">Credits</Link>
          <span className={`status ${status === "Live" ? "live" : ""}`}>{status}</span>
        </div>
      </header>

      <section className="connection">
        <label htmlFor="robot-url">Robot API URL</label>
        <input
          id="robot-url"
          value={robotUrl}
          onChange={(event) => setRobotUrl(event.target.value)}
          spellCheck={false}
        />
      </section>

      <section className="metrics">
        <article>
          <span>Alert class</span>
          <strong className={`class${cls}`}>{cls}</strong>
        </article>
        <article>
          <span>Alert type</span>
          <strong>{state.alert_kind || "all_clear"}</strong>
        </article>
        <article>
          <span>Temperature</span>
          <strong>{format(env.temperature_c)} C</strong>
        </article>
        <article>
          <span>Humidity</span>
          <strong>{format(env.humidity_pct)}%</strong>
        </article>
        <article>
          <span>Seismic ratio</span>
          <strong>{format(seismic.ratio, 2)}</strong>
        </article>
        <article>
          <span>Simulation</span>
          <strong>{state.simulation || "none"}</strong>
        </article>
      </section>

      <section className="controls">
        <button className="fire" onClick={() => simulate("fire")}>Simulate Fire</button>
        <button className="quake" onClick={() => simulate("earthquake")}>Simulate Earthquake</button>
        <button className="clear" onClick={() => simulate("clear")}>Stop Simulation</button>
        <button className="graph" onClick={() => setShowGraphModal(true)}>View Frame Graphs</button>
      </section>

      <section className="raw">
        <h2>UNO JSON Frame</h2>
        <pre>{JSON.stringify(state.board_frame ?? {}, null, 2)}</pre>
      </section>

      <FrameGraphModal
        isOpen={showGraphModal}
        onClose={() => setShowGraphModal(false)}
        frameData={state.board_frame ?? {}}
      />
    </main>
  );
}
