
# Seneca Says... - Modern Stoic Wisdom Generator

A modern take on ancient Stoic wisdom, delivering sarcastic and witty philosophical advice for contemporary problems. This project uses OpenAI's GPT-4 to generate Stoic-inspired wisdom with a humorous twist, channeling the spirit of Seneca in a way that speaks to today's challenges.

## Features

- 🤖 AI-powered wisdom generation using GPT-4
- 🌙 Dark/Light mode support
- 📋 Easy copying of generated wisdom
- 📱 Share functionality across different platforms
- 💫 Modern, responsive UI with smooth animations

## Getting Started

### Prerequisites

- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- OpenAI API key - [get one here](https://platform.openai.com/api-keys)

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Configuration

The application requires an OpenAI API key to function. When you first run the application, you'll be prompted to enter your API key. This key is stored securely in your browser's local storage.

## Technology Stack

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **API Integration**: OpenAI GPT-4

## Project Structure

```
src/
  ├── components/        # React components
  ├── pages/            # Page components
  ├── lib/              # Utility functions
  └── styles/           # CSS and Tailwind styles
```

## Customizing the AI Prompt

The AI system uses a specific prompt to generate Stoic wisdom. You can modify this by updating the system message in the `WisdomGenerator.tsx` component:

```typescript
{
  role: "system",
  content: "You are Seneca, the Stoic philosopher, but with a sarcastic and modern twist..."
}
```

Feel free to adjust this prompt to change the AI's personality or response style.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Built with [Lovable](https://lovable.dev)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)

