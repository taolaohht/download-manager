//! English-only text for shell surfaces (tray menu and notifications).
//!
//! The UI's persisted language preference is still accepted, but this release ships en-US only.
use std::sync::RwLock;

static LANGUAGE: RwLock<String> = RwLock::new(String::new());

/// Remembers the UI language; returns whether it changed.
pub fn set_language(code: &str) -> bool {
    let mut lang = LANGUAGE.write().unwrap_or_else(|e| e.into_inner());
    let normalized = if code.eq_ignore_ascii_case("en") || code.eq_ignore_ascii_case("en-US") { "en" } else { "en" };
    if *lang == normalized {
        return false;
    }
    *lang = normalized.to_string();
    true
}

/// Returns the en-US source string with `{name}` placeholders filled in.
pub fn tr(key: &str, vars: &[(&str, &str)]) -> String {
    let mut text = key.replace("Prism", "12e downloader");
    for (name, value) in vars {
        text = text.replace(&format!("{{{name}}}"), value);
    }
    text
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn shell_text_is_english_and_brand_is_replaced() {
        set_language("vi");
        assert_eq!(tr("Open Prism", &[]), "Open 12e downloader");
        assert_eq!(tr("{name} has no more downloads.", &[("name", "Queue")]), "Queue has no more downloads.");
    }
}
