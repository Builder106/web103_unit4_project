import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getItem, updateItem } from '../services/itemsApi'
import { OPTIONS } from '../lib/options.js'
import { previewIcon, totalPrice as computeTotal } from '../lib/pricing.js'
import { isSlipOnLaceStyle, validateSubmission } from '../lib/validation.js'

export default function Edit() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [s, setS] = useState(null)
    const [err, setErr] = useState('')
    const [busy, setBusy] = useState(false)

    useEffect(() => {
        getItem(id)
            .then((row) =>
                setS({
                    name: row.name,
                    upperMaterial: row.upper_material,
                    soleStyle: row.sole_style,
                    laceStyle: row.lace_style,
                    accentTrim: row.accent_trim
                })
            )
            .catch((e) => setErr(e.message))
    }, [id])

    const price = useMemo(() => (s ? computeTotal(s) : 0), [s])
    const icon = useMemo(() => (s ? previewIcon(s.upperMaterial) : '👟'), [s])

    const laceChoices = useMemo(() => {
        if (!s) return OPTIONS.laceStyle
        if (s.soleStyle === 'platform') {
            return OPTIONS.laceStyle.filter((o) => !isSlipOnLaceStyle(o.value))
        }
        return OPTIONS.laceStyle
    }, [s])

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
            await updateItem(id, {
                name: s.name.trim(),
                upperMaterial: s.upperMaterial,
                soleStyle: s.soleStyle,
                laceStyle: s.laceStyle,
                accentTrim: s.accentTrim,
                totalPrice: price,
                previewIcon: icon
            })
            navigate(`/designs/${id}`)
        } catch (e2) {
            setErr(e2.message)
        } finally {
            setBusy(false)
        }
    }

    if (!s) {
        return <p className="muted">{err || 'Loading…'}</p>
    }

    return (
        <div className="edit">
            <h1 className="page-title">Edit {s.name}</h1>
            <form onSubmit={onSubmit} className="form form-narrow">
                <label className="field">
                    <span className="label">Pair name</span>
                    <input name="name" value={s.name} onChange={onChange} />
                </label>
                <label className="field">
                    <span className="label">Upper material</span>
                    <select name="upperMaterial" value={s.upperMaterial} onChange={onChange}>
                        {OPTIONS.upperMaterial.map((o) => (
                            <option key={o.value} value={o.value}>
                                {o.label}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="field">
                    <span className="label">Sole style</span>
                    <select name="soleStyle" value={s.soleStyle} onChange={onChange}>
                        {OPTIONS.soleStyle.map((o) => (
                            <option key={o.value} value={o.value}>
                                {o.label}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="field">
                    <span className="label">Laces</span>
                    <select name="laceStyle" value={s.laceStyle} onChange={onChange}>
                        {laceChoices.map((o) => (
                            <option key={o.value} value={o.value}>
                                {o.label}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="field">
                    <span className="label">Accent trim</span>
                    <select name="accentTrim" value={s.accentTrim} onChange={onChange}>
                        {OPTIONS.accentTrim.map((o) => (
                            <option key={o.value} value={o.value}>
                                {o.label}
                            </option>
                        ))}
                    </select>
                </label>
                {err ? <p className="error">{err}</p> : null}
                <div className="row">
                    <button type="submit" className="btn btn-primary" disabled={busy}>
                        {busy ? 'Saving…' : 'Update pair'}
                    </button>
                    <Link to={`/designs/${id}`} className="btn btn-ghost">
                        Cancel
                    </Link>
                </div>
            </form>
            <div className={`preview-swatch preview-swatch--${s.accentTrim} edit-preview`}>
                <span className="preview-icon">{icon}</span>
                <span className="preview-inline">${price}</span>
            </div>
        </div>
    )
}
