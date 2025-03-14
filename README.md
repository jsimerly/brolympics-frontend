# Brolympics Frontend

## Overview
Brolympics Frontend is the user interface for the annual Brolympics competition, working in tandem with the Brolympics API backend. This application provides an interactive platform for competitors to manage their competitions and events, view brackets, track scores, and interact with other competitors.

## Technology Stack
<div style="display: flex; flex-wrap: wrap; gap: 5px;">
  <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React"/>
  <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3"/>
  <img src="https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5"/>
  <img src="https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/firebase-%23FFCA28.svg?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase"/>
</div>

## Core Features

### Dynamic Tournament Brackets
- Advanced bracket generation algorithm that adapts to various tournament sizes
- Interactive visual representation of tournament progression
- Real-time updates of match results and advancements

### Profile Management
- Custom image processing and cropping for profile pictures
- User profile customization and statistics tracking
- Personal performance history and achievements

### Commissioner Dashboard
- Comprehensive admin interface for tournament organizers
- League management tools including:
  - Participant approval and management
  - Event scheduling and configuration
  - Rules and scoring system customization
  - Dispute resolution tools

### Real-Time Updates
- TCP socket connections for live updates
- Instant notifications for match results, schedule changes, and announcements
- Live leaderboard and statistics updates

### User Experience
- Responsive design for mobile and desktop
- Intuitive navigation and competition tracking
- Social features to enhance participant engagement

## Development Setup
1. Clone the repository
```bash
git clone https://github.com/yourusername/brolympics_frontend.git
cd brolympics_frontend
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Configure environment variables
Create a `.env.local` file based on `.env.example` with your API endpoints and Firebase configuration.

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

5. Open your browser and navigate to `http://localhost:3000`

## Deployment
The frontend is deployed on Vercel with automated CI/CD via GitHub integration:
- Production deployment triggered on merges to main branch
- Preview deployments automatically created for pull requests
- Environment configuration managed through Vercel dashboard

## Integration with Brolympics API
This frontend application works in conjunction with the [Brolympics API](https://github.com/yourusername/brolympics_api) to deliver a complete experience:
- Authentication tokens shared between systems
- Consistent data models and validation
- Coordinated deployment strategies to maintain compatibility

## License
MIT
