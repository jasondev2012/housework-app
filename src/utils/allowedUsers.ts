export const allowedUsers = [
  'paredesjenos23@autonoma.edu.pe',
  'jason.gutierrez.dev@gmail.com',
]

export function isAllowedEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return allowedUsers.includes(email.toLowerCase())
}
