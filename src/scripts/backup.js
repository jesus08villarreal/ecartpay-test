const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const BACKUP_DIR = path.join(__dirname, '../../backups');

const createBackup = async () => {
  try {
    // Crear directorio de backups si no existe
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    const date = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(BACKUP_DIR, `backup-${date}.gz`);

    console.log('📦 Iniciando backup de la base de datos...');

    exec(
      `mongodump --uri="${process.env.MONGO_URI}" --archive="${backupFile}" --gzip`,
      (error, stdout, stderr) => {
        if (error) {
          console.error('❌ Error creando backup:', error);
          return;
        }
        console.log(`✅ Backup creado exitosamente en: ${backupFile}`);
      }
    );
  } catch (error) {
    console.error('❌ Error en el proceso de backup:', error);
  }
};

// Ejecutar si se llama directamente
if (require.main === module) {
  createBackup();
}

module.exports = createBackup; 