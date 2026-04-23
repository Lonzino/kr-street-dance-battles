import type { Metadata } from "next";
import { GITHUB_REPO_URL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: `${SITE_NAME} 개인정보처리방침`,
};

const EFFECTIVE_DATE = "2026-04-23";
const CONTACT_EMAIL = "luveach@gmail.com";

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <header className="mb-8">
        <h1 className="font-display text-4xl tracking-wide sm:text-5xl">개인정보처리방침</h1>
        <p className="mt-2 text-sm text-muted-foreground">시행일: {EFFECTIVE_DATE}</p>
      </header>

      <Section title="1. 개인정보 수집 항목과 방법">
        <p>{SITE_NAME}(이하 "서비스")는 다음 항목을 수집합니다.</p>
        <ul>
          <li>
            <strong>회원가입·로그인 시</strong> (Kakao/Google OAuth): 이메일, OAuth 제공자 식별자,
            프로필 사진(선택)
          </li>
          <li>
            <strong>프로필 작성 시</strong> (선택): 닉네임, 한 줄 소개, 활동 지역, 주 장르,
            인스타그램 핸들
          </li>
          <li>
            <strong>서비스 이용 중 자동 수집</strong>: 북마크 기록, 알림 설정, 제출한 배틀/크루
            정보, 편집 이력, IP 주소(어뷰즈 방지·rate limit 목적)
          </li>
        </ul>
      </Section>

      <Section title="2. 수집 목적">
        <ul>
          <li>회원 식별 및 로그인</li>
          <li>북마크·알림 등 개인화 기능 제공</li>
          <li>주최자 셀프 등록 시 신원 추적 및 권한 부여</li>
          <li>서비스 어뷰즈 방지 (IP 기반 rate limit)</li>
          <li>이용자 동의에 따른 이메일 알림 발송</li>
        </ul>
      </Section>

      <Section title="3. 보유 및 이용 기간">
        <p>회원 탈퇴 즉시 모든 개인정보는 삭제됩니다 (회원 ID, 프로필, 북마크, 알림 설정 등).</p>
        <p>
          단, 다음 항목은 익명화 후 보존:
          <br />· 셀프 등록한 배틀 정보의 메타데이터 (서비스 무결성 유지)
          <br />· 익명화된 활동 로그 (악용 방지 목적, 6개월)
        </p>
        <p>법령에 따라 보존이 필요한 경우 해당 법령에서 정한 기간 동안 보관합니다.</p>
      </Section>

      <Section title="4. 제3자 제공">
        <p>서비스는 이용자의 개인정보를 외부에 판매·제공하지 않습니다.</p>
        <p>다음 처리 위탁 업체를 사용합니다:</p>
        <ul>
          <li>
            <strong>Supabase</strong> (DB, 인증) — 미국·아시아 리전. 이메일·프로필 데이터 보관.
          </li>
          <li>
            <strong>Vercel</strong> (호스팅) — 글로벌 CDN. IP·접속 로그 일시 보유.
          </li>
          <li>
            <strong>Resend</strong> (이메일 발송) — 알림 메일 발송 시 이메일·발송 로그 보유.
          </li>
          <li>
            <strong>Anthropic</strong> (LLM 추출) — 사용자 제출 텍스트의 배틀 정보 추출. 개인정보
            제외.
          </li>
          <li>
            <strong>Kakao / Google</strong> — OAuth 인증. 인증 토큰 교환에만 사용.
          </li>
        </ul>
      </Section>

      <Section title="5. 이용자 권리">
        <p>이용자는 언제든 다음 권리를 행사할 수 있습니다.</p>
        <ul>
          <li>
            <strong>열람·정정</strong>:{" "}
            <a href="/profile" className="text-accent">
              /profile
            </a>
            에서 직접 조회·수정
          </li>
          <li>
            <strong>삭제 (회원 탈퇴)</strong>:{" "}
            <a href="/profile/delete-account" className="text-accent">
              /profile/delete-account
            </a>
            에서 즉시 삭제
          </li>
          <li>
            <strong>수집·이용 동의 철회</strong>: 회원 탈퇴와 동일 효과
          </li>
          <li>
            <strong>알림 수신 거부</strong>:{" "}
            <a href="/profile/notifications" className="text-accent">
              /profile/notifications
            </a>
          </li>
        </ul>
      </Section>

      <Section title="6. 안전성 확보 조치">
        <ul>
          <li>HTTPS 전송 암호화 (Vercel 자동)</li>
          <li>JWT 쿠키는 HttpOnly + Secure + SameSite=Lax</li>
          <li>OAuth 비밀번호는 Supabase가 관리, 서비스에 저장 안 됨</li>
          <li>데이터베이스 RLS (Row Level Security)로 사용자별 데이터 격리</li>
          <li>관리자 페이지는 별도 인증 + IP rate limit</li>
          <li>
            코드는 오픈소스 (
            <a href={GITHUB_REPO_URL} target="_blank" rel="noreferrer" className="text-accent">
              GitHub
            </a>
            ) — 누구나 검증 가능
          </li>
        </ul>
      </Section>

      <Section title="7. 만 14세 미만 아동">
        <p>서비스는 만 14세 이상 이용자를 대상으로 합니다.</p>
      </Section>

      <Section title="8. 개인정보 보호책임자 및 문의">
        <p>
          이메일:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent">
            {CONTACT_EMAIL}
          </a>
        </p>
      </Section>

      <Section title="9. 변경 고지">
        <p>
          본 방침이 변경되는 경우 홈페이지 및 GitHub Repository를 통해 공지합니다. 중대한 변경 시
          사전 30일 이상 공지합니다.
        </p>
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
