# 🧭 CUSAT Wayfinder Pro
> **Interactive Campus Map, Google Maps-Style Live GPS Navigation & Pro AI Assistant for Cochin University of Science and Technology (CUSAT)**

![CUSAT Wayfinder Banner](https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80)

---

## ✨ Features

### 🗺️ 1. Interactive Cochin University (CUSAT) Campus Map
- **Accurate Coordinates**: Geocoded specifically for the CUSAT Main Campus in South Kalamassery / Thrikkakara, Kochi (10.0435° N, 76.3245° E).
- **25+ Points of Interest (POIs)**: School of Engineering (SOE), Central Library, Dept of Computer Science (DCS), Dept of Computer Applications (DCA), School of Management Studies (SMS), Kunjali Marakkar School of Marine Engineering (KMSME), Canteen & Student Amenity Centre, Men's & Women's Hostels (Siberia, Ananya), CUSAT Metro Station, Health Centre, Sports Complex, and more.
- **Dynamic Tile Layer Switcher**: 
  - 🏙️ **Streets View**: OpenStreetMap high-resolution vector tiles.
  - 🚶 **Walkways View**: Humanitarian OpenStreetMap pedestrian paths.
  - 🛰️ **Satellite View**: High-definition Esri World Imagery aerial photography.
  - 🌙 **Dark Canvas**: Sleek dark mode styling.

### 🧭 2. Google Maps-Style Live Turn-by-Turn Navigation
- **Shortest Path Graph Routing**: Powered by custom Dijkstra algorithms mapped to real CUSAT campus avenues, pedestrian pathways, and links.
- **Turn-by-Turn Maneuver Guidance**: Live HUD banner showing real-time turn instructions (e.g., *"In 50m, Turn right onto Computer Science Avenue"*), remaining distance, and ETA.
- **Live Animated Navigation Simulation**: Interactive moving pedestrian/vehicle avatar along the path with orientation compass cone, auto-camera panning, and real-time speedometer.
- **Real-Device GPS Geolocation**: High-accuracy `watchPosition` GPS tracking for users walking on the CUSAT campus.
- **Voice Navigation**: Built-in audio speech synthesis (`speechSynthesis`) providing voice navigation alerts.
- **Multi-Travel Modes**: 🚶‍♂️ Walking, 🚴‍♂️ Cycling, 🚗 Vehicle / E-Rickshaw.

### ⚡ 3. Intelligent AI Campus Assistant ("CUSAT AI Pro")
- **Semantic Campus Engine**: Deep domain knowledge on CUSAT departments, admission procedures (CAT), library hours, food & canteens, hostel rules, emergency helplines, and tech fests (Dhishna, Vipanchika).
- **Actionable Map Integration**: The AI assistant directly triggers map movements, sets origin/destination, highlights buildings, and begins route navigation.
- **Voice Dictation & Voice Output**: Web Speech Recognition microphone input + spoken audio output.
- **Cloud LLM Support**: Optional Google Gemini API key configuration for infinite open-ended conversational intelligence.

### 📊 4. Campus Status & Live Dashboard
- **Live Facility Occupancy**: Real-time simulated crowd meter for Central Library, Canteen, and Innovation Labs.
- **Kochi Weather Widget**: Real-time temperature, humidity, and weather alerts for Kalamassery, Kochi.
- **Campus Emergency SOS Directory**: Instant one-tap calling for University Health Centre, Campus Security, Women's Helpline, and Ambulance.

---

## 🚀 Getting Started

### Prerequisites
A modern web browser (Google Chrome, Microsoft Edge, Firefox, Safari).

### Running Locally
You can run this project with any local HTTP server:

```bash
# Using Python
python -m http.server 3000

# Or using Node.js / npx
npx serve .
```

Then open your browser at `http://localhost:3000`.

---

## 🛠️ Project Structure

```
camp/
├── index.html                  # Modern semantic application entry point
├── css/
│   └── style.css               # Glassmorphism design system & responsive navigation HUD
├── js/
│   ├── campus-data.js          # CUSAT coordinates, landmark POIs, graph edges & AI knowledge base
│   ├── map-engine.js           # Leaflet map controller, Dijkstra pathfinder, GPS & simulation
│   ├── ai-chatbot.js           # Natural language processor, speech recognition & Gemini API
│   └── app.js                  # Main controller linking UI, status feeds & search autocomplete
└── README.md                   # Project documentation
```

---

## 👨‍💻 Author

- **GitHub**: [@Meghaa-sys](https://github.com/Meghaa-sys)
- **Email**: meghasuresh200420@gmail.com
