import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { EXERCISES, MODULES, DATABASES } from '../src/data/curriculum';
import { DEFAULT_DATASET_FILENAME, DEFAULT_DATASET_TABLE_NAME, DEFAULT_DATASET_CSV } from '../src/data/defaultPlaygroundDataset';

describe('Application Sanity & Health Checks', () => {
  const rootDir = path.resolve(__dirname, '..');

  describe('Android & Capacitor Configuration Sanity', () => {
    it('should have valid capacitor.config.ts with correct appId and webDir', () => {
      const capConfigPath = path.join(rootDir, 'capacitor.config.ts');
      expect(fs.existsSync(capConfigPath)).toBe(true);

      const content = fs.readFileSync(capConfigPath, 'utf8');
      expect(content).toContain("appId: 'app.learnduckdb'");
      expect(content).toContain("webDir: 'dist'");
    });

    it('should have AndroidManifest.xml and build.gradle configured with appId', () => {
      const manifestPath = path.join(rootDir, 'android/app/src/main/AndroidManifest.xml');
      expect(fs.existsSync(manifestPath)).toBe(true);

      const manifestContent = fs.readFileSync(manifestPath, 'utf8');
      expect(manifestContent).toContain('android.intent.action.MAIN');
      expect(manifestContent).toContain('android.intent.category.LAUNCHER');

      const gradlePath = path.join(rootDir, 'android/app/build.gradle');
      expect(fs.existsSync(gradlePath)).toBe(true);
      const gradleContent = fs.readFileSync(gradlePath, 'utf8');
      expect(gradleContent).toContain('applicationId "app.learnduckdb"');
      expect(gradleContent).toContain('namespace = "app.learnduckdb"');
    });

    it('should have formatted app name "Learn DuckDB" in strings.xml', () => {
      const stringsPath = path.join(rootDir, 'android/app/src/main/res/values/strings.xml');
      expect(fs.existsSync(stringsPath)).toBe(true);

      const content = fs.readFileSync(stringsPath, 'utf8');
      expect(content).toContain('<string name="app_name">Learn DuckDB</string>');
    });

    it('should verify all Android launcher icons exist and are non-empty across all mipmap densities', () => {
      const densities = ['mdpi', 'hdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi'];
      for (const d of densities) {
        const iconPath = path.join(rootDir, `android/app/src/main/res/mipmap-${d}/ic_launcher.png`);
        const roundPath = path.join(rootDir, `android/app/src/main/res/mipmap-${d}/ic_launcher_round.png`);
        const fgPath = path.join(rootDir, `android/app/src/main/res/mipmap-${d}/ic_launcher_foreground.png`);

        expect(fs.existsSync(iconPath), `Missing ic_launcher in mipmap-${d}`).toBe(true);
        expect(fs.statSync(iconPath).size).toBeGreaterThan(100);

        expect(fs.existsSync(roundPath), `Missing ic_launcher_round in mipmap-${d}`).toBe(true);
        expect(fs.statSync(roundPath).size).toBeGreaterThan(100);

        expect(fs.existsSync(fgPath), `Missing ic_launcher_foreground in mipmap-${d}`).toBe(true);
        expect(fs.statSync(fgPath).size).toBeGreaterThan(100);
      }
    });

    it('should verify splash screens exist for all portrait and landscape orientations', () => {
      const splashFolders = [
        'drawable-land-mdpi', 'drawable-land-hdpi', 'drawable-land-xhdpi', 'drawable-land-xxhdpi', 'drawable-land-xxxhdpi',
        'drawable-port-mdpi', 'drawable-port-hdpi', 'drawable-port-xhdpi', 'drawable-port-xxhdpi', 'drawable-port-xxxhdpi',
        'drawable',
      ];

      for (const folder of splashFolders) {
        const splashPath = path.join(rootDir, `android/app/src/main/res/${folder}/splash.png`);
        expect(fs.existsSync(splashPath), `Missing splash in ${folder}`).toBe(true);
        expect(fs.statSync(splashPath).size).toBeGreaterThan(200);
      }
    });

    it('should have valid .node-version file pinned to Node 22 for fnm', () => {
      const nodeVersionPath = path.join(rootDir, '.node-version');
      expect(fs.existsSync(nodeVersionPath)).toBe(true);
      const content = fs.readFileSync(nodeVersionPath, 'utf8').trim();
      expect(content.startsWith('22')).toBe(true);
    });
  });

  describe('Web Entry & Mobile Meta Sanity', () => {
    it('should have responsive viewport meta tag in index.html', () => {
      const htmlPath = path.join(rootDir, 'index.html');
      expect(fs.existsSync(htmlPath)).toBe(true);

      const html = fs.readFileSync(htmlPath, 'utf8');
      expect(html).toContain('name="viewport"');
      expect(html).toContain('width=device-width');
      expect(html).toContain('viewport-fit=cover');
      expect(html).toContain('id="root"');
      expect(html).toContain('/src/main.tsx');
    });

    it('should have custom screens config in tailwind.config.js for mobile phones', () => {
      const tailwindPath = path.join(rootDir, 'tailwind.config.js');
      const content = fs.readFileSync(tailwindPath, 'utf8');
      expect(content).toContain("'xs'");
    });
  });

  describe('Curriculum & Exercise Quality Sanity', () => {
    it('should have all 149 exercises mapped to valid modules', () => {
      const moduleMap = new Set(MODULES.map(m => m.id));
      for (const ex of EXERCISES) {
        expect(moduleMap.has(ex.module)).toBe(true);
      }
    });

    it('should ensure hints are informative and non-empty when present', () => {
      let hintCount = 0;
      for (const ex of EXERCISES) {
        for (const step of ex.steps) {
          if (step.hints && step.hints.length > 0) {
            hintCount += step.hints.length;
            for (const hint of step.hints) {
              expect(hint.trim().length).toBeGreaterThan(5);
            }
          }
        }
      }
      expect(hintCount).toBeGreaterThan(100);
    });

    it('should ensure all core databases have seeded rows and columns', () => {
      for (const dbKey of ['store', 'company', 'school'] as const) {
        const db = DATABASES[dbKey];
        expect(db).toBeDefined();
        expect(db.tables.length).toBeGreaterThan(0);
        for (const table of db.tables) {
          expect(table.columns.length).toBeGreaterThan(0);
          expect(table.rows.length).toBeGreaterThan(0);
        }
      }
    });

    it('should ensure default playground dataset is populated and ready for immediate query', () => {
      expect(DEFAULT_DATASET_TABLE_NAME).toBe('ecommerce_sales');
      expect(DEFAULT_DATASET_FILENAME).toBe('ecommerce_sales.csv');
      expect(DEFAULT_DATASET_CSV.length).toBeGreaterThan(100);
      expect(DEFAULT_DATASET_CSV).toContain('order_id,order_timestamp');
    });
  });
});
