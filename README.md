# SeismoGuard-R Computer Dashboard

Run this Next.js dashboard on your computer, not on the UNO Q.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`, then set the Robot API URL to the UNO Q app API, for example `http://<robot-ip>:5000`.

The dashboard reads:

- `GET /api/state`
- `GET /api/frame`

Simulation buttons send:

- `POST /api/simulate/fire`
- `POST /api/simulate/earthquake`
- `POST /api/simulate/clear`
