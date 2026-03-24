import { pool } from './database.js'

const rows = [
    {
        name: 'Midnight Court',
        upper_material: 'canvas',
        sole_style: 'classic',
        lace_style: 'flat',
        accent_trim: 'midnight',
        total_price: 122,
        preview_icon: '👟'
    },
    {
        name: 'Copper Rush',
        upper_material: 'leather',
        sole_style: 'chunky',
        lace_style: 'rope',
        accent_trim: 'chrome',
        total_price: 206,
        preview_icon: '👞'
    },
    {
        name: 'Neon Drift',
        upper_material: 'knit',
        sole_style: 'trail',
        lace_style: 'elastic',
        accent_trim: 'neon',
        total_price: 173,
        preview_icon: '🧶'
    }
]

const seed = async () => {
    const countResult = await pool.query('SELECT COUNT(*)::int AS n FROM custom_items')
    if (countResult.rows[0].n > 0) {
        console.log('custom_items already has data; skipping seed (use db:reset then db:seed to reload)')
        await pool.end()
        return
    }

    const text = `
        INSERT INTO custom_items (name, upper_material, sole_style, lace_style, accent_trim, total_price, preview_icon)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
    `

    for (const row of rows) {
        await pool.query(text, [
            row.name,
            row.upper_material,
            row.sole_style,
            row.lace_style,
            row.accent_trim,
            row.total_price,
            row.preview_icon
        ])
    }

    console.log(`Seeded ${rows.length} custom_items`)
    await pool.end()
}

seed().catch((error) => {
    console.error(error)
    process.exit(1)
})
