export type EmailDeliveryFailureReason = 'disabled' | 'missing-api-key' | 'missing-recipient'

export function getEmailDeliveryFailureMessage(reason: EmailDeliveryFailureReason) {
  switch (reason) {
    case 'disabled':
      return 'Email template is disabled'
    case 'missing-api-key':
      return 'RESEND_API_KEY is missing'
    case 'missing-recipient':
      return 'Recipient email is missing'
  }
}

export function getEmailDeliveryErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unknown email delivery error'
}
