# F-Droid Inclusion Rules & Submission Blueprint

This document outlines the exact rules, standards, and workflow required to successfully publish and maintain an Android app on the official **F-Droid** repository (`fdroid/fdroiddata`), based directly on F-Droid's official Inclusion Policy and Quality Control guidelines.

---

## 1. Quality Control & The 3-Month Development Rule

F-Droid enforces quality gates to prevent abandoned apps from entering the main index:

### 1.1 The 3-Month Rule
> **"The application should have been actively developed for at least 3 months, unless:**
> 1. *The application has been proven to have some users.*
> 2. *The author has been maintaining other apps on F-Droid.*
> 3. *The application is developed only for an event."*

- **If an app is newer than 3 months**:
  - Provide evidence of existing active users (web platform traffic, community usage, active discussions/issues) in the MR description.
  - Or distribute via **IzzyOnDroid** (`apt.izzysoft.de/fdroid`) during the initial 3 months, then graduate to the main F-Droid repository.
  - Or continue tagging active release commits on GitHub and reopen the MR once 3 months of commits have elapsed.

### 1.2 Quality Standards
- **Active Maintenance**: The author must commit to ongoing maintenance. Demo applications or abandoned experiments are rejected.
- **Website Wrappers**: Any app wrapping a web application must provide genuine native enhancements (offline storage, device APIs, native UI integration). A bare web wrapper with no native added value is rejected.
- **Unique Value**: Minor rebrandings or forks without substantive improvements over existing catalog apps are rejected.

---

## 2. Free Software Requirements (FLOSS)

- **100% FLOSS License**: Must use an OSI- or FSF-approved license (MIT, Apache 2.0, GPL, etc.).
- **Zero Proprietary Blobs**:
  - Absolutely no Google Play Services, Firebase Analytics, Crashlytics, or proprietary ad/tracking SDKs.
- **Dependency Toolchain**:
  - Builds must compile on Debian using OpenJDK and FLOSS toolchains. Proprietary build tools (e.g. Oracle JDK) are strictly forbidden.
  - Allowed prebuilts: Trusted Maven repositories (Maven Central, Google Maven, JitPack, Clojars), Node.js, PyPI wheels, Rust/Cargo, official Android/Flutter SDKs.
- **No Dynamic Binary Downloads**: The app must not download additional executable code (plugins, dynamic code, self-updaters) without explicit opt-in user consent warning that F-Droid checks are bypassed.

---

## 3. Upstream Fastlane Metadata Structure

Place metadata under `fastlane/metadata/android/<locale>/`:
```
fastlane/metadata/android/en-US/
├── title.txt                  # App title (max 30 chars recommended)
├── short_description.txt      # Summary displayed in list views (max 80 chars)
├── full_description.txt       # Detailed markdown / formatted description
├── icon.png                   # 512x512 PNG app icon (no corner rounding or squircle masks)
├── featureGraphic.png         # 1024x500 banner (optional)
├── changelogs/
│   ├── 1.txt                  # Changelog for versionCode 1
│   ├── 5.txt                  # Changelog for versionCode 5
│   └── 6.txt                  # Changelog for versionCode 6 (latest)
├── phoneScreenshots/          # 1080x1920 or modern aspect ratio PNGs
└── sevenInchScreenshots/      # Tablet screenshots (optional)
```

> **RULE**: When Fastlane metadata exists upstream, **do NOT** add `Summary:` or `Description:` in the F-Droid recipe YAML file (`metadata/<appId>.yml`). F-Droid extracts them automatically.

---

## 4. F-Droid Recipe YAML (`metadata/<appId>.yml`)

The recipe lives in `metadata/<applicationId>.yml` in `fdroid/fdroiddata`.

### 4.1 Strict Recipe Rules
1. **Full 40-Character Commit Hash**: The `commit:` field **must** be the full SHA (never use tag names or branch names).
2. **Only the Latest Version Before Merge**: Keep **only one build block** (the latest version). Older versions are added automatically by the update bot after inclusion.
3. **LF Line Endings**: The file must use UNIX `\n` line endings, never Windows `\r\n`.
4. **Valid YAML**: 2-space indentation. No tab characters.
5. **No Disabled Builds**: Do not include disabled build blocks in new app recipes.

---

## 5. GitLab Merge Request Protocol

### 5.1 Naming & Branching
- **Fork**: `fdroid/fdroiddata` to your personal GitLab account (ensure the fork is public).
- **Branch**: Create branch (e.g., `app.<applicationId>`).
- **MR Title**: Strictly format as:
  ```
  New app: <applicationId> (<App Display Name>)
  ```

### 5.2 Mandatory MR Description Template (`Default.md`)
The MR description must follow `.gitlab/merge_request_templates/Default.md` without deleting any section:
- `## Abstract for new app inclusion`
- `### Please introduce the functions and usage of your app in summary...`
- `### Please elaborate why you wrote this app...` (Highlight user base or 3-month history here)
- Complete `## Checklist` with:
  - `### Policy` (Acknowledge Quality point 6: 3-month development rule)
  - `### Docs`
  - `### Merge Request Setup`
  - `### Metadata`
  - `### Pipeline`

### 5.3 Runner Quotas & Review Labels
- **Personal Fork Pipelines**: Personal GitLab forks often fail CI immediately due to GitLab runner minute limits. **Do not enter credit cards.** F-Droid runs CI under their open-source FOSS quota on the upstream repository once reviewers inspect the MR.
- **Labels**: Maintainers add the `New App` label once the template and initial policy checks pass, routing the MR to the automated build queue.
