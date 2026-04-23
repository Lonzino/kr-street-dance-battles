import { getSupabaseServerClient, isSupabaseConfigured } from "./server";

export const POSTER_BUCKET = "posters";
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

/**
 * 포스터 이미지를 Supabase Storage에 업로드. 공개 URL 반환.
 *
 * 버킷 'posters'는 사전에 생성 + public read 정책 필요:
 *   create policy "posters_public_read" on storage.objects for select using (bucket_id = 'posters');
 *   create policy "posters_auth_insert" on storage.objects for insert
 *     with check (bucket_id = 'posters' and auth.uid() is not null);
 */
export async function uploadPoster(
  file: File,
  battleSlug: string,
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase가 설정되지 않았습니다." };
  }

  if (file.size > MAX_SIZE) {
    return { ok: false, error: "5MB 이하 이미지만 업로드 가능합니다." };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { ok: false, error: `${file.type}은 지원하지 않습니다 (jpeg/png/webp/gif).` };
  }

  const supabase = await getSupabaseServerClient();
  const ext = file.type.split("/")[1] ?? "jpg";
  const path = `${battleSlug}-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage.from(POSTER_BUCKET).upload(path, file, {
    cacheControl: "31536000",
    contentType: file.type,
    upsert: false,
  });

  if (uploadError) return { ok: false, error: uploadError.message };

  const { data } = supabase.storage.from(POSTER_BUCKET).getPublicUrl(path);
  return { ok: true, url: data.publicUrl };
}
