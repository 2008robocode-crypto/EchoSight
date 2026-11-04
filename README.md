# EchoSight 👁️🔊
### Real-Time Spatial Audio & Multi-Modal Vision Co-Pilot for the Visually Impaired
**Submitted for the Meta Global AI Developer Hackathon 2026**  
*Theme: Build for Your World
Test link: https://2008robocode-crypto.github.io/EchoSight/

---

## 📌 Executive Summary
There are over **285 million visually impaired individuals** worldwide who face daily barriers to independent navigation. While existing mobile tools provide slow, verbose scene descriptions (e.g., *"There is a sidewalk with trees and people"*), they lack **critical spatial precision, low-latency obstacle prioritization, and directional depth awareness**.

**EchoSight** transforms continuous smartphone or smart-glass video into **dynamic spatial awareness**. By combining **Meta's SAM 3.1 (Segment Anything Model 3.1)** with **Meta Muse Multimodal Reasoning** and **3D Binaural Spatial Audio**, EchoSight isolates hazards and targets in real time, projecting imperative guidance straight into the user's ears (e.g., *"Curb drop at 12 o'clock in 1.8 meters"* or *"Prescription bottle located at 11 o'clock, 45cm away"*).

---

## 🚀 Key Features

* **Meta SAM 3.1 Zero-Shot Spatial Segmentation**:
  Real-time isolation of curbs, stairs, doors, moving pedestrians, construction cones, and everyday essentials (keys, medicine bottles).
* **3D Binaural Spatial Radar & Panning**:
  Leverages the **Web Audio API 3D Panner** to deliver directional audio clicks and radar pings. If an obstacle is to your right, you hear it in your right ear with a pitch proportional to its proximity.
* **Meta Muse Multimodal Conversational Agent**:
  Push-to-talk voice interface allowing users to ask natural inquiries: *"Where did I leave my keys?"*, *"Is the path ahead clear?"*, or *"Read this medication label"*.
* **Tested Simulation Scenarios & Live Camera**:
  Includes calibrated real-world scenarios (Outdoor Crosswalks, Transit Staircases, Tabletop Item Locator) plus live device camera streaming.
* **WCAG 2.2 AAA Accessibility Built-in**:
  High-contrast yellow-on-black mode, haptic feedback pulses (`navigator.vibrate`), screen-reader labels, and one-key accessibility shortcuts (`Space`, `H`, `M`, `C`, `1/2/3`).

---

## 🏗️ Architecture

```
[Smartphone Camera / Video Stream]
              │
              ▼
    [FastAPI / WebRTC Gateway]
              │
    ┌─────────┴────────────────────────────────────────┐
    ▼                                                  ▼
[Meta SAM 3.1 on Modal A10G]               [Spatial Coordinate Engine]
• Zero-shot semantic masks                  • Bounding box azimuth (-90° to +90°)
• Elevation & edge contours                 • Estimated distance (0.3m - 6.0m)
• Salient object bounding boxes             • Clock bearing (e.g. 11 o'clock)
    └─────────┬────────────────────────────────────────┘
              │
              ▼
    [Meta Muse Multimodal Reasoning]
    • Real-time hazard prioritization (Stairs > Pedestrian > Landmark)
    • Concise imperative text synthesis (<150ms token generation)
              │
              ▼
    [Client Spatial Synthesis]
    • Web Audio API Binaural Stereo Panner
    • Web Speech API imperative voice output
    • Haptic vibration pulses
```

---

## 🧠 Meta Models & Partner Compute Utilization

| Component | Model / Service | Role in EchoSight |
| :--- | :--- | :--- |
| **Vision Segmentation** | **Meta SAM 3.1** | Instant zero-shot segmentation of complex urban & indoor geometry (curbs, drop-offs, stairs, small objects). |
| **Multimodal CoT** | **Meta Muse Spark / Wonder** | Contextual understanding, hazard risk scoring, and natural conversational question answering. |
| **Code Acceleration** | **Muse Code Agent** | Used to scaffold low-latency async endpoints and Web Audio pipeline logic. |
| **Serverless GPU** | **Modal (A10G)** | Serverless containerized hosting for sub-150ms inference latency. |
| **Open Weights API** | **Fireworks / Baseten** | High-throughput streaming endpoint for continuous token inference. |

---

## ⚡ Quickstart

### Prerequisites
* Node.js v18+ 
* Python 3.10+ (for backend)

### 1. Launch the Frontend
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

### 2. Launch the Backend (Optional for local API)
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### 3. Deploy to Modal Serverless GPU
```bash
cd backend
modal deploy modal_app.py
```

---

## ⌨️ Accessibility Hotkeys
* `Space`: Repeat high-priority spatial voice guidance.
* `M`: Toggle audio mute.
* `H`: Toggle High-Contrast AAA Mode.
* `C`: Toggle Live Camera / Simulated Scenario.
* `1 / 2 / 3`: Switch scenarios (Street / Transit Stairs / Item Locator).
