import HeaderInner from './HeaderInner'
import { getSettings } from '../lib/data'

export default async function SiteHeader({ active }) {
  const s = await getSettings()
  return <HeaderInner active={active} joinEnabled={s.join_enabled} joinUrl={s.join_url} />
}
