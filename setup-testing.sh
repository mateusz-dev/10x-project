#!/bin/bash
# Setup script for testing environment in 10x-project

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Setting up testing environment for 10x-project...${NC}"

# Check if Node.js and npm are installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is not installed. Please install Node.js and npm first.${NC}"
    exit 1
fi

# Install dependencies if needed
echo -e "${GREEN}Installing/updating dependencies...${NC}"
npm install

# Create directories if they don't exist
echo -e "${GREEN}Creating test directories...${NC}"
mkdir -p src/tests/unit
mkdir -p src/tests/e2e/page-objects
mkdir -p src/tests/setup
mkdir -p src/tests/utils
mkdir -p screenshots

# Initialize Playwright browsers
echo -e "${GREEN}Installing Playwright browsers...${NC}"
npx playwright install chromium

# Create initial test directories
echo -e "${GREEN}Setting up screenshot directories...${NC}"
mkdir -p screenshots

echo -e "${YELLOW}Testing environment setup complete!${NC}"
echo -e "You can now run tests with:"
echo -e "${GREEN}npm test${NC} - Run unit tests"
echo -e "${GREEN}npm run test:watch${NC} - Run unit tests in watch mode"
echo -e "${GREEN}npm run test:coverage${NC} - Generate test coverage report"
echo -e "${GREEN}npm run test:e2e${NC} - Run end-to-end tests"
echo -e "${GREEN}npm run test:e2e:ui${NC} - Run end-to-end tests with UI"

exit 0
