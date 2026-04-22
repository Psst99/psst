import {PsstFormEmail} from './psst-form-email'
import {getPreviewEmailProps} from './render-preview'

const previewProps = await getPreviewEmailProps('workshopApproved')

export function WorkshopApprovedEmail() {
  return <PsstFormEmail {...previewProps} />
}

export default function PreviewEmail() {
  return <PsstFormEmail {...previewProps} />
}
