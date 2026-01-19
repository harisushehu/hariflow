# Hariflow

A modern full-stack application built with React, TypeScript, tRPC, and Drizzle ORM.

## 🚀 Features

- **Full-stack TypeScript**: End-to-end type safety with tRPC
- **Modern UI**: Built with React, Tailwind CSS, and shadcn/ui components
- **Database**: MySQL with Drizzle ORM for type-safe database access
- **Authentication**: Secure authentication system
- **Image Processing**: Advanced image handling and annotation tools
- **AI Integration**: AI-powered features and chatbot
- **Testing**: Comprehensive test suite with Vitest

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **pnpm** (v8 or higher)
- **MySQL** (v8 or higher)

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/harisushehu/hariflow.git
   cd hariflow
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   DATABASE_URL=mysql://root:yourpassword@localhost:3306/hariflow
   ```

   Replace:
   - `root` with your MySQL username
   - `yourpassword` with your MySQL password
   - `hariflow` with your database name

4. **Create the database**

   Log into MySQL and create the database:

   ```sql
   CREATE DATABASE hariflow CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

5. **Run database migrations**

   ```bash
   pnpm db:push
   ```

## 🚀 Running the Application

### Development Mode

Start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:5173`

### Production Build

Build the application for production:

```bash
pnpm build
```

### Run Tests

Execute the test suite:

```bash
pnpm test
```

## 📁 Project Structure

```
hariflow-clone/
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Application pages
│   │   ├── hooks/       # Custom React hooks
│   │   ├── contexts/    # React context providers
│   │   └── lib/         # Utility libraries
├── server/              # Backend tRPC server
│   ├── routers/         # API route handlers
│   ├── services/        # Business logic
│   ├── middleware/      # Server middleware
│   └── utils/           # Utility functions
├── drizzle/             # Database schema and migrations
├── shared/              # Shared types and constants
└── public/              # Static assets
```

## 🔧 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm test` - Run tests
- `pnpm db:push` - Apply database migrations
- `pnpm lint` - Lint code (if configured)

## 🧪 Testing

The project includes comprehensive tests using Vitest. Run tests with:

```bash
pnpm test
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Harisu Shehu**

- GitHub: [@harisushehu](https://github.com/harisushehu)

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Database ORM: [Drizzle](https://orm.drizzle.team/)
- API layer: [tRPC](https://trpc.io/)

## 📞 Support

For support, please open an issue in the GitHub repository.

---

Made with ❤️ by Harisu Shehu
