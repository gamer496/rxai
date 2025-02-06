export default () => ({
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
  },
  dropbox: {
    accessToken: process.env.DROPBOX_ACCESS_TOKEN,
  },
}); 