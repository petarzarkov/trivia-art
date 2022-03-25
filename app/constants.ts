export const SERVER_PORT = process.env.SERVER_PORT ? (Number(process.env.SERVER_PORT) || 3000) : 3000;
export const MIN_QUESTIONS = process.env.MIN_QUESTIONS ? (Number(process.env.MIN_QUESTIONS) || 10) : 10;
export const MAX_QUESTIONS = process.env.MAX_QUESTIONS ? (Number(process.env.MAX_QUESTIONS) || 100) : 100;