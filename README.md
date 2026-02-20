<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>

<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![Unlicense License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/your_username/BarbellBites">
    <img src="frontend/public/vite.svg" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">BarbellBites</h3>

  <p align="center">
    Full-stack fitness-focused app with JWT auth, refresh-token rotation, and React frontend.
    <br />
    <a href="https://github.com/your_username/BarbellBites"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/your_username/BarbellBites">View Demo</a>
    &middot;
    <a href="https://github.com/your_username/BarbellBites/issues/new?labels=bug">Report Bug</a>
    &middot;
    <a href="https://github.com/your_username/BarbellBites/issues/new?labels=enhancement">Request Feature</a>
  </p>
</div>

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

[![Product Name Screen Shot][product-screenshot]](https://github.com/your_username/BarbellBites)

BarbellBites is a monorepo with:
- a TypeScript + Express backend (`backend/`) using MongoDB
- a React + Vite frontend (`frontend/`)

Key backend features include:
- request validation with Zod
- centralized error handling
- access + refresh JWT flow
- refresh token hashing + rotation
- cookie-based refresh/logout flows

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

Follow these steps to run BarbellBites locally.

### Prerequisites

* Node.js (LTS recommended)
* npm
* MongoDB (local or cloud)

```sh
npm install npm@latest -g
```

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

3. Create backend `.env` in `backend/.env`
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   MONGO_DB_NAME=barbellbites

   JWT_ACCESS_SECRET=your_access_secret
   JWT_REFRESH_SECRET=your_refresh_secret
   JWT_ACCESS_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=30d

   NODE_ENV=development
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

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->
## Usage

Backend API base URL:
- `http://localhost:5000/api/v1`

Auth endpoints:
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/test` (protected)

You can test API flows with Bruno requests in `backend/BarbellBites/`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->
## Roadmap

- [x] Backend auth with refresh token rotation
- [x] Cookie-based refresh/logout flow
- [x] Request validation middleware
- [ ] Frontend auth screens and protected routes
- [ ] User profile endpoint and UI
- [ ] Production deployment setup

See the [open issues](https://github.com/your_username/BarbellBites/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->
## Contributing

Contributions are welcome and appreciated.

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
* [Zod](https://zod.dev)
* [Express](https://expressjs.com)
* [Mongoose](https://mongoosejs.com)
* [Vite](https://vite.dev)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/your_username/BarbellBites.svg?style=for-the-badge
[contributors-url]: https://github.com/your_username/BarbellBites/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/your_username/BarbellBites.svg?style=for-the-badge
[forks-url]: https://github.com/your_username/BarbellBites/network/members
[stars-shield]: https://img.shields.io/github/stars/your_username/BarbellBites.svg?style=for-the-badge
[stars-url]: https://github.com/your_username/BarbellBites/stargazers
[issues-shield]: https://img.shields.io/github/issues/your_username/BarbellBites.svg?style=for-the-badge
[issues-url]: https://github.com/your_username/BarbellBites/issues
[license-shield]: https://img.shields.io/github/license/your_username/BarbellBites.svg?style=for-the-badge
[license-url]: https://github.com/your_username/BarbellBites/blob/main/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/your_username
[product-screenshot]: frontend/public/vite.svg
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
