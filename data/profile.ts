import {
  SkillCategory,
  FeaturedProject,
  TimelineItem,
  HardwareProject,
  SoftwareProject,
  Achievement,
} from "@/types";

export const profile = {
  name: "Rahul G",
  title: "Engineer | Embedded Systems | AI | IoT Innovator",
  tagline: "Building the intersection of hardware and intelligence.",
  about: `Mechanical Engineering student with a deep passion for embedded systems, aerodynamics, artificial intelligence, and the Internet of Things. I thrive at the intersection of hardware and software—designing systems that sense, process, and respond to the real world.

From acoustic rail monitoring using AI to autonomous drone systems and smart IoT dashboards, I build solutions that bridge the physical and digital. My engineering philosophy: real-world impact through elegant, efficient systems.`,
  location: "India",
  github: "https://github.com/rahul2005-tro",
  linkedin: "https://www.linkedin.com/in/rahul-g-840425239/",
  email: "rahul@example.com",
  stats: [
    { label: "Projects", value: "15+" },
    { label: "Technologies", value: "25+" },
    { label: "Domains", value: "5" },
    { label: "Achievements", value: "7+" },
  ],
};

export const skillCategories: SkillCategory[] = [
  {
    name: "Programming",
    color: "#00ff41",
    glowColor: "rgba(0, 255, 65, 0.4)",
    icon: "{ }",
    skills: [
      { name: "Python" },
      { name: "C++" },
      { name: "Embedded C" },
      { name: "Java" },
      { name: "SQL" },
      { name: "JavaScript" },
    ],
  },
  {
    name: "Embedded Hardware",
    color: "#ff9500",
    glowColor: "rgba(255, 149, 0, 0.4)",
    icon: "⚡",
    skills: [
      { name: "ESP32" },
      { name: "Arduino" },
      { name: "Raspberry Pi" },
      { name: "STM32" },
      { name: "LoRa SX1278" },
      { name: "Sensors & Actuators" },
    ],
  },
  {
    name: "AI / ML",
    color: "#9f00ff",
    glowColor: "rgba(159, 0, 255, 0.4)",
    icon: "◈",
    skills: [
      { name: "TensorFlow" },
      { name: "ML Models" },
      { name: "OpenCV" },
      { name: "YOLOv3/v5" },
      { name: "Signal Processing" },
      { name: "Computer Vision" },
    ],
  },
  {
    name: "Web Dev",
    color: "#00d4ff",
    glowColor: "rgba(0, 212, 255, 0.4)",
    icon: "◻",
    skills: [
      { name: "React / Next.js" },
      { name: "Node.js" },
      { name: "MongoDB" },
      { name: "Firebase" },
      { name: "HTML/CSS" },
      { name: "TypeScript" },
    ],
  },
  {
    name: "Tools & Platforms",
    color: "#bf00ff",
    glowColor: "rgba(191, 0, 255, 0.4)",
    icon: "🛠",
    skills: [
      { name: "SolidWorks" },
      { name: "Linux" },
      { name: "Git & GitHub" },
      { name: "Firebase" },
      { name: "Vercel" },
      { name: "PCB Design" },
    ],
  },
];

export const hardwareProjects: HardwareProject[] = [
  {
    title: "Smart Water Testing Kit",
    description:
      "Portable IoT device measuring turbidity, pH, TDS, and temperature in real-time. Firebase-powered live dashboard with ESP32 and multi-sensor array.",
    techStack: ["ESP32", "Firebase", "Python", "IoT", "Sensors"],
    github: "https://github.com/rahul2005-tro",
    badge: "Deployed",
    icon: "💧",
  },
  {
    title: "AI Acoustic Rail Monitoring",
    description:
      "ML-powered acoustic anomaly detection for railway tracks. Classifies rail defects from vibration signatures without physical contact.",
    techStack: ["Python", "TensorFlow", "Signal Processing", "AI"],
    badge: "Research",
    icon: "🛤",
  },
  {
    title: "Bike Health Monitoring System",
    description:
      "Real-time embedded diagnostics system for two-wheelers monitoring engine health, vibration patterns, and predictive maintenance alerts.",
    techStack: ["ESP32", "STM32", "Embedded C", "Sensors"],
    badge: "Active",
    icon: "🏍",
  },
  {
    title: "ESP32-CAM YOLOv3 Vision",
    description:
      "Real-time object detection pipeline using ESP32-CAM with YOLOv3. Lightweight model optimized for microcontroller edge inference.",
    techStack: ["ESP32-CAM", "YOLOv3", "Python", "OpenCV"],
    github: "https://github.com/rahul2005-tro",
    badge: "Complete",
    icon: "📷",
  },
  {
    title: "VICHARAH Earth Leakage System",
    description:
      "Patented earth leakage detection and protection circuit for industrial and residential applications with automatic isolation.",
    techStack: ["Hardware Design", "PCB", "Embedded C", "Safety Systems"],
    badge: "Patent",
    icon: "⚡",
  },
];

