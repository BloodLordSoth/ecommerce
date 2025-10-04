/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.createTable('cart_items', {
        id: 'id',
        product_id: { type: 'integer', notNull: true, references: '"products"', onDelete: 'cascade' },
        quantity: { type: 'integer', notNull: true, default: 1 },
        created_at: { type: 'timestamp', default: pgm.func('CURRENT_TIMESTAMP') }
    });

    pgm.addConstraint('cart_items', 'unique_products_in_cart', {
        unique: ['product_id']
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('cart_items');
};
