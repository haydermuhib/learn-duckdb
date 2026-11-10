# F-Droid & IzzyOnDroid Comprehensive Inclusion & Inspection Rules

This document outlines the exact rules, standards, security audits, and inspection workflows required for publishing and maintaining an Android app on **F-Droid** and **IzzyOnDroid**.

---

## 1. Multi-Level App Inspection Comparison

| Inspection Phase | Official F-Droid (`fdroiddata`) | IzzyOnDroid (`repodata`) |
|---|---|---|
| **Compilation** | Builds 100% from public source code on Debian runners | Pulls pre-built release APK from GitHub Releases |
| **Malware Audit** | Full source code review & reproducible build verification | Automated **VirusTotal** scan across 60–70+ antivirus engines |
| **Privacy & Trackers** | Linter verifies zero proprietary telemetry SDKs | **Exodus Privacy** scans compiled bytecode for tracker signatures |
| **Age Requirement** | **Strict 3-month active development rule** (or proven users) | No 3-month waiting period |
| **AI / LLM Code** | Evaluated on verifiable FLOSS license, clean source & reproducible build | **Strictly opposes/rejects** apps created with generative AI tools |
| **Network in Build** | Network is **severed** during the Gradle build step | N/A (downloads pre-built APK) |
| **Size Limit** | No hard limit (ABI split recommended if large) | **Hard 30 MB maximum APK size** |

---

## 2. Policy Requirements & The AI / LLM Distinction

### 2.1 Generative AI Policy Split
- **IzzyOnDroid**: Maintains an explicit policy prohibiting apps generated fully or in part by generative AI tools, citing copyright training data concerns and license purity guarantees. Disclosing substantial AI generation results in automatic rejection.
- **Official F-Droid**: Evaluates submissions based on objective, auditable software standards:
  - 100% FLOSS licensing (MIT, Apache-2.0, GPL, etc.).
  - Reproducible source compilation in an isolated Debian build environment.
  - Zero proprietary blobs or closed-source libraries.
  - Proof of active development and user utility.

### 2.2 F-Droid Quality Control (The 3-Month Rule)
> **"The application should have been actively developed for at least 3 months, unless:**
> 1. *The application has been proven to have some users.*
> 2. *The author has been maintaining other apps on F-Droid.*
> 3. *The application is developed only for an event."*

- **If an app is newer than 3 months**:
  - The developer must document demonstrable existing users (web traffic, active community, GitHub stars) in the MR description.
  - Otherwise, maintain steady periodic commits and releases across the 3-month span before opening/reopening the MR.

### 2.3 Free Software Requirements (FLOSS)
- **Zero Proprietary Blobs**: Absolutely no Google Play Services, Firebase Analytics, Crashlytics, or proprietary ad/tracking SDKs.
- **No Dynamic Binary Downloads**: The app must not download executable code, plugins, or auto-updaters without explicit opt-in user consent.
- **Website Wrappers**: Web-based apps must provide native enhancements (offline storage, device APIs). A bare WebView wrapper with no native added value is rejected.

---

## 3. Local Pre-Submission Audit Commands

Run these checks locally to ensure the repository passes all automated and manual inspections:

### 3.1 Git Tree & Source Code Audit
```bash
# 1. Verify no compiled binaries are committed into git (Must return empty)
git ls-files | grep -E '\.(jar|aar|so|dex|class|apk|aab|exe|dll)$'

# 2. Verify no proprietary tracking SDKs are imported (Must return empty)
grep -rnE "(com\.google\.android\.gms|com\.google\.firebase|com\.crashlytics|appsflyer|adjust\.sdk)" \
  --exclude-dir={node_modules,dist,build,.gradle} .

# 3. Check for CRLF line endings (F-Droid requires LF only)
file fdroid/*.yml | grep CRLF && echo "Error: Convert to UNIX LF line endings"
```

### 3.2 Compiled APK Inspection
```bash
# 1. Audit requested permissions (Ensure zero suspicious or unneeded permissions)
aapt dump badging android/app/build/outputs/apk/release/app-release.apk | grep "uses-permission"

# 2. Verify APK signing scheme
apksigner verify --verbose android/app/build/outputs/apk/release/app-release.apk

# 3. Verify APK file size (< 30MB)
ls -lh android/app/build/outputs/apk/release/app-release.apk
```

---

## 4. Upstream Fastlane Metadata Hierarchy

Place metadata under `fastlane/metadata/android/<locale>/`:
```
fastlane/metadata/android/en-US/
├── title.txt                  # App title (max 30 chars)
├── short_description.txt      # Brief summary (max 80 chars)
├── full_description.txt       # Detailed markdown description
├── icon.png                   # 512x512 PNG app icon (square, NO rounded corners or squircle mask)
├── featureGraphic.png         # 1024x500 banner (optional)
├── changelogs/
│   └── <versionCode>.txt      # Must match current versionCode in build.gradle
└── phoneScreenshots/          # 1080x1920 or modern aspect ratio PNGs
```

> **CRITICAL RULE**: When Fastlane metadata exists upstream, **do NOT** include `Summary:` or `Description:` in the F-Droid recipe YAML file (`metadata/<appId>.yml`). F-Droid extracts them automatically.

---

## 5. F-Droid Recipe YAML (`metadata/<appId>.yml`)

```yaml
Categories:
  - Development
  - Education
License: MIT
AuthorName: Hayder Muhib
SourceCode: https://github.com/haydermuhib/learn-duckdb
IssueTracker: https://github.com/haydermuhib/learn-duckdb/issues
Changelog: https://github.com/haydermuhib/learn-duckdb/releases

RepoType: git
Repo: https://github.com/haydermuhib/learn-duckdb.git

Builds:
  - versionName: 1.5.0
    versionCode: 6
    commit: 948f0f788144976872be388475fea19435694163
    subdir: android/app
    nodejs: yes
    prebuild:
      - npm ci
      - npm run build
      - npx cap sync android
    gradle:
      - assembleRelease

AutoUpdateMode: Version v%v
UpdateCheckMode: Tags
```

### Recipe Invariants:
1. **Full 40-Character Commit Hash**: Always use the full SHA. Never use tags or branch names.
2. **Single Build Block Before Merge**: Only include the latest release version before the MR is merged.
3. **LF Line Endings**: Unix newlines (`\n`) only.
4. **Valid YAML**: 2-space indentation. No tabs.

---

## 6. GitLab Merge Request Protocol

- **MR Title**: `New app: <applicationId> (<App Display Name>)`
- **MR Description**: Must follow `.gitlab/merge_request_templates/Default.md` without deleting any section.
- **Personal Fork Pipelines**: Expected to fail due to GitLab's runner quota on personal forks. Do not pay. F-Droid triggers CI on the upstream repository under their open-source FOSS runner allocation.
- **Labels Progression**: Maintainers apply the `New App` label once initial template compliance is verified, routing the app into the automated build queue.
