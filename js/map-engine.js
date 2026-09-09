/**
 * Cochin University (CUSAT) - Interactive Map & Navigation Engine
 * Powered by Leaflet.js, Dijkstra Pathfinding, Geolocation & Speech Synthesis
 */

class CampusMapEngine {
  constructor(containerId = 'map-container') {
    this.containerId = containerId;
    this.map = null;
    this.tileLayers = {};
    this.currentTileKey = 'voyager';
    this.markers = {};
    this.markersLayerGroup = null;
    this.routePolyline = null;
    this.routeGlowPolyline = null;
    this.walkerMarker = null;
    this.userLocationMarker = null;
    this.userAccuracyCircle = null;

    // Navigation state
    this.activeRoute = null;
    this.navigationMode = 'walk'; // 'walk', 'cycle', 'drive'
    this.isNavigating = false;
    this.isSimulating = false;
    this.simSpeed = 1.0;
    this.simAnimFrame = null;
    this.simProgress = 0; // 0 to 1
    this.voiceEnabled = true;
    this.lastSpokenStep = -1;
    this.watchId = null;

    // Graph & Adjacency
    this.graph = {};
    this.initGraph();
  }

  // Calculate Haversine distance in meters between two [lat, lng] coordinates
  static getDistance(p1, p2) {
    const R = 6371e3; // metres
    const φ1 = (p1[0] * Math.PI) / 180;
    const φ2 = (p2[0] * Math.PI) / 180;
    const Δφ = ((p2[0] - p1[0]) * Math.PI) / 180;
    const Δλ = ((p2[1] - p1[1]) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Calculate compass bearing in degrees between two points
  static getBearing(p1, p2) {
    const φ1 = (p1[0] * Math.PI) / 180;
    const φ2 = (p2[0] * Math.PI) / 180;
    const Δλ = ((p2[1] - p1[1]) * Math.PI) / 180;

    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x =
      Math.cos(φ1) * Math.sin(φ2) -
      Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    const θ = Math.atan2(y, x);
    return ((θ * 180) / Math.PI + 360) % 360;
  }

  // Build graph adjacency list with weights
  initGraph() {
    const nodes = CUSAT_DATA.pathNodes;
    for (const key in nodes) {
      this.graph[key] = [];
    }

    CUSAT_DATA.pathEdges.forEach(edge => {
      const p1 = nodes[edge.from];
      const p2 = nodes[edge.to];
      if (p1 && p2) {
        const weight = CampusMapEngine.getDistance(p1, p2);
        this.graph[edge.from].push({ to: edge.to, weight, name: edge.name });
        this.graph[edge.to].push({ to: edge.from, weight, name: edge.name });
      }
    });
  }

  // Initialize Leaflet Map
  init() {
    if (!document.getElementById(this.containerId)) return;

    this.map = L.map(this.containerId, {
      center: CUSAT_DATA.center,
      zoom: CUSAT_DATA.defaultZoom,
      minZoom: CUSAT_DATA.minZoom,
      maxZoom: CUSAT_DATA.maxZoom,
      zoomControl: false,
      attributionControl: false
    });

    // 100% Free Public Tile Layers (No API Key Required)
    this.tileLayers = {
      osm: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }),
      hot: L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team'
      }),
      satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      }),
      dark: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 16,
        attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
      }),
      esriStreet: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: 'Tiles &copy; Esri'
      })
    };

    // Default to OpenStreetMap (clean, detailed campus buildings and paths)
    this.currentTileKey = 'osm';
    this.tileLayers[this.currentTileKey].addTo(this.map);

    // Zoom control in bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(this.map);

    // Markers Layer Group
    this.markersLayerGroup = L.layerGroup().addTo(this.map);

    // Add Landmarks
    this.renderLandmarks();

    // Map Click Listener
    this.map.on('click', () => {
      if (window.innerWidth < 768 && window.CampusApp) {
        window.CampusApp.collapseMobilePanels();
      }
    });

    return this;
  }

  // Switch Base Layer
  switchLayer(key) {
    if (!this.tileLayers[key] || this.currentTileKey === key) return;
    this.map.removeLayer(this.tileLayers[this.currentTileKey]);
    this.tileLayers[key].addTo(this.map);
    this.currentTileKey = key;
  }

  // Render all CUSAT landmark pins with category styles
  renderLandmarks(activeCategory = 'all') {
    this.markersLayerGroup.clearLayers();
    this.markers = {};

    CUSAT_DATA.landmarks.forEach(item => {
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return;
      }

      const catMeta = CUSAT_DATA.categories[item.category] || { color: '#3b82f6', icon: 'map-pin' };

      // Custom HTML Marker Icon
      const customIcon = L.divIcon({
        className: 'custom-campus-marker',
        html: `
          <div class="marker-pin-wrapper" style="--pin-color: ${catMeta.color};">
            <div class="marker-pin-pulse"></div>
            <div class="marker-pin-body">
              <span class="marker-pin-label">${this.getCategoryEmoji(item.category)}</span>
            </div>
            <div class="marker-pin-arrow"></div>
          </div>
        `,
        iconSize: [36, 44],
        iconAnchor: [18, 42],
        popupAnchor: [0, -40]
      });

      const marker = L.marker(item.coords, { icon: customIcon });

      // Rich interactive popup
      const popupHtml = `
        <div class="campus-popup-card">
          <div class="popup-header-img" style="background-image: url('${item.image || ''}')">
            <div class="popup-badge" style="background-color: ${catMeta.color}">
              ${catMeta.name}
            </div>
          </div>
          <div class="popup-body">
            <h4 class="popup-title">${item.name}</h4>
            <p class="popup-desc">${item.description}</p>
            
            <div class="popup-meta">
              <div class="meta-item"><i data-lucide="clock"></i> <span>${item.timings || 'Open Campus'}</span></div>
              ${item.phone ? `<div class="meta-item"><i data-lucide="phone"></i> <span>${item.phone}</span></div>` : ''}
              ${item.occupancy ? `
                <div class="meta-item occupancy-bar-wrapper">
                  <span class="occ-label">Live Crowd:</span>
                  <div class="occ-track"><div class="occ-fill" style="width:${item.occupancy}%; background-color:${item.occupancy > 75 ? '#ef4444' : '#10b981'}"></div></div>
                  <span class="occ-val">${item.occupancy}%</span>
                </div>` : ''}
            </div>

            <div class="popup-actions">
              <button class="popup-btn-nav" onclick="CampusApp.setDestinationAndRoute('${item.id}')">
                <i data-lucide="navigation"></i> Navigate Here
              </button>
              <button class="popup-btn-origin" onclick="CampusApp.setOrigin('${item.id}')">
                <i data-lucide="map-pin"></i> Set Origin
              </button>
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 310, className: 'cusat-leaflet-popup' });
      marker.on('popupopen', () => {
        if (window.lucide) window.lucide.createIcons();
      });

      marker.addTo(this.markersLayerGroup);
      this.markers[item.id] = marker;
    });

    if (window.lucide) window.lucide.createIcons();
  }

  getCategoryEmoji(category) {
    const emojis = {
      academic: '🎓',
      admin: '🏛️',
      food: '🍽️',
      hostel: '🛏️',
      lab: '🔬',
      transit: '🚇',
      sports: '⚽',
      medical: '🏥'
    };
    return emojis[category] || '📍';
  }

  // Pan and zoom to specific landmark
  focusLandmark(landmarkId, openPopup = true) {
    const lm = CUSAT_DATA.landmarks.find(l => l.id === landmarkId);
    if (!lm) return;

    this.map.flyTo(lm.coords, 18, { duration: 1.2 });
    if (openPopup && this.markers[landmarkId]) {
      setTimeout(() => {
        this.markers[landmarkId].openPopup();
      }, 1200);
    }
  }

  // Dijkstra Algorithm to find shortest path between two graph nodes
  findShortestPath(startNodeKey, endNodeKey) {
    if (!this.graph[startNodeKey] || !this.graph[endNodeKey]) {
      return null;
    }

    const distances = {};
    const previous = {};
    const edgeNames = {};
    const unvisited = new Set();

    for (const node in this.graph) {
      distances[node] = Infinity;
      previous[node] = null;
      unvisited.add(node);
    }

    distances[startNodeKey] = 0;

    while (unvisited.size > 0) {
      let closestNode = null;
      let minDistance = Infinity;

      for (const node of unvisited) {
        if (distances[node] < minDistance) {
          minDistance = distances[node];
          closestNode = node;
        }
      }

      if (closestNode === null || minDistance === Infinity) break;
      if (closestNode === endNodeKey) break;

      unvisited.delete(closestNode);

      for (const neighbor of this.graph[closestNode]) {
        if (!unvisited.has(neighbor.to)) continue;

        const alt = distances[closestNode] + neighbor.weight;
        if (alt < distances[neighbor.to]) {
          distances[neighbor.to] = alt;
          previous[neighbor.to] = closestNode;
          edgeNames[neighbor.to] = neighbor.name;
        }
      }
    }

    if (distances[endNodeKey] === Infinity) return null;

    // Reconstruct path
    const pathNodes = [];
    const streetSegments = [];
    let curr = endNodeKey;

    while (curr) {
      pathNodes.unshift(curr);
      if (edgeNames[curr]) {
        streetSegments.unshift(edgeNames[curr]);
      }
      curr = previous[curr];
    }

    const coordinates = pathNodes.map(nodeKey => CUSAT_DATA.pathNodes[nodeKey]);
    const totalMeters = distances[endNodeKey];

    return {
      nodeKeys: pathNodes,
      coordinates,
      totalMeters,
      streetSegments
    };
  }

  // Generate Google Maps-style turn-by-turn maneuvers
  generateManeuvers(pathResult, originLandmark, destLandmark) {
    const coords = pathResult.coordinates;
    const steps = [];

    if (coords.length < 2) return steps;

    // Step 1: Start
    const initialBearing = CampusMapEngine.getBearing(coords[0], coords[1]);
    const initDirection = this.bearingToDirection(initialBearing);
    const firstSegmentDist = CampusMapEngine.getDistance(coords[0], coords[1]);

    steps.push({
      type: 'depart',
      icon: 'arrow-up',
      instruction: `Head ${initDirection} from ${originLandmark ? originLandmark.shortName : 'starting point'}`,
      street: pathResult.streetSegments[0] || 'Campus Walkway',
      distance: Math.round(firstSegmentDist),
      coords: coords[0]
    });

    // Intermediate turns
    for (let i = 1; i < coords.length - 1; i++) {
      const bPrev = CampusMapEngine.getBearing(coords[i - 1], coords[i]);
      const bNext = CampusMapEngine.getBearing(coords[i], coords[i + 1]);
      const dist = CampusMapEngine.getDistance(coords[i], coords[i + 1]);
      const street = pathResult.streetSegments[i] || 'Campus Walkway';

      let diff = bNext - bPrev;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;

      let maneuver = 'continue';
      let icon = 'arrow-up';
      let text = `Continue onto ${street}`;

      if (diff > 45 && diff <= 135) {
        maneuver = 'turn-right';
        icon = 'corner-up-right';
        text = `Turn right onto ${street}`;
      } else if (diff > 135) {
        maneuver = 'sharp-right';
        icon = 'arrow-up-right';
        text = `Turn sharp right onto ${street}`;
      } else if (diff < -45 && diff >= -135) {
        maneuver = 'turn-left';
        icon = 'corner-up-left';
        text = `Turn left onto ${street}`;
      } else if (diff < -135) {
        maneuver = 'sharp-left';
        icon = 'arrow-up-left';
        text = `Turn sharp left onto ${street}`;
      } else if (diff > 20) {
        maneuver = 'slight-right';
        icon = 'arrow-up-right';
        text = `Slight right onto ${street}`;
      } else if (diff < -20) {
        maneuver = 'slight-left';
        icon = 'arrow-up-left';
        text = `Slight left onto ${street}`;
      }

      steps.push({
        type: maneuver,
        icon,
        instruction: text,
        street,
        distance: Math.round(dist),
        coords: coords[i]
      });
    }

    // Final Arrival step
    steps.push({
      type: 'arrive',
      icon: 'map-pin',
      instruction: `Arrive at ${destLandmark ? destLandmark.name : 'destination'}`,
      street: '',
      distance: 0,
      coords: coords[coords.length - 1]
    });

    return steps;
  }

  bearingToDirection(bearing) {
    const directions = ['North', 'Northeast', 'East', 'Southeast', 'South', 'Southwest', 'West', 'Northwest'];
    const idx = Math.round(bearing / 45) % 8;
    return directions[idx];
  }

  // Calculate route between two landmarks or coordinates using real OpenStreetMap roads
  async calculateRoute(originId, destId) {
    const originLandmark = CUSAT_DATA.landmarks.find(l => l.id === originId);
    const destLandmark = CUSAT_DATA.landmarks.find(l => l.id === destId);

    if (!originLandmark || !destLandmark) return null;

    const [startLat, startLng] = originLandmark.coords;
    const [endLat, endLng] = destLandmark.coords;

    const profile = this.navigationMode === 'drive' ? 'driving' : (this.navigationMode === 'cycle' ? 'bike' : 'foot');

    // 1. Try real OpenStreetMap road router (OSRM)
    try {
      const osrmUrl = `https://router.project-osrm.org/route/v1/${profile}/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson&steps=true`;
      const response = await fetch(osrmUrl, { cache: 'force-cache' });
      if (response.ok) {
        const data = await response.json();
        if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
          const routeData = data.routes[0];
          // Convert [lng, lat] to [lat, lng]
          const roadCoordinates = routeData.geometry.coordinates.map(c => [c[1], c[0]]);
          const totalMeters = Math.round(routeData.distance);
          
          const speedFactors = { walk: 1.3, cycle: 3.8, drive: 6.5 };
          const durationSeconds = Math.max(30, Math.round(totalMeters / (speedFactors[this.navigationMode] || 1.3)));
          const durationMinutes = Math.max(1, Math.round(durationSeconds / 60));
          const stepCount = Math.round(totalMeters / 0.75);

          const maneuvers = this.generateManeuversFromOSRM(routeData.legs[0].steps, originLandmark, destLandmark, roadCoordinates);

          this.activeRoute = {
            originId,
            destId,
            originLandmark,
            destLandmark,
            coordinates: roadCoordinates,
            totalMeters,
            durationMinutes,
            durationSeconds,
            stepCount,
            maneuvers
          };

          this.drawRouteOnMap(this.activeRoute);
          return this.activeRoute;
        }
      }
    } catch (err) {
      console.warn('OSRM router fetch skipped, using local campus graph:', err);
    }

    // 2. Fallback to built-in Dijkstra Campus Graph
    const originNodeKey = CUSAT_DATA.landmarkToNode[originId] || 'p_main_gate';
    const destNodeKey = CUSAT_DATA.landmarkToNode[destId] || 'p_library_front';

    const pathResult = this.findShortestPath(originNodeKey, destNodeKey);
    if (!pathResult) return null;

    const maneuvers = this.generateManeuvers(pathResult, originLandmark, destLandmark);
    const speedFactors = { walk: 1.33, cycle: 4.16, drive: 6.94 };
    const currentSpeed = speedFactors[this.navigationMode] || 1.33;
    const durationSeconds = Math.round(pathResult.totalMeters / currentSpeed);
    const durationMinutes = Math.max(1, Math.round(durationSeconds / 60));
    const stepCount = Math.round(pathResult.totalMeters / 0.75);

    this.activeRoute = {
      originId,
      destId,
      originLandmark,
      destLandmark,
      coordinates: pathResult.coordinates,
      totalMeters: Math.round(pathResult.totalMeters),
      durationMinutes,
      durationSeconds,
      stepCount,
      maneuvers
    };

    this.drawRouteOnMap(this.activeRoute);
    return this.activeRoute;
  }

  // Parse OSRM steps into user-friendly Google Maps style maneuvers
  generateManeuversFromOSRM(osrmSteps, originLandmark, destLandmark, roadCoordinates) {
    if (!osrmSteps || osrmSteps.length === 0) {
      return this.generateManeuvers({ coordinates: roadCoordinates, streetSegments: [] }, originLandmark, destLandmark);
    }

    const steps = [];
    osrmSteps.forEach((s, idx) => {
      const type = s.maneuver.type;
      const modifier = s.maneuver.modifier || '';
      const streetName = s.name || (idx === 0 ? 'University Road' : 'Campus Street');
      const dist = Math.round(s.distance);
      const loc = [s.maneuver.location[1], s.maneuver.location[0]];

      let icon = 'arrow-up';
      let instruction = `Continue on ${streetName}`;

      if (type === 'depart') {
        icon = 'arrow-up';
        instruction = `Head ${modifier || 'forward'} on ${streetName}`;
      } else if (type === 'arrive') {
        icon = 'map-pin';
        instruction = `Arrive at ${destLandmark.name}`;
      } else if (type === 'turn') {
        if (modifier.includes('right')) {
          icon = modifier.includes('slight') ? 'arrow-up-right' : 'corner-up-right';
          instruction = `Turn ${modifier} onto ${streetName}`;
        } else if (modifier.includes('left')) {
          icon = modifier.includes('slight') ? 'arrow-up-left' : 'corner-up-left';
          instruction = `Turn ${modifier} onto ${streetName}`;
        } else {
          instruction = `Turn onto ${streetName}`;
        }
      } else if (type === 'fork') {
        icon = modifier.includes('right') ? 'arrow-up-right' : 'arrow-up-left';
        instruction = `Take the ${modifier || ''} fork onto ${streetName}`;
      } else if (type === 'roundabout') {
        icon = 'rotate-cw';
        instruction = `Enter roundabout and take exit onto ${streetName}`;
      }

      steps.push({
        type: type + (modifier ? '-' + modifier : ''),
        icon,
        instruction,
        street: streetName,
        distance: dist,
        coords: loc
      });
    });

    return steps;
  }

  // Draw Route Polyline on Leaflet Map
  drawRouteOnMap(route) {
    this.clearRouteGraphics();

    // Outer glow polyline
    this.routeGlowPolyline = L.polyline(route.coordinates, {
      color: '#10b981',
      weight: 10,
      opacity: 0.35,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(this.map);

    // Inner route polyline with pulse dash animation
    this.routePolyline = L.polyline(route.coordinates, {
      color: '#059669',
      weight: 5,
      opacity: 0.95,
      dashArray: '8, 8',
      className: 'live-route-dash',
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(this.map);

    // Auto-fit bounds
    const bounds = L.latLngBounds(route.coordinates);
    this.map.fitBounds(bounds, {
      padding: [60, 60],
      maxZoom: 18,
      animate: true
    });
  }

  clearRouteGraphics() {
    if (this.routePolyline) {
      this.map.removeLayer(this.routePolyline);
      this.routePolyline = null;
    }
    if (this.routeGlowPolyline) {
      this.map.removeLayer(this.routeGlowPolyline);
      this.routeGlowPolyline = null;
    }
    if (this.walkerMarker) {
      this.map.removeLayer(this.walkerMarker);
      this.walkerMarker = null;
    }
    this.stopSimulation();
  }

  // Set Navigation Travel Mode ('walk', 'cycle', 'drive')
  setNavigationMode(mode) {
    this.navigationMode = mode;
    if (this.activeRoute) {
      this.calculateRoute(this.activeRoute.originId, this.activeRoute.destId);
    }
  }

  // ---------------- Live Navigation & Simulation Mode ----------------

  startSimulation(onProgressUpdate, onFinish) {
    if (!this.activeRoute || this.activeRoute.coordinates.length < 2) return;

    this.isSimulating = true;
    this.isNavigating = true;
    this.simProgress = 0;
    this.lastSpokenStep = -1;

    // Create live avatar marker
    if (this.walkerMarker) this.map.removeLayer(this.walkerMarker);

    const modeIcons = {
      walk: '🚶‍♂️',
      cycle: '🚴‍♂️',
      drive: '🚗'
    };

    const walkerIcon = L.divIcon({
      className: 'live-walker-avatar',
      html: `
        <div class="walker-pulse-ring"></div>
        <div class="walker-avatar-core" id="sim-avatar-core">
          <span>${modeIcons[this.navigationMode] || '🚶‍♂️'}</span>
        </div>
        <div class="walker-heading-cone" id="sim-heading-cone"></div>
      `,
      iconSize: [42, 42],
      iconAnchor: [21, 21]
    });

    const startCoord = this.activeRoute.coordinates[0];
    this.walkerMarker = L.marker(startCoord, { icon: walkerIcon, zIndexOffset: 1000 }).addTo(this.map);

    // Initial voice prompt
    this.speakInstruction(this.activeRoute.maneuvers[0].instruction);

    // Compute total path length and cumulative distance segments
    const coords = this.activeRoute.coordinates;
    const segmentDists = [];
    let totalDist = 0;

    for (let i = 0; i < coords.length - 1; i++) {
      const d = CampusMapEngine.getDistance(coords[i], coords[i + 1]);
      segmentDists.push(d);
      totalDist += d;
    }

    const durationMs = (this.activeRoute.durationSeconds * 1000) / (this.simSpeed * 4.5); // Accelerated for realistic fast preview
    let startTime = null;

    const animate = (timestamp) => {
      if (!this.isSimulating) return;
      if (!startTime) startTime = timestamp;

      const elapsed = timestamp - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      this.simProgress = progress;

      // Find current position along polyline
      const currentDist = progress * totalDist;
      let accum = 0;
      let segIdx = 0;

      for (let i = 0; i < segmentDists.length; i++) {
        if (accum + segmentDists[i] >= currentDist) {
          segIdx = i;
          break;
        }
        accum += segmentDists[i];
      }

      const segDist = segmentDists[segIdx] || 1;
      const segT = Math.max(0, Math.min(1, (currentDist - accum) / segDist));
      const p1 = coords[segIdx];
      const p2 = coords[segIdx + 1] || p1;

      const currentLat = p1[0] + (p2[0] - p1[0]) * segT;
      const currentLng = p1[1] + (p2[1] - p1[1]) * segT;
      const currentPos = [currentLat, currentLng];

      this.walkerMarker.setLatLng(currentPos);

      // Rotate heading cone
      const bearing = CampusMapEngine.getBearing(p1, p2);
      const cone = document.getElementById('sim-heading-cone');
      if (cone) {
        cone.style.transform = `rotate(${bearing}deg)`;
      }

      // Check for maneuver voice announcements
      const currentManeuverIdx = Math.min(
        this.activeRoute.maneuvers.length - 1,
        Math.floor(progress * this.activeRoute.maneuvers.length)
      );

      if (currentManeuverIdx > this.lastSpokenStep) {
        this.lastSpokenStep = currentManeuverIdx;
        const currentManeuver = this.activeRoute.maneuvers[currentManeuverIdx];
        if (currentManeuver) {
          this.speakInstruction(currentManeuver.instruction);
        }
      }

      // Camera auto-follow
      if (progress < 0.98 && (Math.round(elapsed / 100) % 5 === 0)) {
        this.map.panTo(currentPos, { animate: true, duration: 0.3 });
      }

      const remainingMeters = Math.max(0, Math.round(totalDist - currentDist));
      const remainingSecs = Math.max(0, Math.round((this.activeRoute.durationSeconds * (1 - progress))));

      if (onProgressUpdate) {
        onProgressUpdate({
          progress,
          currentPos,
          remainingMeters,
          remainingMinutes: Math.max(1, Math.round(remainingSecs / 60)),
          currentStepIndex: currentManeuverIdx,
          currentStep: this.activeRoute.maneuvers[currentManeuverIdx]
        });
      }

      if (progress < 1) {
        this.simAnimFrame = requestAnimationFrame(animate);
      } else {
        this.isSimulating = false;
        this.speakInstruction(`You have arrived at ${this.activeRoute.destLandmark ? this.activeRoute.destLandmark.name : 'your destination'}`);
        if (onFinish) onFinish();
      }
    };

    this.simAnimFrame = requestAnimationFrame(animate);
  }

  stopSimulation() {
    this.isSimulating = false;
    if (this.simAnimFrame) {
      cancelAnimationFrame(this.simAnimFrame);
      this.simAnimFrame = null;
    }
  }

  // Live Real-World Device GPS Tracking
  startLiveGpsTracking(onPositionUpdate, onError) {
    if (!navigator.geolocation) {
      if (onError) onError('Geolocation is not supported by your browser.');
      return;
    }

    this.watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const accuracy = pos.coords.accuracy;
        const currentPos = [lat, lng];

        if (!this.userLocationMarker) {
          const userIcon = L.divIcon({
            className: 'live-gps-user-marker',
            html: `<div class="gps-pulse"></div><div class="gps-dot"></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          });
          this.userLocationMarker = L.marker(currentPos, { icon: userIcon }).addTo(this.map);
          this.userAccuracyCircle = L.circle(currentPos, {
            radius: accuracy,
            color: '#3b82f6',
            fillColor: '#60a5fa',
            fillOpacity: 0.15,
            weight: 1
          }).addTo(this.map);
        } else {
          this.userLocationMarker.setLatLng(currentPos);
          this.userAccuracyCircle.setLatLng(currentPos);
          this.userAccuracyCircle.setRadius(accuracy);
        }

        if (onPositionUpdate) onPositionUpdate(currentPos, accuracy);
      },
      (err) => {
        if (onError) onError(err.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000
      }
    );
  }

  stopLiveGpsTracking() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  // Voice speech synthesis output
  speakInstruction(text) {
    if (!this.voiceEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel(); // Stop ongoing speech

    const cleanText = text.replace(/[*_#`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.lang = 'en-IN'; // Indian English voice preferred for CUSAT
    window.speechSynthesis.speak(utterance);
  }

  toggleVoice(enable = null) {
    this.voiceEnabled = enable !== null ? enable : !this.voiceEnabled;
    return this.voiceEnabled;
  }
}

// Export to window
if (typeof window !== 'undefined') {
  window.CampusMapEngine = CampusMapEngine;
}
