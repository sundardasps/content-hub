# Content Hub

This is a dynamic content aggregation and personalization web application built with Next.js, Tailwind CSS, and Redux Toolkit. It integrates with external APIs like NewsAPI, TMDB, and Spotify to provide a customized user feed. Authentication is handled using NextAuth.js with Google OAuth.

## ✨ Features

- User authentication with Google (NextAuth.js)
- Personalized content feed from:
  - NewsAPI
  - TMDB (Movies & TV Shows)
- Like/favorite items to save in your profile
- Drag-and-drop to rearrange your favorite items
- Responsive design using Tailwind CSS
- Dark mode support

## 🧪 How to Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/sundardasps/content-hub.git
cd content-hub


### 3. Set up environment variables

Create a `.env` file in the root directory and add the following:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
NEWS_API_KEY=your_newsapi_key
TMDB_API_KEY=your_tmdb_api_key


⚠️ Note: Never commit your .env.local file to version control. It contains sensitive credentials.

4. Run the development server
Copy
npm run dev
# or
yarn dev
Open http://localhost:3000 in your browser to see the result.


🧰 Tech Stack
Framework: Next.js

Styling: Tailwind CSS

State Management: Redux Toolkit

Authentication: NextAuth.js (Google)

APIs:

NewsAPI

TMDB




🧠 Folder Structure
bash
Copy
Edit
/app              → Api , and root pages
/components       → Reusable UI components
/pages            → Next.js pages
/lib              → API & Redux setup
/styles           → Global styles
/public           → Static files


📄 License
This project is licensed under the MIT License.

👨‍💻 Author
Sundardas PS
📧 sundardasps0055@gmail.com
🔗 LinkedIn (Replace if needed)

yaml
Copy
Edit

---

Let me know if you'd like me to push this update directly into your GitHub repo or create a downloadab
