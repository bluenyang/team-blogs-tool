# Changesets

이 디렉터리의 마크다운 파일은 패키지 변경 기록입니다.

```bash
pnpm changeset          # 변경 기록 추가
pnpm version-packages   # 버전 bump + CHANGELOG
pnpm release            # publish
```

publish 대상: `packages/*`  
ignore: `apps/template-blog` (private 앱)
