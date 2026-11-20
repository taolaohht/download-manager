import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const chromium = JSON.parse(
  readFileSync(new URL('../build/chromium/manifest.json', import.meta.url), 'utf8'),
) as Record<string, any>;
const firefox = JSON.parse(
  readFileSync(new URL('../build/firefox/manifest.json', import.meta.url), 'utf8'),
) as Record<string, any>;
const chromiumPublicKey = readFileSync(new URL('../keys/public-key.txt', import.meta.url), 'utf8').trim();

function expect12eIdentity(manifest: Record<string, any>) {
  expect(manifest.name).toBe('12e downloader');
  expect(manifest.short_name).toBe('12e');
  expect(manifest.description).toContain('12e downloader');
  for (const field of [manifest.name, manifest.short_name, manifest.description]) {
    expect(field).not.toMatch(/\bpro\b/i);
  }
}

describe('published browser manifests', () => {
  it('uses the 12e identity and stable Prism-era Chromium key for Chrome and Edge', () => {
    expect12eIdentity(chromium);
    expect(chromium.key).toBe(chromiumPublicKey);
    expect(chromium.permissions).toContain('nativeMessaging');
    expect(chromium.background.service_worker).toBe('background.js');
    expect(chromium.minimum_chrome_version).toBe('116');
  });

  it('keeps the Firefox add-on ID and legacy native-messaging compatibility', () => {
    expect12eIdentity(firefox);
    expect(firefox.browser_specific_settings.gecko.id).toBe('prism@prismdl.site');
    expect(firefox.browser_specific_settings.gecko.strict_min_version).toBe('140.0');
    expect(firefox.permissions).toContain('nativeMessaging');
    expect(firefox.permissions).toContain('webRequestBlocking');
    expect(firefox.background.scripts).toContain('background.js');
  });
});
