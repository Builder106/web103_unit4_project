import test from 'node:test'
import assert from 'node:assert/strict'
import { isInvalidCombo, validateSubmission } from './validation.js'

test('platform + no laces is invalid', () => {
    assert.equal(isInvalidCombo({ soleStyle: 'platform', laceStyle: 'none' }), true)
    assert.equal(isInvalidCombo({ soleStyle: 'platform', laceStyle: 'elastic' }), true)
    assert.equal(isInvalidCombo({ soleStyle: 'classic', laceStyle: 'none' }), false)
})

test('validateSubmission messages', () => {
    assert.equal(validateSubmission({ name: '', soleStyle: 'classic', laceStyle: 'flat' }), 'Give your pair a name.')
    assert.equal(
        validateSubmission({ name: 'Test', soleStyle: 'platform', laceStyle: 'none' }),
        'Platform soles need laces for a secure fit.'
    )
    assert.equal(
        validateSubmission({ name: 'Test', soleStyle: 'platform', laceStyle: 'elastic' }),
        'Platform soles need laces for a secure fit.'
    )
    assert.equal(validateSubmission({ name: 'Test', soleStyle: 'platform', laceStyle: 'flat' }), '')
})
