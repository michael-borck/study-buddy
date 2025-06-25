# Troubleshooting Guide

This guide helps you resolve common issues and get the most out of Study Buddy.

## Quick Diagnostics

### ✅ Health Check

Before troubleshooting specific issues, verify your basic setup:

1. **Check Settings**: Go to Settings page and verify:
   - AI Provider is configured with valid API key
   - Search Engine is selected and configured
   - Default Education Level is set

2. **Test Connection**: In Settings:
   - Use "Test Connection" for AI provider
   - Try a simple search to verify search engine
   - Save settings and restart if needed

3. **Network Connection**: Ensure stable internet access for external services

## Common Issues

### 🚫 AI Provider Issues

#### "API Key Required" Error
**Symptoms**: Error message when trying to chat
**Solution**:
1. Go to Settings page
2. Select your AI provider (OpenAI, Together AI, or Custom)
3. Enter valid API key
4. Click "Test Connection" to verify
5. Save settings

**Getting API Keys**:
- **OpenAI**: Visit [platform.openai.com](https://platform.openai.com/api-keys)
- **Together AI**: Visit [api.together.xyz](https://api.together.xyz/)

#### "Connection Failed" Error
**Symptoms**: Unable to connect to AI service
**Potential Causes & Solutions**:

1. **Invalid API Key**:
   - Verify key is correctly copied (no extra spaces)
   - Check if key has been revoked or expired
   - Ensure API key has sufficient credits/quota

2. **Network Issues**:
   - Check internet connection
   - Try different network (mobile hotspot)
   - Verify no firewall blocking connections

3. **Service Outage**:
   - Check provider status pages:
     - [OpenAI Status](https://status.openai.com/)
     - [Together AI Status](https://status.together.ai/)
   - Try again after service restoration

4. **Custom Endpoint Issues**:
   - Verify Base URL is correct and accessible
   - Ensure endpoint is OpenAI-compatible
   - Check if authentication headers are correct

#### "Model Not Found" Error
**Symptoms**: Error when using specific model
**Solution**:
1. Go to Settings → AI Provider
2. Click "Discover Models" to refresh available models
3. Select a different model from the list
4. Some models may require special access or higher pricing tiers

### 🔍 Search Engine Issues

#### "Search Failed" Error
**Symptoms**: No search results, search error messages
**Solutions by Engine**:

**Bing Search**:
- Verify Bing API key in Settings
- Check API key quota and billing status
- Ensure key has Web Search API access

**Serper (Google)**:
- Verify Serper API key
- Check credit balance at [serper.dev](https://serper.dev/)
- Ensure API key permissions are correct

**DuckDuckGo**:
- No API key required
- If blocked, try switching to different search engine
- Wait a few minutes and try again (rate limiting)

**SearXNG**:
- Verify server URL is correct and accessible
- Ensure SearXNG instance is running and public
- Try different SearXNG instance: [searx.space](https://searx.space/)
- Check if instance allows API access

**Brave Search**:
- Verify Brave API key
- Check API quota at [api.search.brave.com](https://api.search.brave.com/)

#### "Rate Limited" Errors
**Symptoms**: "Too many requests" or 429 errors
**Solutions**:
- Wait 30-60 seconds before trying again
- Switch to different search engine temporarily
- For SearXNG: Use different instance or self-host

### 🖥️ Application Issues

#### App Won't Start
**Windows**:
1. Right-click installer → "Run as Administrator"
2. Check Windows Defender/antivirus exclusions
3. Install Visual C++ Redistributables if missing
4. Try portable version instead of installer

**macOS**:
1. Right-click app → "Open" to bypass Gatekeeper
2. Go to System Preferences → Security & Privacy → Allow app
3. For Apple Silicon: Ensure you downloaded correct version

**Linux**:
1. Make AppImage executable: `chmod +x StudyBuddy.AppImage`
2. Install FUSE if missing: `sudo apt install fuse`
3. Try running from terminal to see error messages

#### Slow Performance
**Symptoms**: App feels sluggish, slow responses
**Solutions**:
1. **Check RAM Usage**: Close other applications
2. **Internet Speed**: Test with [speedtest.net](https://speedtest.net)
3. **AI Model**: Try faster models (GPT-3.5 vs GPT-4)
4. **Search Engine**: Switch to faster option (Bing vs SearXNG)
5. **Restart App**: Fresh restart can clear memory issues

#### Settings Not Saving
**Symptoms**: Settings reset after app restart
**Solutions**:
1. **Permissions**: Ensure app can write to user directory
2. **Antivirus**: Check if security software blocks file writes
3. **Disk Space**: Verify sufficient space for config files
4. **File Corruption**: Delete settings file and reconfigure:
   - Windows: `%APPDATA%/study-buddy/`
   - macOS: `~/Library/Application Support/study-buddy/`
   - Linux: `~/.config/study-buddy/`

### 💬 Chat Interface Issues

#### Messages Not Sending
**Symptoms**: Text entered but no response
**Checklist**:
1. Verify AI provider is configured in Settings
2. Check internet connection
3. Try shorter message (some models have limits)
4. Clear browser cache if using web version
5. Restart application

#### Incomplete Responses
**Symptoms**: AI responses cut off mid-sentence
**Possible Causes**:
1. **Token Limits**: Model hit response length limit
   - Try asking for shorter response
   - Break complex questions into parts
2. **Network Timeout**: Connection interrupted
   - Refresh and try again
   - Check internet stability
3. **Provider Issues**: Temporary service degradation
   - Wait and retry in few minutes

#### Poor Response Quality
**Symptoms**: Irrelevant or low-quality answers
**Improvements**:
1. **Be More Specific**: Include context and specific questions
2. **Set Education Level**: Match your knowledge level
3. **Try Different Model**: Some models perform better for certain topics
4. **Rephrase Question**: Different wording can yield better results
5. **Enable Search**: Ensure search engine is configured for current information

## Error Messages

### API Error Codes

#### HTTP 401 Unauthorized
- **Cause**: Invalid or missing API key
- **Solution**: Check API key in Settings, ensure it's correct

#### HTTP 403 Forbidden  
- **Cause**: API key lacks permissions or is banned
- **Solution**: Check API key permissions, contact provider if needed

#### HTTP 429 Too Many Requests
- **Cause**: Rate limit exceeded
- **Solution**: Wait before retrying, upgrade API plan if needed

#### HTTP 500 Internal Server Error
- **Cause**: Provider service issue
- **Solution**: Try again later, check provider status page

#### HTTP 503 Service Unavailable
- **Cause**: Service temporarily down
- **Solution**: Wait and retry, check provider status

### Application Error Messages

#### "Failed to Load Settings"
**Solutions**:
1. Check file permissions in config directory
2. Delete corrupted settings file and reconfigure
3. Run app as administrator (Windows) or with sudo (Linux)

#### "Model Discovery Failed"
**Solutions**:
1. Verify API key and connection
2. Try manual model entry instead of discovery
3. Check if provider supports model listing API

#### "Search Configuration Error"
**Solutions**:
1. Verify search engine settings
2. Test search engine independently
3. Switch to different search provider

## Performance Optimization

### Speed Up Responses
1. **Use Faster Models**:
   - OpenAI: GPT-3.5-turbo (faster) vs GPT-4 (more accurate)
   - Together AI: Smaller models respond faster

2. **Optimize Search**:
   - Disable search for simple questions
   - Use faster search engines (Bing > SearXNG)
   - Limit search results in custom configurations

3. **Network Optimization**:
   - Use wired connection instead of Wi-Fi
   - Close bandwidth-heavy applications
   - Consider VPN if provider is geographically distant

### Reduce Resource Usage
1. **Memory Management**:
   - Restart app periodically for long sessions
   - Close other browser tabs (web version)
   - Use lighter search engines

2. **Disk Space**:
   - Clear conversation history if needed
   - Manage cache files in app directory

## Advanced Troubleshooting

### Debug Mode
Enable detailed logging for complex issues:

1. **Electron App**: 
   - Windows: Run from Command Prompt to see logs
   - macOS/Linux: Run from Terminal

2. **Web Version**: 
   - Open browser Developer Tools (F12)
   - Check Console tab for error messages

### Configuration Reset
If all else fails, reset to defaults:

1. **Backup Current Settings**: Note your API keys
2. **Delete Config Directory**:
   - Windows: `%APPDATA%/study-buddy/`
   - macOS: `~/Library/Application Support/study-buddy/`
   - Linux: `~/.config/study-buddy/`
3. **Restart App**: Reconfigure from scratch

### Network Diagnostics
For connection issues:

```bash
# Test API endpoints
curl -H "Authorization: Bearer YOUR_API_KEY" https://api.openai.com/v1/models

# Test search services
curl "https://api.bing.microsoft.com/v7.0/search?q=test"

# Check DNS resolution
nslookup api.openai.com
```

## Getting Help

### Self-Service Resources
1. **Documentation**: Check other guides in this docs folder
2. **Settings Page**: Built-in help text and examples
3. **About Page**: Version info and feature descriptions

### Community Support
1. **GitHub Issues**: [Report bugs or ask questions](https://github.com/michael-borck/study-buddy/issues)
2. **Discussions**: [Community Q&A](https://github.com/michael-borck/study-buddy/discussions)
3. **Feature Requests**: [Suggest improvements](https://github.com/michael-borck/study-buddy/issues/new)

### When Reporting Issues
Include these details:
1. **Operating System**: Windows/macOS/Linux version
2. **App Version**: Found in About page
3. **Error Messages**: Exact text of any errors
4. **Steps to Reproduce**: What you did before the issue
5. **Configuration**: Which AI provider and search engine
6. **Screenshots**: If visual issues are involved

### Privacy Note
When seeking help:
- Never share API keys publicly
- Don't include personal conversation content
- Use generic examples when describing issues

---

*Can't find a solution? Visit our [GitHub repository](https://github.com/michael-borck/study-buddy) for additional support and to report new issues.*