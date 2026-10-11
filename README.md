\# FINORA — Personal Finance Dashboard



FINORA is a personal finance dashboard designed to help users organize their financial goals, understand their spending habits, and explore their investments through a clean, intuitive interface.



\## Features



\- \*\*Financial Dashboard:\*\* View key financial information in one place.

\- \*\*Money Management:\*\* Explore spending and financial habits.

\- \*\*Financial Goals:\*\* Organize and track personal financial goals.

\- \*\*Portfolio Exploration:\*\* Review investment-related information through a dedicated interface.

\- \*\*AI Interface:\*\* Explore finance-related assistance through the app's AI screen.

\- \*\*Authentication:\*\* Supabase integration for user authentication and data management.

\- \*\*Responsive UI:\*\* A component-based interface with reusable UI elements.



\## Tech Stack



\- React

\- TypeScript

\- Vite

\- Supabase

\- Tailwind CSS

\- Lucide React



\## Getting Started



\### Prerequisites



Install \[Node.js](https://nodejs.org/) and npm.



\### Installation



1\. Clone the repository:



&#x20;  ```bash

&#x20;  git clone https://github.com/dikshanyavarsha-cpu/FINORA.git

&#x20;  ```



2\. Navigate to the project folder:



&#x20;  ```bash

&#x20;  cd FINORA

&#x20;  ```



3\. Install dependencies:



&#x20;  ```bash

&#x20;  npm install

&#x20;  ```



4\. Create a `.env` file in the project root and configure your Supabase environment variables:



&#x20;  ```env

&#x20;  VITE\_SUPABASE\_URL=your\_supabase\_project\_url

&#x20;  VITE\_SUPABASE\_ANON\_KEY=your\_supabase\_publishable\_or\_anon\_key

&#x20;  ```



&#x20;  Replace the placeholders with your own Supabase project values. Never commit your `.env` file or expose secret/service-role keys.



5\. Start the development server:



&#x20;  ```bash

&#x20;  npm run dev

&#x20;  ```



\### Production Build



To create a production build, run:



```bash

npm run build

```



\## Project Structure



```text

FINORA/

├── src/

│   ├── components/   # Reusable UI components

│   ├── context/      # Application, authentication and theme state

│   ├── data/         # Demo data

│   ├── lib/          # Supabase configuration

│   ├── screens/      # Application screens

│   ├── types/        # TypeScript definitions

│   └── utils/        # Utility functions

├── supabase/

│   └── migrations/   # Database migrations

├── .env              # Local configuration; not committed

├── package.json

└── README.md

```



\## Development Approach



FINORA was developed with AI-assisted tools. The project is an opportunity to explore frontend development, authentication, database integration, financial application design, and the process of testing and improving a software product.



\## Future Improvements



\- Expand financial analytics and visualizations.

\- Improve portfolio tracking and insights.

\- Strengthen authentication and data-access policies.

\- Enhance accessibility and mobile responsiveness.



\## Author



\*\*Dikshanya Varsha\*\*



GitHub: \[@dikshanyavarsha-cpu](https://github.com/dikshanyavarsha-cpu)

