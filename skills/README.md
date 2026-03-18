# React Native Firebase Skills

This directory contains Claude Code skills for `@umituz/react-native-firebase`.

## Available Skills

### setup-react-native-firebase

Automated setup and integration for `@umituz/react-native-firebase` with cost-saving optimizations.

**What it does:**
- Detects project type (Expo vs bare React Native)
- Installs or updates the package
- Configures environment variables
- Adds Firebase initialization
- Enables cost optimizations
- Handles native setup (iOS pod install)

**Cost Savings:** ~740% improvement in free tier longevity when optimizations enabled!

## Installation

### Option 1: Install from Local Path

```bash
npx skills add /Users/umituz/Desktop/github/umituz/apps/mobile/npm-packages/react-native-firebase/skills/SKILL.md
```

### Option 2: Install Globally (Recommended)

```bash
npx skills add /Users/umituz/Desktop/github/umituz/apps/mobile/npm-packages/react-native-firebase/skills/SKILL.md -g
```

### Option 3: Manual Installation

```bash
mkdir -p ~/.claude/skills/setup-react-native-firebase
cp /Users/umituz/Desktop/github/umituz/apps/mobile/npm-packages/react-native-firebase/skills/SKILL.md ~/.claude/skills/setup-react-native-firebase/
```

## Usage

Once installed, the skill triggers automatically when you ask Claude Code to:

- Setup React Native Firebase
- Initialize Firebase
- Configure Firebase
- Install Firebase
- Setup Firebase with cost optimizations

**Example prompts:**

```text
Setup React Native Firebase in my app
```

```text
Initialize Firebase with cost optimizations enabled
```

```text
Install and configure @umituz/react-native-firebase with Apple auth
```

## Skill Structure

This skill follows the [app-store-screenshots](https://github.com/ParthJadhav/app-store-screenshots) pattern:

```
skills/
└── SKILL.md    # Main skill instructions with YAML frontmatter
```

The `SKILL.md` file contains:

1. **YAML Frontmatter** - Metadata and trigger keywords
   - `name`: Unique identifier
   - `description`: When to use it + "Triggers on:" keywords

2. **Markdown Content** - Step-by-step instructions for the AI agent
   - Overview and Quick Start
   - When to Use section
   - Numbered setup steps
   - Code examples
   - Verification checklist
   - Common mistakes table
   - Troubleshooting guide
   - Cost savings summary

## Why This Pattern Works

The app-store-screenshots skill is proven to work reliably across different AI agents because:

1. **Markdown-based instructions** - Easy to read and maintain
2. **Clear trigger keywords** - AI agents know when to activate it
3. **Step-by-step format** - Logical progression through the setup
4. **Code examples** - Exact commands to run
5. **Quality checklists** - Verification before completion
6. **Troubleshooting tables** - Quick reference for common issues

## Testing

To test the skill:

1. Install using one of the methods above
2. Open a new Claude Code session
3. Use a trigger prompt: "Setup React Native Firebase in my app"
4. Verify the skill activates and guides through setup correctly

## Key Features

### Project Detection

Automatically detects:
- Expo vs bare React Native
- Existing package installation
- App entry point location
- Native folders (ios/, android/)

### Cost Optimizations

Enables production-ready optimizations:
- **Smart Snapshot**: Suspends listeners on background (~80% savings)
- **Query Deduplication**: 10s window for duplicate queries (~90% savings)
- **Persistent Cache**: Survives app restarts (~90% savings)

**Combined:** ~740% improvement in free tier longevity!

### Error Prevention

Built-in safety checks:
- Verifies peer dependencies installed
- Validates environment variables
- Checks for existing initialization
- Warns about common mistakes

## Inspiration

This skill structure is inspired by [app-store-screenshots](https://github.com/ParthJadhav/app-store-screenshots), which demonstrates best practices for Claude Code skills.

## License

MIT

## Contributing

Contributions welcome! Submit PRs with:
- Clear descriptions
- Step-by-step instructions
- Code examples
- Testing instructions
- Troubleshooting guides
