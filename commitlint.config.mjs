/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat", // 기능 추가
        "fix", // 버그 수정
        "data", // 배틀/크루 데이터 추가·수정
        "docs", // 문서
        "chore", // 빌드·설정·의존성
        "refactor", // 동작 변경 없는 리팩터
        "test", // 테스트
        "style", // 포매팅 (코드 의미 변경 없음)
        "perf", // 성능
        "ci", // CI/CD
        "revert", // 되돌리기
      ],
    ],
    "subject-case": [0], // 한글 subject 허용
    "header-max-length": [2, "always", 100],
  },
};
