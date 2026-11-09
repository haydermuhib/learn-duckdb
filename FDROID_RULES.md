# F-Droid Inclusion Rules & Submission Blueprint

This document outlines the exact rules, standards, and workflow required to successfully publish and maintain an Android app on the official **F-Droid** repository (`fdroid/fdroiddata`).

---

## 1. Upstream Repository Requirements

### 1.1 Licensing & Freedom
- **100% Free and Open Source (FLOSS)**: App and all dependencies must be under an OSI- or FSF-approved license (e.g., MIT, Apache 2.0, GPLv3).
- **Zero Proprietary Blobs**:
  - No closed-source SDKs (e.g., Google Play Services, Firebase Analytics, Crashlytics, proprietary ad networks, or tracking SDKs).
  - No pre-compiled `.jar`, `.aar`, `.so`, or `.dex` binaries checked into git unless built from auditable source or approved srclibs.
- **Privacy & Telemetry**:
  - Zero non-consensual tracking or telemetry. Any analytics must be opt-in by default and use free software backends.

### 1.2 Fastlane Metadata Structure
Place metadata in the root under `fastlane/metadata/android/<locale>/`:
```
fastlane/metadata/android/en-US/
├── title.txt                  # App title (max 30 chars recommended)
├── short_description.txt      # Summary displayed in list views (max 80 chars)
├── full_description.txt       # Detailed markdown / formatted description
├── icon.png                   # 512x512 PNG app icon (no transparency around squircle)
├── featureGraphic.png         # 1024x500 banner (optional but recommended)
├── changelogs/
│   ├── 1.txt                  # Changelog for versionCode 1
│   ├── 5.txt                  # Changelog for versionCode 5
│   └── 6.txt                  # Changelog for versionCode 6 (latest)
├── phoneScreenshots/          # 1080x1920 or modern phone aspect ratio PNGs
└── sevenInchScreenshots/      # Tablet screenshots (optional)
```
> **Rule**: When Fastlane metadata exists upstream, **do NOT** add `Summary:` or `Description:` in the F-Droid recipe YAML file (`metadata/<appId>.yml`). F-Droid extracts them directly from Fastlane.

### 1.3 Git Hygiene & Release Tagging
- **Semantic Version Tags**: Every release must have an annotated or standard git tag matching the version pattern (e.g., `v1.5.0`).
- **Matching `versionName` & `versionCode`**: The `versionName` in `build.gradle` must match the git tag, and `versionCode` must increment monotonically.
- **Commit History**: Release commits must be pushed to upstream remotes before triggering F-Droid inclusion or updates.

---

## 2. F-Droid Recipe YAML (`metadata/<appId>.yml`)

The recipe lives in `metadata/<applicationId>.yml` in the `fdroid/fdroiddata` repository.

### 2.1 Essential Recipe Structure (Web / Hybrid / Capacitor App Example)
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

### 2.2 Strict YAML & Recipe Rules
1. **Full 40-Character Commit Hash**: The `commit:` field **must** be the full SHA (e.g. `948f0f788144976872be388475fea19435694163`). Never use a tag name, branch name, or short 7-character hash.
2. **Only the Latest Version**: Before an MR is merged, keep **only one build block** (the latest version). Do not leave older versions in the recipe.
3. **LF Line Endings**: The file must use UNIX `\n` line endings, never Windows `\r\n`.
4. **Valid YAML**: Indentation must be exactly 2 spaces. No tab characters.
5. **No Disabled Builds**: Never submit disabled build entries in a new app recipe.

---

## 3. GitLab Merge Request Protocol

### 3.1 Naming & Branching
- **Fork**: `fdroid/fdroiddata` to your personal GitLab account (make sure the fork is public).
- **Branch**: Create a descriptive branch (e.g., `app.learnduckdb`).
- **MR Title**: Must strictly follow:
  ```
  New app: <applicationId> (<App Display Name>)
  ```
  *Example*: `New app: app.learnduckdb (Learn DuckDB)`

### 3.2 Exact MR Template (`Default.md`)
F-Droid maintainers will close MRs automatically if the template is stripped.
The MR description must include:
- `## Abstract for new app inclusion`
- `### Please introduce the functions and usage of your app in summary...`
- `### Please elaborate why you wrote this app...`
- Complete `## Checklist` with:
  - `### Policy`
  - `### Docs`
  - `### Merge Request Setup`
  - `### Metadata`
  - `### Pipeline`

### 3.3 CI Pipeline & Labels
- **Fork CI Runner Quotas**: Personal GitLab forks often fail CI immediately because GitLab restricts free runner minutes on personal accounts. **Do not enter credit cards or panic.**
- **Upstream FOSS Runners**: F-Droid runs CI under GitLab's FOSS program on `fdroid/fdroiddata`. Once maintainers review the template and add the **`New App`** label, CI is executed on upstream infrastructure.
- **Labels Progression**:
  - `New App`: Added by maintainers after template verification. Means the app is accepted into review and the build queue.
  - Bot checks: Automated builds will test building from source.

---

## 4. Android Build & UI Checklist for Quality

1. **System Bar Insets (Edge-to-Edge)**:
   - Handle Android 14/15 edge-to-edge enforcement.
   - Use CSS `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)`.
   - Never let touch targets or status text clip under the camera notch or bottom navigation gesture bar.
2. **Icon & Squircle Boundaries**:
   - Adaptive icons must center graphics within the 66dp / 50% safe zone to prevent launcher cutoffs.
3. **Splash Screen Aspect Ratio**:
   - Never set a raw bitmap directly as `android:windowBackground`.
   - Use a `layer-list` with `<bitmap android:gravity="center" />` to prevent vertical or horizontal distortion.
4. **Signing Configurations**:
   - Set up standard `signingConfigs.release` in Gradle.
   - For reproducible builds, reference `f-droid.org/docs/Reproducible_Builds`.
