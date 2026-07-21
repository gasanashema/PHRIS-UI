# AI Vital - Population Health Intelligence Platform

**AI Vital** is a modern, AI-powered population health surveillance and intelligence platform tailored for public health management and early disease outbreak detection in Rwanda. The platform empowers health officers, epidemiologists, analysts, and system administrators with real-time insights, predictive modeling, geospatial tracking, and early warning automation across Rwanda's 30 districts.

---

## 🌟 Key Features & Role Portals

### 👥 Multi-Role Portals
- **System Administrator (`/admin`)**: User & role management, data source configurations, audit trails, system announcements, and automated backup schedules.
- **District Health Officer (`/dho`)**: Regional outbreak surveillance, district risk maps, community health worker (CHW) reports, facility monitoring, and targeted health interventions.
- **Epidemiologist (`/epi`)**: Active case investigations, field reporting, outbreak pattern analysis, epidemic thresholds, laboratory telemetry, and multi-disease comparison.
- **Public Health Analyst (`/analyst`)**: Cross-indicator correlation models, health vulnerability indices, exploratory data analysis, data quality scores, and scenario simulation.
- **Data Integration Engineer (`/integration`)**: Data pipeline orchestration, ETL validation, manual/batch file uploads, source mapping, and system health audits.

### 🔮 Advanced Modules
- **Predictive Analytics (`/prediction`)**: Disease outbreak prediction maps, contributing risk factor analysis, multi-scenario simulation, and model performance tracking.
- **Early Warning System (`/warning`)**: Threshold-triggered alerts, multi-channel notification dispatch, automated escalation workflows, and cross-border risk monitoring.
- **Geospatial Surveillance (`/geo`)**: Interactive health facility maps, environmental factor correlations, cross-border transmission tracking, temporal animated heatmaps, and spatial data exports.
- **Data Processing (`/processing`)**: Automated data cleaning, feature engineering, geographic standardization, real-time data metrics, and scheduled processing jobs.

---

## 🚀 Tech Stack

- **Frontend Core**: React 18 (TypeScript)
- **Build Tooling**: Vite
- **Styling**: Tailwind CSS, Vanilla CSS Design System
- **Data Visualization**: Recharts
- **Icons & Animations**: Lucide React, Framer Motion
- **Routing**: React Router DOM (v6)

---

## 📁 Project Structure

```text
ai-vital/
├── src/
│   ├── components/       # Shared UI components, charts, headers, navigation & role modals
│   ├── pages/            # View pages grouped by feature domain:
│   │   ├── admin/        # System administration & security logs
│   │   ├── analyst/      # Analytics, correlation & data exploration
│   │   ├── auth/         # Authentication, Login, MFA, Password Reset
│   │   ├── dho/          # District Health Officer dashboards
│   │   ├── epi/          # Epidemiologist field & surveillance tools
│   │   ├── geo/          # Spatial & GIS heatmaps
│   │   ├── integration/  # Ingestion pipelines & source management
│   │   ├── prediction/   # AI forecasting & scenario models
│   │   ├── processing/   # ETL data processing & cleaning
│   │   └── warning/      # Early warning alerts & escalation logic
│   ├── App.tsx           # Route definitions
│   ├── index.css         # Base styles & Tailwind setup
│   └── index.tsx         # Application entry point
├── package.json
└── README.md
```

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- `npm` or `yarn`

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ai-vital
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser to access the application.

---

## 🔑 Demo Accounts

For testing different role-based dashboards on the login screen (`/login`):

| Role | Email | Dashboard Route |
| :--- | :--- | :--- |
| **System Administrator** | `admin@rbc.gov.rw` | `/admin` |
| **District Health Officer** | `dho@huye.gov.rw` | `/dho` |
| **Epidemiologist** | `epi@rbc.gov.rw` | `/epi` |
| **Public Health Analyst** | `analyst@moh.gov.rw` | `/analyst` |
| **Data Integration** | `integration@rbc.gov.rw` | `/integration` |

---

## ⚙️ Building for Production

To create an optimized production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```
