<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>

# BarbellBites

Full-stack recipe platform with JWT auth, versioned APIs, and dual MongoDB sync/failover support.

<!-- TABLE OF CONTENTS -->
<details>
	<summary>Table of Contents</summary>
	<ol>
		<li>
			<a href="#about-the-project">About The Project</a>
			<ul>
				<li><a href="#built-with">Built With</a></li>
			</ul>
		</li>
		<li>
			<a href="#getting-started">Getting Started</a>
			<ul>
				<li><a href="#prerequisites">Prerequisites</a></li>
				<li><a href="#installation">Installation</a></li>
			</ul>
		</li>
		<li><a href="#usage">Usage</a></li>
		<li><a href="#roadmap">Roadmap</a></li>
		<li><a href="#contributing">Contributing</a></li>
		<li><a href="#license">License</a></li>
		<li><a href="#contact">Contact</a></li>
		<li><a href="#acknowledgments">Acknowledgments</a></li>
	</ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

BarbellBites is a monorepo application with:

- React + Vite frontend (`frontend/`)
- TypeScript + Express backend (`backend/`)
- MongoDB dual-cluster architecture (`primary` and `secondary`)

Key backend features:

- Versioned API routes (`/api/v1`, `/api/v2`)
- JWT auth with refresh token flow
- Centralized validation and error handling
- Sync tooling for cross-cluster data reconciliation
- Background sync worker and automated Bruno test execution

Project layout:

- `backend/`: API, migrations, sync scripts, Bruno suites
- `frontend/`: SPA, pages, layouts, API modules, state management
- `docs/`: architecture, API, dependency, sync and versioning docs

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* [![React][React.js]][React-url]
* [![TypeScript][TypeScript-shield]][TypeScript-url]
* [![Express][Express-shield]][Express-url]
* [![MongoDB][MongoDB-shield]][MongoDB-url]
* [![Vite][Vite-shield]][Vite-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

* Node.js (LTS)
* npm
* Two MongoDB Atlas clusters (primary + secondary)

### Installation

1. Clone the repo
	 ```sh
	 git clone https://github.com/your_username/BarbellBites.git
	 cd BarbellBites
	 ```
2. Install backend dependencies
	 ```sh
	 cd backend
	 npm install
	 ```
3. Create `backend/.env`
	 ```env
	 PORT=3000
	 MONGO_URI=<primary-uri>
	 MONGO_URI_SECONDARY=<secondary-uri>
	 MONGO_DB_NAME=BarbellBites

	 JWT_ACCESS_SECRET=<secret>
	 JWT_REFRESH_SECRET=<secret>
	 JWT_ACCESS_EXPIRES_IN=15m
	 JWT_REFRESH_EXPIRES_IN=30d

	 FRONTEND_ORIGIN=http://localhost:5173, http://localhost:5174
	 ```
4. Install frontend dependencies
	 ```sh
	 cd ../frontend
	 npm install
	 ```
5. Start backend
	 ```sh
	 cd ../backend
	 npm run dev
	 ```
6. Start frontend (new terminal)
	 ```sh
	 cd ../frontend
	 npm run dev
	 ```

Frontend default: `http://localhost:5173`  
Backend default: `http://localhost:3000`

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->
## Usage

### Backend Core Commands

- `npm run dev`
- `npm run build`
- `npm run db:migrate`
- `npm run db:seed`

### Data Sync Commands

- `npm run db:sync`
- `npm run db:sync:p2s`
- `npm run db:sync:s2p`
- `npm run job:sync`
- `npm run job:sync:once`

### Bruno Test Commands

- `npm run test:v1:smoke`
- `npm run test:v1:edge`
- `npm run test:v2:smoke`
- `npm run test:v2:edge`
- `npm run test:smoke`
- `npm run test:edge`
- `npm run test:all`

`test:*` scripts auto-start the backend and run Bruno suites.

Project docs:

- `docs/TechnicalReference.md`
- `docs/ArchitectureDoc.md`
- `docs/ApiDocumentation.md`
- `docs/DatabaseSchema.md`
- `docs/EnvironmentConfigurationGuide.md`
- `docs/CodeStyleGuide.md`
- `docs/TestingGuide.md`
- `docs/SecurityGuide.md`
- `docs/TroubleshootingFaq.md`
- `docs/recipes-enhancement-plan.md`

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->
## Roadmap

- [x] Versioned API routes (`v1`, `v2`)
- [x] Recipe/favorites flows with auth protection
- [x] Dual MongoDB connections and manual sync tooling
- [x] Background sync worker
- [x] Automated Bruno smoke/edge test scripts
- [ ] Frontend production deployment hardening
- [ ] CI pipeline for tests and build validation

See the [open issues](https://github.com/your_username/BarbellBites/issues) for planned improvements.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->
## Contributing

Contributions are welcome.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->
## License

Distributed under the Unlicense License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

Your Name - [@your_twitter](https://twitter.com/your_username) - email@example.com

Project Link: [https://github.com/your_username/BarbellBites](https://github.com/your_username/BarbellBites)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [Best README Template](https://github.com/othneildrew/Best-README-Template)
* [MongoDB Atlas](https://www.mongodb.com/atlas)
* [Bruno API Client](https://www.usebruno.com/)
* [Express](https://expressjs.com)
* [Mongoose](https://mongoosejs.com)
* [Vite](https://vite.dev)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[TypeScript-shield]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[Express-shield]: https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white
[Express-url]: https://expressjs.com/
[MongoDB-shield]: https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white
[MongoDB-url]: https://www.mongodb.com/
[Vite-shield]: https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white
[Vite-url]: https://vite.dev/

