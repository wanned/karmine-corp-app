export function safeJsonParse(...params: Parameters<typeof JSON.parse>) {
  try {
    return { data: JSON.parse(...params), success: true } as const
  } catch {
    return { success: false } as const
  }
}
