/** "kekema@icloud.com" → "kek***@icloud.com". 아이디 앞 3글자만 남기고 가린다. */
export function maskEmail(email: string) {
  const [id, domain] = email.split('@')
  if (!domain) return email
  return `${id.slice(0, 3)}***@${domain}`
}
