import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const seedFile = join(__dirname, '..', 'src', 'db', 'seed.ts');

try {
  console.log('🌱 Running database seed...');
  execSync(`npx tsx "${seedFile}"`, { 
    stdio: 'inherit',
    cwd: join(__dirname, '..')
  });
} catch (error) {
  console.error('❌ Seeding failed:', error.message);
  process.exit(1);
}
