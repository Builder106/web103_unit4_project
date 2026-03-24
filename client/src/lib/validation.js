export const SLIP_ON_LACE_STYLES = new Set(['none', 'elastic'])

export const isSlipOnLaceStyle = (laceStyle) => SLIP_ON_LACE_STYLES.has(laceStyle)

export const isInvalidCombo = (selection) =>
    selection.soleStyle === 'platform' && isSlipOnLaceStyle(selection.laceStyle)

export const validateSubmission = (selection) => {
    if (!selection.name || !selection.name.trim()) {
        return 'Give your pair a name.'
    }
    if (isInvalidCombo(selection)) {
        return 'Platform soles need laces for a secure fit.'
    }
    return ''
}
