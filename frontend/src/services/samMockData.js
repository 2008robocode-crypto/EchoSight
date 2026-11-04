// SAM 3.1 & Meta Multimodal Reasoning Mock / Calibration Scenarios

export const SCENARIOS = [
  {
    id: 'outdoor-street',
    title: 'Outdoor Sidewalk & Crosswalk',
    category: 'Urban Navigation',
    description: 'Dynamic pedestrian crossway with approaching obstacles, curbs, and construction barriers.',
    bgType: 'street',
    audioCue: 'Approaching sidewalk curb at 12 o\'clock, 1.8 meters. Pedestrian approaching at 11 o\'clock.',
    objects: [
      {
        id: 'curb-1',
        label: 'Curb Drop-off',
        category: 'Elevation Hazard',
        priority: 'hazard',
        confidence: 0.98,
        distanceMeters: 1.8,
        clockDirection: '12 o\'clock',
        azimuthDegrees: 2,
        elevation: 'Ground',
        box: { x: 25, y: 70, w: 50, h: 22 }, // percentages
        polygon: [[25, 70], [75, 70], [82, 92], [18, 92]],
        museReasoning: 'Critical sudden level change of 15cm detected directly in walking path. Immediate tactile cane or foot extension advised.'
      },
      {
        id: 'pedestrian-1',
        label: 'Approaching Pedestrian',
        category: 'Dynamic Obstacle',
        priority: 'caution',
        confidence: 0.94,
        distanceMeters: 3.5,
        clockDirection: '11 o\'clock',
        azimuthDegrees: -25,
        elevation: 'Eye-level',
        box: { x: 28, y: 25, w: 18, h: 48 },
        polygon: [[34, 25], [42, 28], [44, 45], [42, 73], [30, 73], [28, 45]],
        museReasoning: 'Moving human walking at ~1.2 m/s toward your left flank. Path intersects in ~3.1s if unadjusted.'
      },
      {
        id: 'crosswalk-1',
        label: 'Tactile Crosswalk Pavement',
        category: 'Safe Navigation Route',
        priority: 'info',
        confidence: 0.96,
        distanceMeters: 4.2,
        clockDirection: '12 o\'clock',
        azimuthDegrees: 0,
        elevation: 'Ground',
        box: { x: 30, y: 55, w: 40, h: 20 },
        polygon: [[30, 65], [70, 65], [78, 75], [22, 75]],
        museReasoning: 'Recognized regulated pedestrian crossing with truncated dome tactile paving blocks. Safe heading confirmed.'
      },
      {
        id: 'cone-1',
        label: 'Construction Cone',
        category: 'Stationary Obstacle',
        priority: 'caution',
        confidence: 0.92,
        distanceMeters: 2.4,
        clockDirection: '1 o\'clock',
        azimuthDegrees: 35,
        elevation: 'Knee-level',
        box: { x: 74, y: 56, w: 14, h: 26 },
        polygon: [[80, 56], [87, 82], [73, 82]],
        museReasoning: 'Bright orange utility cone indicating maintenance or open sidewalk defect to your right.'
      }
    ]
  },
  {
    id: 'indoor-stairs',
    title: 'Transit Station & Downward Stairs',
    category: 'Indoor Mobility',
    description: 'High-risk staircase descent, stainless handrail affordance, and station exitway.',
    bgType: 'station',
    audioCue: 'Warning: Downward flight of stairs in 1.4 meters directly ahead. Handrail detected at 2 o\'clock.',
    objects: [
      {
        id: 'stairs-down',
        label: 'Downward Flight of Stairs',
        category: 'High Fall Hazard',
        priority: 'hazard',
        confidence: 0.99,
        distanceMeters: 1.4,
        clockDirection: '12 o\'clock',
        azimuthDegrees: 0,
        elevation: 'Ground / Drop',
        box: { x: 22, y: 58, w: 56, h: 36 },
        polygon: [[22, 58], [78, 58], [88, 94], [12, 94]],
        museReasoning: 'Multi-step flight descending 14 treads. Zero-shot depth map confirms negative incline. Halt step forward.'
      },
      {
        id: 'handrail-1',
        label: 'Stainless Steel Handrail',
        category: 'Tactile Assistive Affordance',
        priority: 'info',
        confidence: 0.95,
        distanceMeters: 0.9,
        clockDirection: '2 o\'clock',
        azimuthDegrees: 45,
        elevation: 'Waist-level',
        box: { x: 72, y: 44, w: 22, h: 42 },
        polygon: [[74, 44], [94, 60], [92, 86], [72, 70]],
        museReasoning: 'Continuous continuous ADA-compliant support rail located 90cm to your right side at elbow height.'
      },
      {
        id: 'exit-door',
        label: 'Automated Glass Exit Door',
        category: 'Wayfinding Landmark',
        priority: 'info',
        confidence: 0.93,
        distanceMeters: 5.8,
        clockDirection: '12 o\'clock',
        azimuthDegrees: -5,
        elevation: 'Full Height',
        box: { x: 40, y: 22, w: 26, h: 44 },
        polygon: [[40, 22], [66, 22], [66, 66], [40, 66]],
        museReasoning: 'Station exterior portal with motion sensor beam. Illuminated green exit signage visible above frame.'
      }
    ]
  },
  {
    id: 'item-locator',
    title: 'Desk & Personal Item Retrieval',
    category: 'Everyday Independence',
    description: 'Object isolation for daily essentials (keys, prescription bottle, glasses, hot beverage).',
    bgType: 'table',
    audioCue: 'Prescription bottle found at 11 o\'clock, 45 centimeters. House keys at 1 o\'clock, 60 centimeters.',
    objects: [
      {
        id: 'prescription-bottle',
        label: 'Prescription Medication',
        category: 'Target Object',
        priority: 'target',
        confidence: 0.97,
        distanceMeters: 0.45,
        clockDirection: '11 o\'clock',
        azimuthDegrees: -30,
        elevation: 'Tabletop',
        box: { x: 26, y: 42, w: 14, h: 24 },
        polygon: [[28, 42], [38, 42], [39, 66], [27, 66]],
        museReasoning: 'Amber cylindrical container with white child-proof cap. OCR label reads: "Atorvastatin 20mg - Take 1 daily at bedtime".'
      },
      {
        id: 'house-keys',
        label: 'Keyring with Brass Keys',
        category: 'Target Object',
        priority: 'target',
        confidence: 0.95,
        distanceMeters: 0.6,
        clockDirection: '1 o\'clock',
        azimuthDegrees: 30,
        elevation: 'Tabletop',
        box: { x: 62, y: 52, w: 18, h: 18 },
        polygon: [[64, 52], [78, 55], [76, 70], [62, 65]],
        museReasoning: 'Metallic fob with 3 physical keys and blue silicone tag. Positioned right of notebook.'
      },
      {
        id: 'hot-coffee',
        label: 'Hot Ceramic Coffee Mug',
        category: 'Thermal Hazard',
        priority: 'hazard',
        confidence: 0.96,
        distanceMeters: 0.55,
        clockDirection: '2 o\'clock',
        azimuthDegrees: 48,
        elevation: 'Tabletop',
        box: { x: 74, y: 38, w: 16, h: 22 },
        polygon: [[76, 38], [88, 38], [87, 60], [75, 60]],
        museReasoning: 'Open ceramic vessel containing hot liquid with rising vapor. Keep hands clear to avoid tipping.'
      },
      {
        id: 'smartphone',
        label: 'Smartphone (Screen Face Down)',
        category: 'Target Object',
        priority: 'target',
        confidence: 0.99,
        distanceMeters: 0.35,
        clockDirection: '12 o\'clock',
        azimuthDegrees: 0,
        elevation: 'Tabletop',
        box: { x: 44, y: 55, w: 15, h: 25 },
        polygon: [[44, 55], [59, 55], [59, 80], [44, 80]],
        museReasoning: 'Mobile handset placed directly in front of your chest within immediate reach.'
      }
    ]
  }
];

export const META_MODEL_SPECS = {
  visionModel: 'SAM 3.1 (Segment Anything Model 3.1)',
  reasoningModel: 'Meta Muse Spark / Llama 3.2 Vision Multi-Modal',
  codingAgent: 'Muse Code Agent',
  partnerInference: 'Modal Serverless GPU (A10G) + Baseten / Fireworks API',
  latencyAverageMs: 142,
  segmentationFPS: 28.4
};
