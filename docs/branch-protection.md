# Branch Protection 설정 가이드

> 이 문서는 **운영자가 GitHub UI에서 직접 세팅**하는 항목을 정리한 것. 코드로 자동 적용 불가.

## 왜 필요한가

- `main` 브랜치 실수 push·force push 차단
- CI(lint/validate-data/build) 통과 전 merge 방지
- 기여자가 PR 보내는 경로 통일 (CI 캐치 → 리뷰 → merge)

## 설정 경로

`Settings` → `Branches` → `Branch protection rules` → `Add rule`

## 권장 규칙 (for `main`)

### ✅ 필수

- [x] **Branch name pattern**: `main`
- [x] **Require a pull request before merging**
  - [x] Require approvals: `0` (1인 개발 시) 또는 `1`
  - [x] Dismiss stale pull request approvals when new commits are pushed
  - [ ] Require review from Code Owners (CODEOWNERS 있어도 1인이면 skip 가능)
- [x] **Require status checks to pass before merging**
  - [x] Require branches to be up to date before merging
  - [x] Status checks that are required:
    - `build` (CI 워크플로우의 job 이름)
- [x] **Require conversation resolution before merging**
- [x] **Do not allow bypassing the above settings** (본인도 예외 없음 — 일관성 up)

### 🔒 강화 (선택)

- [ ] Require signed commits — GPG·SSH 서명
- [x] **Require linear history** (merge commit 대신 squash/rebase만)
- [x] **Do not allow deletions**
- [x] **Do not allow force pushes**

### ⚠️ 예외 허용이 필요한 경우

Release Please PR은 봇이 직접 `main`에 PR 생성 후 머지하는 흐름. 기본 설정에서는 `github-actions[bot]`도 리뷰 필요. 대응:

- **옵션 A**: 봇이 만든 PR을 본인이 수동 approve (가장 안전)
- **옵션 B**: `Allow specified actors to bypass required pull requests`에 `github-actions[bot]` 추가

## 적용 후 워크플로우

본인 포함 누구든:

```bash
git checkout -b data/add-new-battle
# 작업 + 커밋
git push origin data/add-new-battle
# GitHub에서 PR 생성 → CI 통과 → merge
```

`main`에 직접 push 시도하면 GitHub가 거부.

## 롤백

설정이 과해서 운영 방해되면 같은 경로에서 `Edit` → 항목 체크 해제 또는 `Delete` 룰.

## 관련 문서

- [GitHub Docs: About protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [GitHub Docs: Managing a branch protection rule](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule)
