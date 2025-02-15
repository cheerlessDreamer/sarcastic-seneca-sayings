
# Seneca Says... - Modern Stoic Wisdom Generator

A modern take on ancient Stoic wisdom, delivering sarcastic and witty philosophical advice for contemporary problems. This project uses Supabase Edge Functions with GPT-4 to generate Stoic-inspired wisdom with a humorous twist, channeling the spirit of Seneca, Marcus Aurelius, and Epicurus in a way that speaks to today's challenges.

## Features

- 🎯 Choose from multiple Stoic philosophers (Seneca, Marcus Aurelius, Epicurus)
- 🤖 AI-powered wisdom generation using GPT-4 via Supabase Edge Functions
- 🌙 Dark/Light mode support
- 📋 Easy copying of generated wisdom
- 📱 Share functionality across different platforms

## Getting Started

### Prerequisites

- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Supabase account - [sign up here](https://supabase.com)

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

The application uses Supabase Edge Functions for the wisdom generation. You'll need to set up your Supabase project and deploy the Edge Functions included in the `/supabase/functions` directory.

## Technology Stack

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Supabase Edge Functions
- **AI Integration**: OpenAI GPT-4

## Project Structure

```
src/
  ├── components/        # React components
  ├── constants/        # Constant values and configurations
  ├── utils/           # Utility functions
  ├── hooks/           # Custom React hooks
  └── styles/          # CSS and Tailwind styles
supabase/
  └── functions/       # Edge Functions for wisdom generation
```

## Features in Detail

### Multiple Philosophers

Choose between three different philosophical perspectives:
- **Seneca**: Practical wisdom with a dash of sarcasm
- **Marcus Aurelius**: Stoic reflection with imperial authority
- **Epicurus**: Hedonistic wisdom focused on sustainable happiness

### AI-Powered Wisdom

The wisdom generation uses GPT-4 through Supabase Edge Functions, with carefully crafted prompts to maintain each philosopher's unique voice and perspective while addressing modern concerns.

### Theme Support

Built-in dark and light mode support that persists across sessions, with smooth transitions between themes.

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
- Animation library [AOS](https://michalsnik.github.io/aos/)
