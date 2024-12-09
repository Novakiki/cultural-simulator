# Cultural Simulator

A simulation exploring how cultural backgrounds shape life journeys, featuring parallel path comparisons and dynamic life choices.

## Setup

1. Clone the repository:
```bash
git clone https://github.com/Novakiki/cultural-simulator.git
cd cultural-simulator
```

2. Set up your environment variables:
```bash
# In fish shell
set -x OPENAI_API_KEY your_api_key_here
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Application

Start the development server:
```bash
uvicorn main:app --reload
```

The application will be available at: http://127.0.0.1:8000

## Features

- Dynamic life path simulation
- Cultural context integration
- Real-time stat tracking
- Parallel path comparison
- Modern glass morphism UI

## Development

- Built with FastAPI and modern JavaScript
- Styled with Tailwind CSS and custom glass morphism effects
- Integrated with OpenAI for dynamic content generation

## Notes

- Make sure your OpenAI API key is set before running
- The `--reload` flag enables auto-reload for development 