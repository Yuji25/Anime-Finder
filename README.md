# ANIME-FINDER

A modern, responsive web application for discovering, tracking, and organizing your anime watching experience.

## 🌟 Features

- **Browse Anime**: Explore top anime, seasonal releases, and search by title or genre
- **Personal Library**: Create and manage your anime collection with categories:
  - Watching
  - Plan to Watch
  - Completed
  - Dropped
  - Favorites
- **Detailed Information**: View comprehensive details about each anime, including:
  - Synopsis
  - Rating
  - Episodes
  - Trailer
  - Characters
  - Recommendations
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop devices

## 🛠️ Tech Stack

- **React.js** - UI library with functional components and hooks
- **React Router** - For seamless navigation between pages
- **Context API** - State management for the library feature
- **Tailwind CSS** - Utility-first CSS framework for modern design
- **Axios** - HTTP client for API requests
- **Jikan API** - API for retrieving anime data from MyAnimeList

## 📱 Pages

1. **Home Page** - Landing page featuring a search bar, trending anime, and top characters
2. **Browse Page** - Search and filter anime by genres with pagination
3. **Library Page** - Manage your personal anime collection
4. **Anime Detail Page** - View detailed information about a specific anime


## 🔗 Deployment
[Experience yourself!](https://anime-finder-nu.vercel.app/)

## 🚀 Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Yuji25/Anime-Finder.git
   cd anime-finder
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## 📝 Project Structure

```
anime-finder/
├── src/                  # Source files
│   ├── components/       # Reusable components
│   │   ├── anime/        # Anime-specific components
│   │   ├── layout/       # Layout components
│   │   └── ui/           # UI components
│   ├── context/          # React context providers
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   ├── services/         # API services
│   └── utils/            # Utility functions
├── public/               # Static files
└── ...
```

## 🔍 API Reference

This project uses the [Jikan API](https://jikan.moe/), a free, open-source REST API for MyAnimeList.net.

## 🧠 Future Enhancements

- User authentication
- Ability to rate anime
- Episode tracking
- Advanced filtering options
- Dark/Light theme toggle
- Social sharing features

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Jikan API](https://jikan.moe/) for providing anime data
- [MyAnimeList](https://myanimelist.net/) as the data source
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework
- [React.js](https://reactjs.org/) for the frontend framework
