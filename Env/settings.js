 const session = process.env.SESSION || '';
const mycode = process.env.CODE || "267";
const botname = process.env.BOTNAME || 'Njabulo-AI';
const herokuAppName = process.env.HEROKU_APP_NAME || '';
const herokuApiKey = process.env.HEROKU_API_KEY || '';
const database = process.env.DATABASE_URL || '';

module.exports = {
  session,
  mycode,
  botname,
  database,
herokuAppName,
herokuApiKey
};