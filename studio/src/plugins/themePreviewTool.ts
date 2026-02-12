import {ColorWheelIcon} from '@sanity/icons'
import {definePlugin} from 'sanity'
import ThemePreviewTool from '../components/ThemePreviewTool'

export const themePreviewTool = definePlugin({
  name: 'theme-preview-tool',
  tools: (prev) => [
    ...prev,
    {
      name: 'theme-preview',
      title: 'Theme Preview',
      icon: ColorWheelIcon,
      component: ThemePreviewTool,
    },
  ],
})
