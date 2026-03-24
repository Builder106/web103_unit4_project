import { pool } from '../config/database.js'

const isSlipOnLaceStyle = (laceStyle) => laceStyle === 'none' || laceStyle === 'elastic'

const hasInvalidCombo = ({ soleStyle, laceStyle }) => soleStyle === 'platform' && isSlipOnLaceStyle(laceStyle)

export const getCars = async (_, res) => {
    try {
        const result = await pool.query('SELECT * FROM custom_items ORDER BY id DESC')
        res.status(200).json(result.rows)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch custom items.' })
    }
}

export const getCarById = async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10)
        const result = await pool.query('SELECT * FROM custom_items WHERE id = $1', [id])

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Custom item not found.' })
        }

        return res.status(200).json(result.rows[0])
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch custom item.' })
    }
}

export const createCar = async (req, res) => {
    try {
        const { name, upperMaterial, soleStyle, laceStyle, accentTrim, totalPrice, previewIcon } = req.body

        if (hasInvalidCombo({ soleStyle, laceStyle })) {
            return res.status(400).json({ error: 'Platform soles need laces for a secure fit.' })
        }

        const insertQuery = `
            INSERT INTO custom_items (name, upper_material, sole_style, lace_style, accent_trim, total_price, preview_icon)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `

        const values = [name, upperMaterial, soleStyle, laceStyle, accentTrim, totalPrice, previewIcon]
        const result = await pool.query(insertQuery, values)

        return res.status(201).json(result.rows[0])
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create custom item.' })
    }
}

export const updateCar = async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10)
        const { name, upperMaterial, soleStyle, laceStyle, accentTrim, totalPrice, previewIcon } = req.body

        if (hasInvalidCombo({ soleStyle, laceStyle })) {
            return res.status(400).json({ error: 'Platform soles need laces for a secure fit.' })
        }

        const updateQuery = `
            UPDATE custom_items
            SET name = $1, upper_material = $2, sole_style = $3, lace_style = $4, accent_trim = $5, total_price = $6, preview_icon = $7
            WHERE id = $8
            RETURNING *
        `

        const values = [name, upperMaterial, soleStyle, laceStyle, accentTrim, totalPrice, previewIcon, id]
        const result = await pool.query(updateQuery, values)

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Custom item not found.' })
        }

        return res.status(200).json(result.rows[0])
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update custom item.' })
    }
}

export const deleteCar = async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id, 10)
        const result = await pool.query('DELETE FROM custom_items WHERE id = $1 RETURNING *', [id])

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Custom item not found.' })
        }

        return res.status(200).json({ message: 'Custom item deleted successfully.' })
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete custom item.' })
    }
}
