import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createItem } from '../services/itemsApi'
import { DEFAULT_SELECTION, OPTIONS } from '../lib/options.js'
import { previewIcon, totalPrice as computeTotal } from '../lib/pricing.js'
import { isSlipOnLaceStyle, validateSubmission } from '../lib/validation.js'

export default function Designer() {
    const navigate = useNavigate()
    const [s, setS] = useState(DEFAULT_SELECTION)
    const [err, setErr] = useState('')
    const [busy, setBusy] = useState(false)

    const price = useMemo(() => computeTotal(s), [s])
    const icon = useMemo(() => previewIcon(s.upperMaterial), [s.upperMaterial])

    const laceChoices = useMemo(() => {
        if (s.soleStyle === 'platform') {
            return OPTIONS.laceStyle.filter((o) => !isSlipOnLaceStyle(o.value))
        }
        return OPTIONS.laceStyle
    }, [s.soleStyle])

    const onChange = (e) => {
        const { name, value } = e.target
        const next = { ...s, [name]: value }
        if (name === 'soleStyle' && value === 'platform' && isSlipOnLaceStyle(s.laceStyle)) {
            next.laceStyle = 'flat'
        }
        setS(next)
        setErr('')
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        const msg = validateSubmission(s)
        if (msg) {
            setErr(msg)
            return
        }
        setBusy(true)
        try {
            const row = await createItem({
                name: s.name.trim(),
                upperMaterial: s.upperMaterial,
                soleStyle: s.soleStyle,
                laceStyle: s.laceStyle,
                accentTrim: s.accentTrim,
                totalPrice: price,
                previewIcon: icon
            })
            navigate(`/designs/${row.id}`)
        } catch (e2) {
            setErr(e2.message)
        } finally {
            setBusy(false)
        }
    }

    const trimClass = `preview-swatch preview-swatch--${s.accentTrim}`

    return (
        <div className="designer">
            <section className="panel panel-form">
                <p className="eyebrow">Custom sneakers</p>
                <h1 className="title">Design your one-of-one pair</h1>
                <p className="lede">Pick materials, sole, laces, and trim. Price updates as you go.</p>
                <form onSubmit={onSubmit} className="form">
                    <label className="field">
                        <span className="label">Pair name</span>
                        <input
                            name="name"
                            value={s.name}
                            onChange={onChange}
                            placeholder="Sunset Stride"
                            autoComplete="off"
                        />
                    </label>
                    <label className="field">
                        <span className="label">Upper material</span>
                        <select name="upperMaterial" value={s.upperMaterial} onChange={onChange}>
                            {OPTIONS.upperMaterial.map((o) => (
                                <option key={o.value} value={o.value}>
                                    {o.label} (+${o.price})
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="field">
                        <span className="label">Sole style</span>
                        <select name="soleStyle" value={s.soleStyle} onChange={onChange}>
                            {OPTIONS.soleStyle.map((o) => (
                                <option key={o.value} value={o.value}>
                                    {o.label} (+${o.price})
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="field">
                        <span className="label">Laces</span>
                        <select name="laceStyle" value={s.laceStyle} onChange={onChange}>
                            {laceChoices.map((o) => (
                                <option key={o.value} value={o.value}>
                                    {o.label} (+${o.price})
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="field">
                        <span className="label">Accent trim</span>
                        <select name="accentTrim" value={s.accentTrim} onChange={onChange}>
                            {OPTIONS.accentTrim.map((o) => (
                                <option key={o.value} value={o.value}>
                                    {o.label} (+${o.price})
                                </option>
                            ))}
                        </select>
                    </label>
                    {s.soleStyle === 'platform' ? (
                        <p className="hint">Slip-on is disabled with platform soles so the build stays wearable.</p>
                    ) : null}
                    {err ? <p className="error">{err}</p> : null}
                    <button type="submit" className="btn btn-primary" disabled={busy}>
                        {busy ? 'Saving…' : 'Save to collection'}
                    </button>
                </form>
            </section>
            <section className="panel panel-preview">
                <p className="eyebrow">Live preview</p>
                <div className={trimClass}>
                    <div className="preview-icon">{icon}</div>
                    <h2 className="preview-name">{s.name || 'Untitled pair'}</h2>
                    <ul className="preview-list">
                        <li>Upper: {s.upperMaterial}</li>
                        <li>Sole: {s.soleStyle}</li>
                        <li>Laces: {s.laceStyle}</li>
                        <li>Trim: {s.accentTrim}</li>
                    </ul>
                    <p className="preview-price">${price}</p>
                </div>
            </section>
        </div>
    )
}