export const softwareProjects: SoftwareProject[] = [
  {
    title: "TevrON Microgrid",
    description:
      "Intelligent microgrid management platform with real-time energy monitoring, load balancing, and predictive analytics dashboard.",
    techStack: ["React", "Node.js", "Firebase", "AI/ML"],
    github: "https://github.com/rahul2005-tro",
    icon: "⚡",
  },
  {
    title: "RF Cognisant Environment",
    description:
      "RF signal intelligence platform using LoRa for long-range data acquisition with an AI-driven cognisant sensing environment.",
    techStack: ["Python", "LoRa", "Raspberry Pi", "Signal Processing"],
    github: "https://github.com/rahul2005-tro/Lora-with-Raspberry-PI",
    icon: "📡",
  },
  {
    title: "Motor Protection Controller",
    description:
      "IoT dashboard for real-time motor health monitoring with threshold alerts, predictive maintenance, and Firebase data streaming.",
    techStack: ["HTML", "JavaScript", "Firebase", "IoT"],
    github: "https://github.com/rahul2005-tro/MPC-IOT",
    live: "https://mpc-iot.vercel.app",
    icon: "⚙️",
  },
  {
    title: "Air Purification Monitor",
    description:
      "Smart air quality monitoring portal with real-time PM2.5, CO2, and VOC metrics. Responsive dashboard with historical analysis.",
    techStack: ["HTML", "CSS", "JavaScript", "IoT"],
    github: "https://github.com/rahul2005-tro/air-purification-website",
    live: "https://air-purification-website.vercel.app",
    icon: "🌬",
  },
];

export const achievements: Achievement[] = [
  {
    title: "National Winner 🏆",
    event: "Smart India Hackathon 2025",
    year: "2025",
    type: "winner",
    description:
      "National-level winner among 100,000+ participants. Built an AI-powered embedded system solution addressing a critical national challenge.",
    icon: "🏆",
    org: "Government of India",
  },
  {
    title: "National Finalist",
    event: "Smart India Hackathon 2024",
    year: "2024",
    type: "finalist",
    description:
      "Selected as a national finalist, competing among top engineering teams across India on innovative technology solutions.",
    icon: "🥈",
    org: "Government of India",
  },
  {
    title: "Finalist",
    event: "KPIT Sparkle Innovation Challenge",
    year: "2024",
    type: "finalist",
    description:
      "Shortlisted as a finalist in KPIT Sparkle for developing an advanced automotive embedded systems solution.",
    icon: "🌟",
    org: "KPIT Technologies",
  },
  {
    title: "Finalist",
    event: "StartupTN Ideathon",
    year: "2024",
    type: "finalist",
    description:
      "Selected finalist for a hardware-based startup concept with real-world market impact in IoT and embedded systems.",
    icon: "🚀",
    org: "StartupTN",
  },
  {
    title: "Finalist",
    event: "Yukti Innovation Challenge",
    year: "2024",
    type: "finalist",
    description:
      "National-level innovation challenge finalist presenting research-grade embedded systems work.",
    icon: "💡",
    org: "MIC, Govt. of India",
  },
  {
    title: "State 1st Place",
    event: "Atal Tinkering Lab Challenge",
    year: "2023",
    type: "winner",
    description:
      "First place at state level for an innovative engineering prototype designed and built from ground up.",
    icon: "🥇",
    org: "NITI Aayog, Atal Innovation Mission",
  },
  {
    title: "Recognition Award",
    event: "ISRO Innovation Recognition",
    year: "2024",
    type: "recognition",
    description:
      "Recognized by ISRO for contributions in aerospace-adjacent embedded systems and autonomous control research.",
    icon: "🛸",
    org: "ISRO",
  },
];

