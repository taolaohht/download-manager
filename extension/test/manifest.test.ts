import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const chromium = JSON.parse(
  readFileSync(new URL('../build/chromium/manifest.json', import.meta.url), 'utf8'),
) as Record<string, any>;
const firefox = JSON.parse(
  readFileSync(new URL('../build/firefox/manifest.json', import.meta.url), 'utf8'),
) as Record<string, any>;

describe('published browser manifests', () => {
  it('uses the 12e identity and stable Prism-era Chromium key for Chrome and Edge', () => {
    expect(chromium.name).toBe('12e downloader');
    expect(chromium.short_name).toBe('12e');
    expect(chromium.key).toBeTruthy();
    expect(chromium.permissions).toContain('nativeMessaging');
    expect(chromium.background.service_worker).toBe('background.js');
    expect(chromium.name).not.toMatch(/\\bpro\\b/i);
  });

  it('keeps the Firefox add-on ID and legacy native-messaging compatibility', () => {
    expect(firefox.name).toBe('12e downloader');
    expect(firefox.browser_specific_settings.gecko.id).toBe('prism@prismdl.site');
    expect(firefox.permissions).toContain('nativeMessaging');
    expect(firefox.permissions).toContain('webRequestBlocking');
    expect(firefox.background.scripts).toContain('background.js');
    expect(firefox.name).not.toMatch(/\\bpro\\b/i);
  });
});
