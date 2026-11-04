# Meta Global AI Developer Hackathon - Application Form Submission

Use these polished answers to complete your hackathon application form right now:

---

### Field 1: Project Name
```text
EchoSight: Real-Time Spatial Audio & Vision Co-Pilot for the Visually Impaired
```

### Field 2: Track & Theme
* **Track:** Indie Developer Track (or Startup Track if applying as a team/company)
* **Theme:** **Build for Your World** (Bringing Meta's models into everyday assistive living)

---

### Field 3: Project Idea Description
*(Criteria: Clarity, Feasibility, Theme Fit)*

```text
EchoSight is a real-time assistive vision co-pilot engineered to give visually impaired and low-vision individuals dynamic spatial awareness and navigational independence. While conventional assistive tools generate slow, verbose scene descriptions, EchoSight focuses on micro-navigation, hazard avoidance, and everyday item localization with sub-second feedback.

The system processes continuous smartphone or smart-glass video through Meta's SAM 3.1 (Segment Anything Model) to isolate obstacles, sidewalk curb drops, descending staircases, moving pedestrians, and personal objects. These segmented masks and spatial bounding vectors are fed into Meta's Muse multimodal reasoning model to calculate danger heuristics and generate concise, imperative guidance delivered through 3D binaural spatial audio (e.g., "Approaching curb in 1.8 meters at 12 o'clock; handrail 90cm to your right"). By pairing zero-shot segmentation with directional audio cues, EchoSight eliminates cognitive overload and empowers independent movement in dynamic real-world environments.
```

---

### Field 4: Technical Skills & AI Architecture
*(Criteria: Technical Depth, Techniques Used, Feasibility)*

```text
Our technical architecture bridges computer vision, edge-to-cloud serverless streaming, and spatial audio synthesis:

1. Zero-Shot Vision Segmentation: We deploy Meta's SAM 3.1 to generate high-fidelity polygon masks and extract spatial depth coordinates from live 30 FPS video frames without task-specific retraining.
2. Multimodal Spatial Reasoning: Extracted masks and bounding box spatial vectors (azimuth, elevation, estimated distance) are streamed to Meta Muse Spark / Llama 3.2 Vision endpoints to synthesize prioritized imperative instructions and handle natural push-to-talk inquiries (e.g., "Where are my keys?").
3. Serverless Cloud Infrastructure: Deployed using Modal's serverless A10G GPU containers and Baseten/Fireworks open-weights inference endpoints, ensuring sub-150ms roundtrip latency.
4. Client-Side Spatial Engine: Built with React, Vite, Web Audio API (utilizing PannerNode and AudioListener for binaural directional radar beeps), Web Speech API for voice synthesis/recognition, and full WCAG 2.2 AAA high-contrast accessibility compliance.
```

---

### Field 5: Models & Partners Used
```text
- Vision Model: Meta SAM 3.1 (Segment Anything Model)
- Multimodal Reasoning: Meta Muse Spark / Llama 3.2 Vision Multi-Modal
- Development Agent: Muse Code Agent
- Inference Partners: Modal (Serverless GPU endpoints) & Fireworks / Baseten
```

---

### Field 6: Experience & Links
```text
- GitHub Repository: [Link to your EchoSight repository]
- Personal Portfolio / LinkedIn: [Link to your LinkedIn profile]
- Technical Background: Full-stack AI engineer with experience deploying PyTorch models, computer vision pipelines, WebSockets, and modern web applications.
```
