import {PsstFormEmail} from './psst-form-email'
import {getPreviewEmailProps} from './render-preview'

const previewProps = await getPreviewEmailProps('workshopReceived')

export function WorkshopConfirmationEmail() {
  return <PsstFormEmail {...previewProps} />
}

export default function PreviewEmail() {
  return <PsstFormEmail {...previewProps} />
}
