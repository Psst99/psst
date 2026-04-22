import {PsstFormEmail} from './psst-form-email'
import {getPreviewEmailProps} from './render-preview'

const previewProps = await getPreviewEmailProps('resourceApproved')

export function ResourceApprovedEmail() {
  return <PsstFormEmail {...previewProps} />
}

export default function PreviewEmail() {
  return <PsstFormEmail {...previewProps} />
}
