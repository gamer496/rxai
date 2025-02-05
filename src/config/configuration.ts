export default () => ({
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || 'gpt-4',
  },
  google: {
    credentials: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  },
  dropbox: {
    accessToken: process.env.DROPBOX_ACCESS_TOKEN,
  },
}); 