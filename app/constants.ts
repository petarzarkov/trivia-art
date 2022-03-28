export const API_TOKEN = process.env.API_TOKEN ? process.env.API_TOKEN : "dev2api3token";
export const SERVER_PORT = process.env.PORT ? (Number(process.env.PORT) || 3000) : 3000;
export const MIN_QUESTIONS = process.env.MIN_QUESTIONS ? (Number(process.env.MIN_QUESTIONS) || 20) : 20;
export const MAX_QUESTIONS = process.env.MAX_QUESTIONS ? (Number(process.env.MAX_QUESTIONS) || 100) : 100;