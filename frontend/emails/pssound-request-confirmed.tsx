import {PsstFormEmail} from './psst-form-email'
import {getPreviewEmailProps} from './render-preview'

const previewProps = await getPreviewEmailProps('pssoundRequestApproved')

export function PssoundRequestConfirmedEmail() {
  return <PsstFormEmail {...previewProps} />
}

export default function PreviewEmail() {
  return <PsstFormEmail {...previewProps} />
}
