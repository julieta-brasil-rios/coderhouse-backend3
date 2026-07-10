
require('dotenv').config();

const REQUIRED_VARS = ['PORT', 'MONGODB_URI', 'NODE_ENV'];

function validateEnv() {
  const missing = REQUIRED_VARS.filter((key) => {
    const value = process.env[key];
    return value === undefined || value === null || value.trim() === '';
  });

  if (missing.length > 0) {
    // Fail fast: si falta, la app no levanta 
    throw new Error(
      `❌ Configuración inválida. Faltan las siguientes variables de entorno: ${missing.join(
        ', '
      )}.\n   Revisá tu archivo ".env" (podés basarte en ".env.example").`
    );
  }
}

validateEnv();

const config = Object.freeze({
  port: Number(process.env.PORT),
  mongoUri: process.env.MONGODB_URI,
  nodeEnv: process.env.NODE_ENV,
  isProduction: process.env.NODE_ENV === 'production',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
});

module.exports = config;
