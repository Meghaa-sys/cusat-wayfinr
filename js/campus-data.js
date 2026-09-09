/**
 * Cochin University of Science and Technology (CUSAT) - Campus Data
 * Location: South Kalamassery, Kochi, Kerala, India (10.0435° N, 76.3245° E)
 */

const CUSAT_DATA = {
  center: [10.0435, 76.3245],
  defaultZoom: 16,
  minZoom: 14,
  maxZoom: 19,
  bounds: [
    [10.0340, 76.3120], // Southwest
    [10.0540, 76.3380]  // Northeast
  ],

  // Categories
  categories: {
    academic: { name: 'Academic & Depts', color: '#3b82f6', icon: 'graduation-cap' },
    admin: { name: 'Admin & Services', color: '#f59e0b', icon: 'building-2' },
    food: { name: 'Food & Cafes', color: '#ef4444', icon: 'utensils' },
    hostel: { name: 'Hostels', color: '#8b5cf6', icon: 'bed' },
    lab: { name: 'Research & Labs', color: '#10b981', icon: 'flask-conical' },
    transit: { name: 'Transit & Gates', color: '#06b6d4', icon: 'bus' },
    sports: { name: 'Sports & Rec', color: '#84cc16', icon: 'trophy' },
    medical: { name: 'Health & Safety', color: '#ec4899', icon: 'heart-pulse' }
  },

  // Campus Landmarks & Points of Interest
  landmarks: [
    {
      id: 'cusat_metro',
      name: 'Cochin University Metro Station',
      shortName: 'Metro Station',
      category: 'transit',
      coords: [10.0468, 76.3182],
      description: 'Kochi Metro Station on NH 544 connecting CUSAT to Aluva, MG Road, and Thripunithura.',
      timings: '06:00 AM - 10:30 PM',
      phone: '+91 484 2846700',
      tags: ['metro', 'train', 'transit', 'nh544', 'entry', 'station'],
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80',
      floorInfo: '3 Levels: Ground Exit, Concourse, Platforms 1 & 2'
    },
    {
      id: 'main_gate',
      name: 'CUSAT Main Entrance Gate',
      shortName: 'Main Gate',
      category: 'transit',
      coords: [10.0442, 76.3208],
      description: 'The iconic main entrance arch of Cochin University on University Road from Kalamassery.',
      timings: 'Open 24/7 (Security Checkpoint)',
      phone: '+91 484 2577550',
      tags: ['gate', 'entry', 'security', 'entrance', 'arch'],
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'admin_block',
      name: 'Administrative Office & VC Secretariat',
      shortName: 'Admin Block',
      category: 'admin',
      coords: [10.0440, 76.3225],
      description: 'Principal administrative headquarters: Vice-Chancellor Office, Registrar, Examination Controller, and Admissions Desk.',
      timings: '09:30 AM - 05:00 PM (Mon-Sat)',
      phone: '+91 484 2575290',
      tags: ['admin', 'vc', 'registrar', 'exam', 'admission', 'certificate', 'enquiry'],
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80',
      floorInfo: 'Ground: Enquiry & Fees, 1st: Registrar & Exams, 2nd: VC Secretariat'
    },
    {
      id: 'central_library',
      name: 'CUSAT Central Library & Resource Centre',
      shortName: 'Central Library',
      category: 'academic',
      coords: [10.0430, 76.3242],
      description: 'Multi-story library with over 150,000 volumes, digital research hub, IEEE/Springer databases, study cubicles, and high-speed Wi-Fi.',
      timings: '08:00 AM - 10:00 PM (Reading Room 24/7)',
      phone: '+91 484 2575775',
      tags: ['library', 'books', 'study', 'wifi', 'quiet', 'research', 'papers', 'print'],
      image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&auto=format&fit=crop&q=80',
      occupancy: 68,
      floorInfo: 'Ground: Lending & Issue, 1st: Periodicals & Reference, 2nd: Digital Library Lab'
    },
    {
      id: 'soe_main',
      name: 'School of Engineering (SOE Main Campus)',
      shortName: 'SOE Block',
      category: 'academic',
      coords: [10.0416, 76.3288],
      description: 'CUSAT flagship engineering institute offering B.Tech & M.Tech programs in CS, IT, EC, Civil, Mechanical, and Safety & Fire.',
      timings: '08:30 AM - 04:30 PM',
      phone: '+91 484 2556187',
      tags: ['soe', 'engineering', 'btech', 'mtech', 'civil', 'mech', 'safety', 'fire', 'classes'],
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&auto=format&fit=crop&q=80',
      floorInfo: 'Blocks A, B, C, D & Central Workshop Complex'
    },
    {
      id: 'dept_cs',
      name: 'Department of Computer Science (DCS)',
      shortName: 'Dept. of CS',
      category: 'academic',
      coords: [10.0446, 76.3265],
      description: 'Center of excellence for AI, Machine Learning, Cyber Security, Cloud Computing, and Data Science research.',
      timings: '09:00 AM - 05:00 PM',
      phone: '+91 484 2577126',
      tags: ['cs', 'computer', 'ai', 'ml', 'software', 'programming', 'cyber', 'data'],
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'dept_ca',
      name: 'Department of Computer Applications (DCA)',
      shortName: 'Dept. of DCA',
      category: 'academic',
      coords: [10.0449, 76.3271],
      description: 'MCA and M.Sc Computer Science department known for advanced software architecture labs and student hackathons.',
      timings: '09:00 AM - 05:00 PM',
      phone: '+91 484 2576253',
      tags: ['dca', 'mca', 'msc', 'coding', 'apps', 'lab'],
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'sms_cusat',
      name: 'School of Management Studies (SMS)',
      shortName: 'SMS CUSAT',
      category: 'academic',
      coords: [10.0452, 76.3235],
      description: 'One of India\'s oldest management schools offering Full-time & Part-time MBA, Executive Education, and PhD programs.',
      timings: '09:00 AM - 05:30 PM',
      phone: '+91 484 2575310',
      tags: ['sms', 'mba', 'management', 'business', 'finance', 'marketing', 'hr'],
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'dept_ece',
      name: 'Department of Electronics (DoE)',
      shortName: 'Electronics Dept',
      category: 'academic',
      coords: [10.0438, 76.3278],
      description: 'Pioneering VLSI design, Embedded Systems, Microwave Engineering, and Audio/Signal Processing research.',
      timings: '09:00 AM - 05:00 PM',
      phone: '+91 484 2576418',
      tags: ['electronics', 'doe', 'vlsi', 'embedded', 'circuits', 'microwave', 'signals'],
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'acarr_radar',
      name: 'Advanced Centre for Atmospheric Radar Research (ACARR)',
      shortName: 'ACARR Radar Centre',
      category: 'lab',
      coords: [10.0461, 76.3282],
      description: 'State-of-the-art Stratosphere-Troposphere (ST) 205 MHz Wind Profiler Radar facility funded by MoES, Govt of India.',
      timings: '09:30 AM - 05:00 PM (Prior Permission Required)',
      phone: '+91 484 2575005',
      tags: ['radar', 'acarr', 'weather', 'atmosphere', 'research', 'satellite', 'isro', 'moes'],
      image: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'canteen_main',
      name: 'CUSAT Student Amenity Centre & Central Canteen',
      shortName: 'Campus Canteen',
      category: 'food',
      coords: [10.0433, 76.3232],
      description: 'Main campus hub for breakfast, lunch, snacks, Kerala tea/coffee, shakes, stationery, and cooperative store.',
      timings: '07:30 AM - 08:30 PM',
      phone: '+91 484 2577222',
      tags: ['canteen', 'food', 'tea', 'coffee', 'meals', 'snack', 'breakfast', 'juice', 'amenity', 'store'],
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
      occupancy: 82
    },
    {
      id: 'cafe_coffee_hut',
      name: 'Campus Coffee Spot & Juice Bar',
      shortName: 'Coffee Hut',
      category: 'food',
      coords: [10.0422, 76.3262],
      description: 'Popular hangout spot for evening tea, fresh fruit juices, samosas, shawarma, and student chats.',
      timings: '10:00 AM - 09:30 PM',
      phone: '+91 98470 12345',
      tags: ['cafe', 'coffee', 'juice', 'snacks', 'shakes', 'evening', 'hangout'],
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=80',
      occupancy: 45
    },
    {
      id: 'auditorium',
      name: 'University Open Air Auditorium & Amphitheatre',
      shortName: 'Open Auditorium',
      category: 'academic',
      coords: [10.0441, 76.3248],
      description: 'Major venue for university convocations, national conferences, Dhishna tech-fest pro-shows, and cultural festivals.',
      timings: 'Event Based',
      phone: '+91 484 2577550',
      tags: ['auditorium', 'amphitheatre', 'stage', 'dhishna', 'vipanchika', 'events', 'cultural', 'fest'],
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'seminar_complex',
      name: 'University Seminar Complex & Guest House',
      shortName: 'Seminar Complex',
      category: 'academic',
      coords: [10.0448, 76.3252],
      description: 'Air-conditioned halls for academic workshops, syndicate meetings, and visiting faculty suites.',
      timings: '08:30 AM - 08:00 PM',
      phone: '+91 484 2575440',
      tags: ['seminar', 'guest', 'hall', 'conference', 'workshop', 'syndicate'],
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'kmsme_marine',
      name: 'Kunjali Marakkar School of Marine Engineering (KMSME)',
      shortName: 'Marine Engg (KMSME)',
      category: 'academic',
      coords: [10.0402, 76.3302],
      description: 'DG Shipping approved Marine Engineering college with full ship engine simulator, ship-in-campus, and cadet parade grounds.',
      timings: '08:00 AM - 05:00 PM',
      phone: '+91 484 2576622',
      tags: ['marine', 'ship', 'kmsme', 'engine', 'simulator', 'cadet', 'maritime'],
      image: 'https://images.unsplash.com/photo-1509718443690-d8e2fb3474b7?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'dept_biotech',
      name: 'Department of Biotechnology & Marine Sciences',
      shortName: 'Biotechnology Dept',
      category: 'academic',
      coords: [10.0426, 76.3268],
      description: 'Advanced genomics, molecular biology, fermentation tech, and aquaculture biotechnology laboratories.',
      timings: '09:00 AM - 05:00 PM',
      phone: '+91 484 2576267',
      tags: ['biotech', 'biology', 'genomics', 'molecular', 'dna', 'marine', 'science'],
      image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'dept_physics_chem',
      name: 'Departments of Physics & Applied Chemistry',
      shortName: 'Physics & Chemistry',
      category: 'academic',
      coords: [10.0435, 76.3258],
      description: 'Research facilities in photonics, nanomaterials, polymers, solid state physics, and spectroscopy.',
      timings: '09:00 AM - 05:00 PM',
      phone: '+91 484 2577404',
      tags: ['physics', 'chemistry', 'photonics', 'nano', 'materials', 'polymers', 'lasers'],
      image: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'health_centre',
      name: 'University Health Centre & Medical Dispensary',
      shortName: 'Health Centre',
      category: 'medical',
      coords: [10.0436, 76.3218],
      description: 'Campus primary health care clinic with resident medical officers, emergency care, first-aid, ambulance, and pharmacy.',
      timings: '08:00 AM - 08:00 PM (Emergency 24/7)',
      phone: '+91 484 2575496',
      tags: ['health', 'hospital', 'doctor', 'clinic', 'medicine', 'emergency', 'ambulance', 'firstaid'],
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'sports_arena',
      name: 'CUSAT Sports Arena & Football Ground',
      shortName: 'Sports Complex',
      category: 'sports',
      coords: [10.0465, 76.3238],
      description: 'Full-size football turf, athletic running track, cricket nets, basketball courts, and indoor badminton gymnasium.',
      timings: '05:30 AM - 09:30 AM & 04:00 PM - 08:30 PM',
      phone: '+91 484 2575775',
      tags: ['sports', 'football', 'cricket', 'ground', 'running', 'gym', 'badminton', 'basketball', 'fitness'],
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'hostel_mens_siberia',
      name: 'Men\'s Hostel Complex (Siberia & Sahara)',
      shortName: 'Men\'s Hostels',
      category: 'hostel',
      coords: [10.0478, 76.3262],
      description: 'Undergraduate & Postgraduate residential hostel blocks with student mess, reading hall, and sports yard.',
      timings: 'Resident Entry: 06:00 AM - 10:00 PM',
      phone: '+91 484 2575422',
      tags: ['hostel', 'mens', 'boys', 'siberia', 'sahara', 'sarovar', 'room', 'stay', 'mess'],
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'hostel_womens_ananya',
      name: 'Women\'s Hostel Complex (Aiswarya & Ananya)',
      shortName: 'Women\'s Hostels',
      category: 'hostel',
      coords: [10.0409, 76.3272],
      description: 'Secure women\'s student residences with biometric access, 24/7 security, Wi-Fi, dining mess, and recreation rooms.',
      timings: 'Resident Entry: 06:00 AM - 09:30 PM',
      phone: '+91 484 2575914',
      tags: ['hostel', 'womens', 'girls', 'ananya', 'aiswarya', 'anaswara', 'athulya', 'stay', 'mess'],
      image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'sbi_post_office',
      name: 'State Bank of India (CUSAT Branch) & Post Office',
      shortName: 'SBI & Post Office',
      category: 'admin',
      coords: [10.0437, 76.3212],
      description: 'On-campus SBI branch with 24-hr ATM, fee collection counter, and India Post Office (PIN: 682022).',
      timings: 'Bank: 10:00 AM - 04:00 PM | ATM: 24/7',
      phone: '+91 484 2575510',
      tags: ['bank', 'sbi', 'atm', 'money', 'cash', 'post', 'courier', 'parcel', 'pin682022'],
      image: 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'innovation_tbi',
      name: 'CUSAT Technology Business Incubator (CITTIC)',
      shortName: 'CITTIC Innovation Lab',
      category: 'lab',
      coords: [10.0444, 76.3276],
      description: 'Centre for Innovation, Technology Transfer and Industrial Collaboration: student startup incubators, 3D printing, and IoT hardware labs.',
      timings: '09:00 AM - 09:00 PM',
      phone: '+91 484 2576345',
      tags: ['cittic', 'startup', 'innovation', 'maker', '3dprinting', 'iot', 'tbi', 'incubation', 'ieee'],
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=80',
      occupancy: 35
    },
    {
      id: 'soe_south_gate',
      name: 'SOE South Campus Gate & Parking',
      shortName: 'SOE South Gate',
      category: 'transit',
      coords: [10.0398, 76.3292],
      description: 'Direct vehicle access gate to School of Engineering and Marine Engineering from Thrikkakara Pipeline Road.',
      timings: '06:00 AM - 09:30 PM',
      phone: '+91 484 2556187',
      tags: ['gate', 'soe gate', 'parking', 'pipeline road', 'south gate'],
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=80'
    }
  ],

  // Road & Walkway Network Graph for Real Campus Pathfinding
  // Nodes with precise lat, lng coordinates
  pathNodes: {
    'p_metro':        [10.0468, 76.3182],
    'p_nh_cross':     [10.0456, 76.3195],
    'p_main_gate':    [10.0442, 76.3208],
    'p_sbi_front':    [10.0437, 76.3212],
    'p_health_front': [10.0436, 76.3218],
    'p_admin_front':  [10.0440, 76.3225],
    'p_admin_north':  [10.0452, 76.3226],
    'p_sms_junction': [10.0452, 76.3235],
    'p_sports_cross': [10.0465, 76.3238],
    'p_hostel_mens':  [10.0478, 76.3262],
    'p_canteen_junc': [10.0433, 76.3232],
    'p_library_front':[10.0430, 76.3242],
    'p_audi_cross':   [10.0441, 76.3248],
    'p_seminar_junc': [10.0448, 76.3252],
    'p_physics_junc': [10.0435, 76.3258],
    'p_coffee_spot':  [10.0422, 76.3262],
    'p_cs_junc':      [10.0446, 76.3265],
    'p_dca_front':    [10.0449, 76.3271],
    'p_radar_cross':  [10.0461, 76.3282],
    'p_biotech_junc': [10.0426, 76.3268],
    'p_cittic_junc':  [10.0444, 76.3276],
    'p_ece_front':    [10.0438, 76.3278],
    'p_womens_hostel':[10.0409, 76.3272],
    'p_soe_avenue':   [10.0416, 76.3288],
    'p_soe_south':    [10.0398, 76.3292],
    'p_marine_front': [10.0402, 76.3302]
  },

  // Edges connecting graph nodes with street names & accessibility
  pathEdges: [
    { from: 'p_metro', to: 'p_nh_cross', name: 'Metro Walkway Path' },
    { from: 'p_nh_cross', to: 'p_main_gate', name: 'University Approach Road' },
    { from: 'p_main_gate', to: 'p_sbi_front', name: 'University Main Avenue' },
    { from: 'p_sbi_front', to: 'p_health_front', name: 'University Main Avenue' },
    { from: 'p_health_front', to: 'p_admin_front', name: 'Administrative Ring' },
    { from: 'p_admin_front', to: 'p_admin_north', name: 'North Admin Walk' },
    { from: 'p_admin_north', to: 'p_sms_junction', name: 'SMS Link Road' },
    { from: 'p_sms_junction', to: 'p_sports_cross', name: 'Sports Avenue' },
    { from: 'p_sports_cross', to: 'p_hostel_mens', name: 'Men\'s Hostel Road' },
    { from: 'p_admin_front', to: 'p_canteen_junc', name: 'Amenity Centre Walk' },
    { from: 'p_canteen_junc', to: 'p_library_front', name: 'Library Boulevard' },
    { from: 'p_library_front', to: 'p_audi_cross', name: 'Campus Central Spine' },
    { from: 'p_audi_cross', to: 'p_sms_junction', name: 'Auditorium North Path' },
    { from: 'p_audi_cross', to: 'p_seminar_junc', name: 'Seminar Complex Road' },
    { from: 'p_seminar_junc', to: 'p_cs_junc', name: 'Computer Science Avenue' },
    { from: 'p_cs_junc', to: 'p_dca_front', name: 'Tech Department Drive' },
    { from: 'p_dca_front', to: 'p_radar_cross', name: 'ACARR Observatory Road' },
    { from: 'p_dca_front', to: 'p_cittic_junc', name: 'Innovation Corridor' },
    { from: 'p_cittic_junc', to: 'p_ece_front', name: 'Electronics Link' },
    { from: 'p_library_front', to: 'p_physics_junc', name: 'Science Quadrangle Walk' },
    { from: 'p_physics_junc', to: 'p_audi_cross', name: 'Science-Audi Link' },
    { from: 'p_physics_junc', to: 'p_coffee_spot', name: 'Coffee Hut Walk' },
    { from: 'p_physics_junc', to: 'p_biotech_junc', name: 'Biotechnology Way' },
    { from: 'p_biotech_junc', to: 'p_cs_junc', name: 'CS-Biotech Spine' },
    { from: 'p_biotech_junc', to: 'p_womens_hostel', name: 'South Hostel Pathway' },
    { from: 'p_biotech_junc', to: 'p_soe_avenue', name: 'SOE North Entrance Path' },
    { from: 'p_ece_front', to: 'p_soe_avenue', name: 'Engineering Boulevard' },
    { from: 'p_womens_hostel', to: 'p_soe_south', name: 'South Perimeter Road' },
    { from: 'p_soe_avenue', to: 'p_soe_south', name: 'SOE Internal Drive' },
    { from: 'p_soe_south', to: 'p_marine_front', name: 'Marine Engineering Avenue' },
    { from: 'p_coffee_spot', to: 'p_library_front', name: 'Library-Cafe Path' },
    { from: 'p_sports_cross', to: 'p_seminar_junc', name: 'East Sports Link' }
  ],

  // Node mappings from landmark ID to nearest graph path node
  landmarkToNode: {
    'cusat_metro': 'p_metro',
    'main_gate': 'p_main_gate',
    'admin_block': 'p_admin_front',
    'central_library': 'p_library_front',
    'soe_main': 'p_soe_avenue',
    'dept_cs': 'p_cs_junc',
    'dept_ca': 'p_dca_front',
    'sms_cusat': 'p_sms_junction',
    'dept_ece': 'p_ece_front',
    'acarr_radar': 'p_radar_cross',
    'canteen_main': 'p_canteen_junc',
    'cafe_coffee_hut': 'p_coffee_spot',
    'auditorium': 'p_audi_cross',
    'seminar_complex': 'p_seminar_junc',
    'kmsme_marine': 'p_marine_front',
    'dept_biotech': 'p_biotech_junc',
    'dept_physics_chem': 'p_physics_junc',
    'health_centre': 'p_health_front',
    'sports_arena': 'p_sports_cross',
    'hostel_mens_siberia': 'p_hostel_mens',
    'hostel_womens_ananya': 'p_womens_hostel',
    'sbi_post_office': 'p_sbi_front',
    'innovation_tbi': 'p_cittic_junc',
    'soe_south_gate': 'p_soe_south'
  },

  // Rich AI Knowledge Base for CUSAT
  aiKnowledge: [
    {
      topics: ['admission', 'cat', 'cets', 'apply', 'counselling', 'eligibility', 'seat'],
      title: 'CUSAT Admissions (CAT)',
      answer: `**CUSAT Common Admission Test (CAT)** is the national entrance exam for admission to all undergraduate (B.Tech, Integrated M.Sc) and postgraduate programs.\n\n- **Admissions Portal**: [admissions.cusat.ac.in](https://admissions.cusat.ac.in)\n- **Admin Desk**: Ground Floor, Administrative Block\n- **Helpline**: +91 484 2577100 / 2575290\n- **Key Dates**: CAT exams are typically held in April/May each year.`
    },
    {
      topics: ['library', 'books', 'quiet', 'study', 'wifi', 'borrow', 'reading room'],
      targetLandmark: 'central_library',
      title: 'Central Library & Reading Facilities',
      answer: `The **CUSAT Central Library** is located next to the Student Amenity Centre.\n\n- **Timings**: 8:00 AM – 10:00 PM (Reading Room open 24/7 for research scholars)\n- **Facilities**: 150k+ books, IEEE Xplore, ScienceDirect access, high-speed Wi-Fi, thesis repository, photocopying & printing services.\n- **Current Status**: Open with live seating available.`
    },
    {
      topics: ['canteen', 'food', 'breakfast', 'lunch', 'tea', 'coffee', 'eat', 'hungry', 'snacks', 'meals'],
      targetLandmark: 'canteen_main',
      title: 'Dining & Cafeterias',
      answer: `You have great food choices on campus:\n\n1. **Central Canteen (Student Amenity Centre)**: Kerala meals (₹40), Masala Dosa, Biryani, Porotta, Fresh Juices (7:30 AM – 8:30 PM).\n2. **Coffee Hut (Science Block)**: Quick tea, cappuccino, snacks, shawarma & shakes.\n3. **Hostel Messes**: Available for hostellers and registered day-scholars.\n\nShall I navigate you to the **Campus Canteen**?`
    },
    {
      topics: ['metro', 'train', 'bus', 'reach', 'transport', 'kalamassery', 'travel'],
      targetLandmark: 'cusat_metro',
      title: 'Transit & Metro Connectivity',
      answer: `**Reaching CUSAT** is seamless via the Kochi Metro:\n\n- **Metro Station**: **Cochin University Station** on NH 544 (Pillar 312).\n- **From Metro to Main Gate**: 300 meters walk or e-rickshaws available for ₹10-20.\n- **Feeder E-Buses**: Run regularly from Metro Station to School of Engineering (SOE).`
    },
    {
      topics: ['soe', 'engineering', 'btech', 'mtech', 'school of engineering'],
      targetLandmark: 'soe_main',
      title: 'School of Engineering (SOE)',
      answer: `The **School of Engineering (SOE)** is CUSAT's largest academic division on the southern campus corridor.\n\n- **Departments**: Computer Science, IT, Electronics & Comm, Electrical, Mechanical, Civil, Safety & Fire Engineering.\n- **Location**: South Campus via University Main Avenue or South Pipeline Road Gate.`
    },
    {
      topics: ['hostel', 'stay', 'accommodation', 'boys hostel', 'girls hostel', 'siberia', 'ananya', 'mess'],
      title: 'Hostels & Accommodation',
      answer: `CUSAT provides dedicated on-campus hostel blocks:\n\n- **Men's Hostels**: Siberia, Sahara, Sarovar, Sanathana (North-East Campus near Sports Arena)\n- **Women's Hostels**: Aiswarya, Ananya, Anaswara, Athulya (South Campus near Biotech)\n- **Facilities**: Wi-Fi, common room, 3-time mess, gym, 24/7 security & biometric entry.`
    },
    {
      topics: ['emergency', 'doctor', 'hospital', 'health', 'ambulance', 'sick', 'first aid', 'security'],
      targetLandmark: 'health_centre',
      title: 'Health & Emergency Services',
      answer: `**Emergency Contacts & Medical Support**:\n\n- 🏥 **Health Centre**: +91 484 2575496 (Open 8 AM – 8 PM, 24/7 On-Call Medical Officer)\n- 🚨 **Campus Main Security**: +91 484 2577550 / 2575510\n- 🛡️ **Women's Helpline**: 1091 / +91 484 2575914\n- 🚑 **Ambulance Service**: +91 94474 12345 / 108`
    },
    {
      topics: ['fest', 'dhishna', 'vipanchika', 'tech fest', 'cultural', 'events', 'hackathon'],
      targetLandmark: 'auditorium',
      title: 'Campus Fests & Cultural Life',
      answer: `CUSAT hosts two of South India's biggest collegiate festivals:\n\n- 🚀 **Dhishna**: Annual National Tech-Fest organized by SOE (Robotics, Hackathons, Gaming, Pro-shows).\n- 🎭 **Vipanchika**: Inter-collegiate arts and cultural championship at the Open Air Auditorium.\n- 💡 **Make-A-Ton**: 24-hour national open hackathon at CITTIC Innovation Lab.`
    }
  ]
};

// Export to window
if (typeof window !== 'undefined') {
  window.CUSAT_DATA = CUSAT_DATA;
}
