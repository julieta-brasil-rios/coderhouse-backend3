
const config = require('./src/config/env.config');
const mongoose = require('mongoose');
const app = require('./src/app');

async function start() {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('✅ Conectado a MongoDB');

    app.listen(config.port, () => {
      console.log(`🚀 ShipNow API corriendo en http://localhost:${config.port} [${config.nodeEnv}]`);
    });
  } catch (err) {
    console.error('❌ No se pudo iniciar la app:', err.message);
    process.exit(1);
  }
}

start();