export const featuredProjects: FeaturedProject[] = [
  {
    title: "Smart Water Testing Kit",
    subtitle: "IoT · Embedded Systems · Firebase",
    description:
      "A portable, real-time water quality monitoring system using ESP32 and multiple sensors. Transmits turbidity, pH, TDS, and temperature data to a Firebase-powered live dashboard.",
    techStack: ["ESP32", "Firebase", "Python", "HTML/CSS", "IoT"],
    icon: "💧",
    gradient: "from-cyan-900/40 to-blue-900/40",
    status: "Deployed",
  },
  {
    title: "AI Acoustic Rail Monitoring",
    subtitle: "AI · ML · Signal Processing",
    description:
      "An AI-powered system that listens to rail vibration patterns to detect anomalies, cracks, and wear in real-time.",
    techStack: ["Python", "ML Model", "OpenCV", "Signal Processing", "AI"],
    icon: "🛤",
    gradient: "from-green-900/40 to-emerald-900/40",
    status: "Research",
  },
  {
    title: "Autonomous Drone System",
    subtitle: "Robotics · Control Systems · TVC",
    description:
      "A Thrust Vector Control (TVC) drone system with autonomous stabilization using PID control loops and sensor fusion.",
    techStack: ["Embedded C", "PID Control", "TVC", "IMU", "GPS", "Robotics"],
    icon: "🚁",
    gradient: "from-purple-900/40 to-violet-900/40",
    status: "Active Development",
  },
];

export const timelineItems: TimelineItem[] = [
  {
    period: "2025",
    title: "Smart India Hackathon — National Winner",
    organization: "Government of India",
    description:
      "Led a team to victory at SIH 2025, building an AI-embedded system solution addressing a national engineering challenge.",
    tags: ["AI", "Embedded Systems", "National Winner"],
  },
  {
    period: "2024 — Present",
    title: "Autonomous Drone & TVC Research",
    organization: "Independent Research Project",
    description:
      "Developing a thrust vector control system for autonomous drone stabilization with PID loops and custom flight firmware.",
    tags: ["Embedded C", "Control Systems", "Robotics", "TVC"],
  },
  {
    period: "2024",
    title: "AI Rail Defect Detection System",
    organization: "Academic Research Initiative",
    description:
      "Designed and trained an ML model for acoustic-based rail anomaly detection with high accuracy.",
    tags: ["Python", "ML", "Signal Processing", "AI"],
  },
  {
    period: "2023 — 2024",
    title: "IoT Motor Protection Dashboard",
    organization: "Engineering Project",
    description:
      "Built a real-time IoT dashboard for motor protection monitoring with ESP32 sensors and Firebase.",
    tags: ["ESP32", "Firebase", "IoT", "Dashboard"],
  },
  {
    period: "2022 — Present",
    title: "Mechanical Engineering — B.Tech",
    organization: "Engineering University, India",
    description:
      "Bachelor's in Mechanical Engineering with focus on aerodynamics, thermodynamics, and control systems.",
    tags: ["Aerodynamics", "Thermodynamics", "Mechanical Design"],
  },
];

export const repoMetadata: Record<
  string,
  { description: string; techStack: string[] }
> = {
  TVC: {
    description:
      "Thrust Vector Control system for autonomous drone stabilization with PID control loops and sensor fusion.",
    techStack: ["JavaScript", "Embedded C", "Control Systems"],
  },
  RSS: {
    description:
      "Real-time sensor system with live data dashboard and Firebase integration.",
    techStack: ["HTML", "JavaScript", "Firebase"],
  },
  "MPC-IOT": {
    description:
      "Motor Protection Controller IoT dashboard for real-time monitoring and alert system.",
    techStack: ["HTML", "JavaScript", "IoT", "Firebase"],
  },
  iot: {
    description:
      "IoT monitoring system with ESP32 sensors and live web dashboard for industrial applications.",
    techStack: ["HTML", "JavaScript", "ESP32", "Firebase"],
  },
  "air-purification-website": {
    description:
      "Smart air purification system monitoring portal with real-time air quality metrics.",
    techStack: ["HTML", "CSS", "JavaScript"],
  },
  "Lora-with-Raspberry-PI": {
    description:
      "Long-range LoRa SX1278 communication system with Raspberry Pi 4 using SPI2 configuration.",
    techStack: ["Python", "LoRa", "Raspberry Pi"],
  },
  "Ml-Model": {
    description:
      "Machine learning model for sensor data classification and anomaly detection in industrial systems.",
    techStack: ["Python", "ML", "OpenCV", "AI"],
  },
};
