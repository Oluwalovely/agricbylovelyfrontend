export function photoError(file) {
  if (!file) return 'Select a photo first.'
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return 'Choose a JPEG, PNG or WebP image.'
  if (file.size > 5 * 1024 * 1024) return 'Photo is too large. Choose a file smaller than 5 MB.'
  if (!file.size) return 'This file is empty. Choose another photo.'
  return ''
}
