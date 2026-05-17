# GreenAV - Agricultural Management Platform

A comprehensive web-based agricultural management system built with Next.js, PostgreSQL, and Tailwind CSS. GreenAV enables administrators to manage farms, fields, crops, machines, and IoT sensors, while farmers can monitor their assigned farms and fields.

## Group Members:

### Seyedehsan damak – 22311781: DDL and DML

### Armin Safizadeh - 22312406: ERD

### Melikasadat Anvar: Functions, Procedures and Triggers

### Khashayar Khosrosourmi - 22302442: Web Application and DB connections

## 🚀 Live Demo

**Website:** [https://greenav.vercel.app](https://greenav.vercel.app)

### Test Credentials

#### Admin Account
- **Email:** `admin@gmail.com`
- **Password:** `admin`
- **Access:** Full system administration, farm management, farmer management, sensor deployment

#### Farmer Account
- **Email:** `farmer@gmail.com`
- **Password:** `farmer`
- **Access:** View assigned farms and fields, monitor crops and machines, receive alerts

## 📋 Features

### Admin Dashboard
- ✅ **Farm Management** - Create, edit, and delete farms
- ✅ **Field Management** - Manage fields within farms with status tracking (Plant, Growth, Harvest)
- ✅ **Crop Management** - Configure available crops with growth duration and ideal conditions
- ✅ **Machine Management** - Track machinery and equipment (status: idle, working, maintain)
- ✅ **Sensor Management** - Deploy IoT sensors (Temperature, Humidity, Soil Moisture) and assign to fields
- ✅ **Farmer Management** - View all farmers and assign them to farms
- ✅ **Alert Management** - Create system-wide alerts and notifications (Low, Medium, High severity)

### Farmer Dashboard
- ✅ **Farm Overview** - View all assigned farms and their details
- ✅ **Field Monitoring** - Monitor fields with current growth status
- ✅ **Crop Information** - Browse available crops and their requirements
- ✅ **Machine Access** - View available machinery with operational status
- ✅ **Alert Notifications** - Receive and filter system alerts by severity
- ✅ **Real-time Data** - Access sensor data and field metrics

## 🏗️ Architecture

### Tech Stack
- **Frontend:** Next.js 15+ with App Router, TypeScript, React Hooks
- **Backend:** Next.js API Routes with Node.js
- **Database:** PostgreSQL with pg driver
- **Authentication:** JWT with HTTP-only cookies
- **Styling:** Tailwind CSS 4 with dark theme
- **Package Manager:** pnpm


### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- pnpm (or npm/yarn)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd greenav
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**
```bash
# Create .env.local file
echo "DATABASE_URL=postgresql://user:password@localhost:5432/greenav" > .env.local
echo "JWT_SECRET=your-secret-key-here" >> .env.local
echo "NODE_ENV=development" >> .env.local
```

4. **Initialize database**
```bash
# Create PostgreSQL database
createdb greenav

# Run schema (see corrected-schema.sql)
psql greenav < corrected-schema.sql

# Insert default users
psql greenav << EOF
INSERT INTO users (email, password, name, role) VALUES
('admin@gmail.com', '$2b$10$...', 'Admin User', 'admin'),
('farmer@gmail.com', '$2b$10$...', 'Farmer User', 'farmer');
EOF
```

5. **Start development server**
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 User Workflows

### Admin Workflow
1. Login with admin credentials
2. Navigate to Admin Dashboard
3. Create farms and fields
4. Register crops and machinery
5. Deploy IoT sensors to fields
6. Assign farmers to farms via "Farmers" page
7. Monitor system alerts and farm activity

### Farmer Workflow
1. Login with farmer credentials
2. View assigned farms
3. Monitor field status and conditions
4. Check available machinery
5. Review crop information and requirements
6. Receive and filter system alerts
7. Track sensor data in real-time

## 🔗 API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `POST /api/register` - Create new user account

### Farm Management
- `GET /api/farm` - List farms (admin: all, farmer: assigned)
- `POST /api/farm` - Create farm (admin only)
- `PUT /api/farm/[id]` - Update farm (admin only)
- `DELETE /api/farm/[id]` - Delete farm (admin only)

### Field Management
- `GET /api/field` - List fields (filtered by farm access)
- `POST /api/field` - Create field
- `PUT /api/field/[id]` - Update field
- `DELETE /api/field/[id]` - Delete field

### Sensor Management
- `GET /api/iot-sensor` - List sensors with field info
- `POST /api/iot-sensor` - Create and install sensor
- `PUT /api/iot-sensor` - Update sensor and field assignment
- `DELETE /api/iot-sensor` - Uninstall sensor

### Other Endpoints
- `GET /api/crop` - List available crops
- `GET /api/machine` - List machinery
- `GET /api/alert` - List alerts
- `GET /api/farmers` - List all farmers with farm count

