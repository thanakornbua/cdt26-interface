"use client";

import { useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type FrameData = {
  timestamp: number;
  temperature_c?: number;
  humidity_pct?: number;
  x_g?: number;
  y_g?: number;
  z_g?: number;
  roll?: number;
  pitch?: number;
  yaw?: number;
};

interface FrameGraphModalProps {
  isOpen: boolean;
  onClose: () => void;
  frameData: Record<string, unknown>;
}

export function FrameGraphModal({ isOpen, onClose, frameData }: FrameGraphModalProps) {
  const dataRef = useRef<FrameData[]>([]);

  useEffect(() => {
    if (!isOpen || !frameData) return;

    const newEntry: FrameData = {
      timestamp: Date.now(),
    };

    const thermo = frameData.thermo as Record<string, number> | undefined;
    if (thermo) {
      newEntry.temperature_c = thermo.temperature_c;
      newEntry.humidity_pct = thermo.humidity_pct;
    }

    const movement = frameData.movement as Record<string, number> | undefined;
    if (movement) {
      newEntry.x_g = movement.x_g;
      newEntry.y_g = movement.y_g;
      newEntry.z_g = movement.z_g;
      newEntry.roll = movement.roll;
      newEntry.pitch = movement.pitch;
      newEntry.yaw = movement.yaw;
    }

    dataRef.current.push(newEntry);
    if (dataRef.current.length > 100) {
      dataRef.current.shift();
    }
  }, [frameData, isOpen]);

  if (!isOpen) return null;

  const chartData = dataRef.current.map((d) => ({
    ...d,
    time: new Date(d.timestamp).toLocaleTimeString(),
  }));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Frame Data Monitor</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="chart-container">
            <h3>Temperature & Humidity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="temperature_c"
                  stroke="#ff7300"
                  dot={false}
                  name="Temperature (°C)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="humidity_pct"
                  stroke="#0084ff"
                  dot={false}
                  name="Humidity (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <h3>Movement - Acceleration (g)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="x_g"
                  stroke="#ff0000"
                  dot={false}
                  name="X (g)"
                />
                <Line
                  type="monotone"
                  dataKey="y_g"
                  stroke="#00ff00"
                  dot={false}
                  name="Y (g)"
                />
                <Line
                  type="monotone"
                  dataKey="z_g"
                  stroke="#0000ff"
                  dot={false}
                  name="Z (g)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <h3>Movement - Orientation (radians)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="roll"
                  stroke="#ff00ff"
                  dot={false}
                  name="Roll"
                />
                <Line
                  type="monotone"
                  dataKey="pitch"
                  stroke="#00ffff"
                  dot={false}
                  name="Pitch"
                />
                <Line
                  type="monotone"
                  dataKey="yaw"
                  stroke="#ffff00"
                  dot={false}
                  name="Yaw"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 8px;
          max-width: 1200px;
          width: 90%;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 1.5rem;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #6b7280;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
        }

        .close-btn:hover {
          background: #f3f4f6;
          color: #111827;
        }

        .modal-body {
          overflow-y: auto;
          padding: 20px;
          flex: 1;
        }

        .chart-container {
          margin-bottom: 30px;
        }

        .chart-container h3 {
          margin: 0 0 15px 0;
          font-size: 1.1rem;
          color: #374151;
        }
      `}</style>
    </div>
  );
}
