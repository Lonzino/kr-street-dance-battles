import type { Metadata } from "next";
import { GITHUB_REPO_URL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "이용약관",
  description: `${SITE_NAME} 서비스 이용약관`,
};

const EFFECTIVE_DATE = "2026-04-23";

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <header className="mb-8">
        <h1 className="font-display text-4xl tracking-wide sm:text-5xl">이용약관</h1>
        <p className="mt-2 text-sm text-muted-foreground">시행일: {EFFECTIVE_DATE}</p>
      </header>

      <Section title="1. 목적">
        <p>
          본 약관은 {SITE_NAME}(이하 "서비스")가 제공하는 한국 스트릿 댄스 배틀 정보 아카이브 및
          관련 부가 서비스의 이용 조건을 규정합니다.
        </p>
      </Section>

      <Section title="2. 서비스 내용">
        <ul>
          <li>국내 스트릿 댄스 배틀 일정·결과 정보 제공</li>
          <li>크루·댄서 디렉토리</li>
          <li>북마크, 이메일 알림, 캘린더 구독 기능</li>
          <li>주최자의 배틀 셀프 등록 및 편집</li>
          <li>운영자 검토 큐를 통한 정보 큐레이션</li>
        </ul>
      </Section>

      <Section title="3. 회원가입 및 자격">
        <ul>
          <li>만 14세 이상 누구나 회원가입 가능</li>
          <li>Kakao 또는 Google OAuth로 로그인</li>
          <li>1인 1계정 원칙</li>
          <li>타인의 정보·계정 도용 금지</li>
        </ul>
      </Section>

      <Section title="4. 정보 등록 책임">
        <p>이용자가 등록한 정보의 정확성·합법성에 대한 책임은 등록자에게 있습니다.</p>
        <ul>
          <li>저작권·초상권 침해 금지 (포스터 이미지 등)</li>
          <li>허위·과장·악의적 정보 등록 금지</li>
          <li>운영자는 부적절한 콘텐츠를 사전 통보 없이 삭제·수정할 수 있습니다</li>
          <li>3회 이상 부적절한 등록 시 계정 영구 정지</li>
        </ul>
      </Section>

      <Section title="5. 데이터 라이선스">
        <p>
          서비스가 제공하는 배틀·크루 데이터(<code>src/data/*.json</code>)는{" "}
          <strong>CC0 (퍼블릭 도메인)</strong>으로 공개됩니다. 누구나 자유롭게 활용 가능합니다.
        </p>
        <p>
          이용자가 등록한 콘텐츠도 동일하게 CC0로 공개되는 것에 동의한 것으로 간주합니다 (단, 포스터
          이미지 등 저작권은 원저작자 소유).
        </p>
      </Section>

      <Section title="6. 금지 행위">
        <ul>
          <li>서비스 안정성을 해치는 행위 (스팸, DDoS, 자동화 어뷰즈)</li>
          <li>API 토큰·관리자 비밀번호 무단 취득·사용</li>
          <li>다른 이용자 사칭·괴롭힘·차별</li>
          <li>법령 위반 행위에 서비스 이용</li>
          <li>크롤링 봇은 robots.txt 준수 필수</li>
        </ul>
      </Section>

      <Section title="7. 회원 탈퇴">
        <p>
          이용자는 언제든{" "}
          <a href="/profile/delete-account" className="text-accent">
            /profile/delete-account
          </a>
          에서 즉시 탈퇴 가능합니다. 탈퇴 시 모든 개인정보는 즉시 삭제되며, 등록한 배틀 정보의
          메타데이터는 익명화 후 서비스에 남습니다.
        </p>
      </Section>

      <Section title="8. 면책">
        <ul>
          <li>천재지변, 외부 서비스(Supabase, Vercel 등) 장애로 인한 손해 면책</li>
          <li>이용자가 등록한 정보의 정확성·신뢰성 보장 안 함</li>
          <li>외부 링크(인스타그램, 공식 사이트 등)의 콘텐츠는 해당 운영자 책임</li>
        </ul>
      </Section>

      <Section title="9. 약관 변경">
        <p>
          본 약관이 변경되는 경우 홈페이지 및 GitHub Repository(
          <a href={GITHUB_REPO_URL} target="_blank" rel="noreferrer" className="text-accent">
            github.com/Lonzino/kr-street-dance-battles
          </a>
          )를 통해 공지합니다. 변경 후 서비스 이용 시 약관에 동의한 것으로 간주합니다.
        </p>
      </Section>

      <Section title="10. 준거법">
        <p>본 약관은 대한민국 법률에 따릅니다.</p>
      </Section>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-base font-bold sm:text-lg">{title}</h2>
      <div className="space-y-2 text-sm leading-relaxed text-foreground/85 [&>ul]:list-disc [&>ul]:space-y-1 [&>ul]:pl-5">
        {children}
      </div>
    </section>
  );
}
