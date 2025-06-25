# Settings Guide

Configure Study Buddy to work best for your needs and preferences.

## Quick Setup

### 1. Choose AI Provider
- **OpenAI**: High-quality responses, requires API key
- **Together AI**: Cost-effective, supports open-source models
- **Custom**: Use any OpenAI-compatible endpoint

### 2. Configure Search Engine
- **DuckDuckGo**: Privacy-focused, no setup required
- **Bing**: High-quality results, requires API key
- **SearXNG**: Self-hosted option for maximum privacy
- **Disabled**: Chat-only mode without web search

### 3. Set Education Level
Choose your default learning level from Elementary to Graduate.

## AI Provider Setup

### OpenAI Configuration
1. **Get API Key**: Visit [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. **Create New Key**: Click "Create new secret key"
3. **Copy Securely**: Save the key (you won't see it again)
4. **Enter in Settings**: Paste into AI Provider section
5. **Test Connection**: Verify it works before saving

**Recommended Models:**
- **GPT-3.5-turbo**: Fast and cost-effective for most topics
- **GPT-4**: Higher quality but slower and more expensive
- **GPT-4-turbo**: Good balance of quality and speed

### Together AI Configuration
1. **Sign Up**: Visit [api.together.xyz](https://api.together.xyz/)
2. **Generate API Key**: Create key from dashboard
3. **Select Model**: Choose from available options:
   - **Llama-3.1-8B-Instruct-Turbo**: Fast, efficient
   - **Llama-3.1-70B-Instruct-Turbo**: Higher quality
   - **Mixtral-8x7B-Instruct-v0.1**: Balanced performance

### Custom Endpoint Setup
For self-hosted or third-party AI services:

1. **Base URL**: Enter your API endpoint (e.g., `http://localhost:8080/v1`)
2. **API Key**: Provide authentication if required
3. **Model Name**: Specify model your endpoint supports
4. **Test**: Verify connection works properly

**Compatible Services:**
- Ollama (local models)
- LM Studio
- Text Generation WebUI
- Azure OpenAI
- AWS Bedrock (with proxy)

## Search Engine Configuration

### DuckDuckGo (Recommended for Privacy)
- **Setup**: No configuration required
- **Privacy**: No tracking or personal data collection
- **Limitations**: May be rate-limited during heavy usage
- **Best For**: Privacy-conscious users, no API costs

### Bing Search
1. **Azure Account**: Sign up at [portal.azure.com](https://portal.azure.com)
2. **Create Resource**: Search for "Bing Search v7"
3. **Get API Key**: Copy from resource overview page
4. **Enter Key**: Paste into Search Engine settings
5. **Test**: Verify search functionality works

**Pricing**: Pay-per-use model, check Azure pricing

### Serper (Google Search)
1. **Account**: Sign up at [serper.dev](https://serper.dev/)
2. **API Key**: Generate from dashboard
3. **Credits**: Monitor usage to avoid overages
4. **Configure**: Enter key in settings

**Features**: Access to Google search results via API

### SearXNG (Self-Hosted)
For maximum privacy and control:

1. **Find Instance**: Visit [searx.space](https://searx.space/) for public instances
2. **Test Instance**: Verify it's fast and reliable
3. **Enter URL**: Format like `https://searx.example.com`
4. **Test Search**: Confirm functionality

**Self-Hosting SearXNG:**
```bash
# Docker setup
docker run -d --name searxng \
  -p 8080:8080 \
  searxng/searxng

# Then use: http://localhost:8080
```

### Brave Search
1. **API Access**: Visit [api.search.brave.com](https://api.search.brave.com/)
2. **Subscribe**: Choose appropriate plan
3. **Generate Key**: Create API key from dashboard
4. **Configure**: Enter key in settings

**Benefits**: Independent search index, ad-free results

## Advanced Configuration

### Default Education Level
Set your preferred learning level:
- **Elementary**: Simple explanations for young learners
- **Middle School**: Intermediate complexity with examples
- **High School**: Advanced concepts with detailed analysis
- **Undergraduate**: College-level depth and rigor
- **Graduate**: Research-level discussions and theory

This setting is automatically applied to new conversations.

### Connection Settings
- **Timeout**: Default 30 seconds for AI responses
- **Search Timeout**: Default 10 seconds for search queries
- **Retries**: Automatic retry for failed requests

### Privacy Controls
- **Local Storage**: All data stays on your device
- **No Tracking**: Zero analytics or telemetry
- **API Key Security**: Keys stored locally, never transmitted

## Troubleshooting Settings

### Common Issues

#### "API Key Required" Error
- Verify key is correctly entered without extra spaces
- Check if key has been revoked or expired
- Ensure API key has sufficient credits/quota

#### "Connection Failed" Error
- Test internet connection with other applications
- Verify API key permissions
- Check provider status pages for outages

#### Search Not Working
- Try different search engine temporarily
- Verify API quotas haven't been exceeded
- For SearXNG: Try different instance from searx.space

#### Settings Not Saving
- Check if app has write permissions to user directory
- Verify sufficient disk space available
- Disable antivirus temporarily to test file writing
- Delete corrupt settings file and reconfigure

### Reset Configuration
If settings become corrupted:

1. **Backup API Keys**: Write them down first
2. **Close Application**: Ensure it's fully closed
3. **Delete Settings**:
   - Windows: `%APPDATA%/study-buddy/settings.json`
   - macOS: `~/Library/Application Support/study-buddy/settings.json`
   - Linux: `~/.config/study-buddy/settings.json`
4. **Restart App**: Reconfigure from scratch

## Security Best Practices

### API Key Management
- **Keep Private**: Never share API keys publicly
- **Rotate Regularly**: Change keys every few months
- **Monitor Usage**: Check provider dashboards for unusual activity
- **Revoke if Compromised**: Immediately revoke exposed keys

### Network Security
- **HTTPS Only**: All connections use secure protocols
- **Local Storage**: Settings stored locally, not in cloud
- **No Telemetry**: No usage data sent to external servers

## Performance Optimization

### Speed Improvements
1. **Choose Faster Models**: GPT-3.5 vs GPT-4 for speed
2. **Disable Search**: For simple questions that don't need web data
3. **Local AI**: Use Ollama or similar for offline processing
4. **Better Internet**: Faster connection improves response times

### Cost Management
1. **Model Selection**: Smaller models cost less per token
2. **Disable Search**: Reduces API calls for search engines
3. **Monitor Usage**: Check provider dashboards regularly
4. **Set Limits**: Configure spending limits on provider platforms

---

Need help with configuration? Check our [Troubleshooting Guide](troubleshooting.md) or visit the [GitHub repository](https://github.com/michael-borck/study-buddy) for support.