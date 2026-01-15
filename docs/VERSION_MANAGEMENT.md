# Version Management

## Versioning Scheme
- Semantic Versioning (SemVer): `MAJOR.MINOR.PATCH`
  - `MAJOR`: Incompatible API changes or major UI redesigns
  - `MINOR`: Backward-compatible functionality additions
  - `PATCH`: Backward-compatible bug fixes

## Release Process
1. Update version in `package.json`
2. Update version display in `src/pages/Settings.tsx`
3. Commit and Tag
4. Build for targets (Web, Android, iOS)

## Current Version
- **v0.0.0** (Alpha/Dev)
