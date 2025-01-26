const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const BACKUP_DIR = path.join(__dirname, '../../backups');

const restoreBackup = async (backupFile) => {
  try {
    if (!backupFile) {
      // Si no se especifica archivo, usar el más reciente
      const files = fs.readdirSync(BACKUP_DIR);
      const latestBackup = files
        .filter(file => file.startsWith('backup-'))
        .sort()
        .pop();
      
      if (!latestBackup) {
        throw new Error('No se encontraron archivos de backup');
      }
      
      backupFile = path.join(BACKUP_DIR, latestBackup);
    }

    if (!fs.existsSync(backupFile)) {
      throw new Error(`Archivo de backup no encontrado: ${backupFile}`);
    }

    console.log('🔄 Iniciando restauración de la base de datos...');

    exec(
      `mongorestore --uri="${process.env.MONGO_URI}" --archive="${backupFile}" --gzip`,
      (error, stdout, stderr) => {
        if (error) {
          console.error('❌ Error restaurando backup:', error);
          return;
        }
        console.log('✅ Base de datos restaurada exitosamente');
      }
    );
  } catch (error) {
    console.error('❌ Error en el proceso de restauración:', error);
  }
};

// Ejecutar si se llama directamente
if (require.main === module) {
  const backupFile = process.argv[2]; // Opcional: archivo específico
  restoreBackup(backupFile);
}

module.exports = restoreBackup; 