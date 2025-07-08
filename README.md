# Energy Commodity Trade Reconciliation Dashboard

A comprehensive full-stack web application for energy commodity trade reconciliation and tie-out between trading desks and risk management teams.

## 🚀 Features

- **Trade Reconciliation**: Automated trade matching and tie-out functionality
- **Real-time Dashboard**: Live trade status monitoring and reconciliation alerts
- **Trade Comparison**: Side-by-side comparison of trader vs risk management trade records
- **Discrepancy Detection**: Automated identification of missing, mismatched, or incorrect trades
- **Approval Workflow**: Multi-level approval process for trade reconciliation
- **Advanced Analytics**: Reconciliation metrics and compliance reporting
- **Dark Mode**: Sleek, professional dark theme with colorful analytics
- **Security**: JWT authentication, role-based access control, audit trails
- **Real-time Updates**: WebSocket support for live reconciliation status
- **Responsive Design**: Mobile-friendly interface for on-the-go reconciliation

## 🏗️ Architecture

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Express.js + TypeScript + Node.js
- **Database**: SQLite (development) / PostgreSQL (production)
- **Real-time**: WebSocket with Socket.io
- **Charts**: Chart.js with custom dark theme
- **Authentication**: JWT with role-based access control

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd energy-trading-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   cp backend/env.example backend/.env
   # Edit backend/.env with your configuration
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

## 🛠️ Development

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api-docs

## 📁 Project Structure

```
energy-trading-dashboard/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   └── public/             # Static assets
├── backend/                 # Express.js backend application
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Data models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utility functions
│   └── database/           # Database files
└── docs/                   # Documentation
```

## 🔒 Security Features

- JWT authentication with role-based access control
- Rate limiting and request throttling
- Input validation and sanitization
- CORS configuration
- Helmet.js security headers
- SQL injection prevention
- XSS protection
- Audit trail logging

## 🎨 UI/UX Features

- Dark mode with customizable themes
- Responsive design for all devices
- Smooth animations and transitions
- Interactive data visualizations
- Real-time notifications
- Keyboard shortcuts
- Trade comparison interface

## 📊 Reconciliation Features

- **Trade Matching**: Automatic matching of trader vs risk management records
- **Discrepancy Highlighting**: Visual indicators for mismatched trades
- **Approval Workflow**: Multi-step approval process
- **Audit Trail**: Complete history of reconciliation actions
- **Compliance Reporting**: Regulatory compliance documentation
- **Real-time Status**: Live updates on reconciliation progress

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Docker Deployment
```bash
docker-compose up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details 