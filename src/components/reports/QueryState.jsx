import Button from '../ui/Button.jsx'
import { Message } from '../farm/FarmForm.jsx'
import { apiErrorMessage } from '../../services/api.js'
export default function QueryState({ query, label }) {
  if (query.isPending) return <p role="status" className="text-sm">Loading {label}...</p>
  if (query.error) return <div><Message error>{apiErrorMessage(query.error)}</Message><Button variant="secondary" onClick={() => query.refetch()}>Retry {label}</Button></div>
  return null
}
