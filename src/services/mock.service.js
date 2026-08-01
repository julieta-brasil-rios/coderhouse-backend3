const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');
const mockRepository = require('../repositories/mock.repository');
const ApiError = require('../utils/ApiError');
const {
  HTTP_STATUS,
  ROLES,
  ORDER_STATUS,
  ORDER_PRIORITY,
  DELIVERY_STATUS,
} = require('../constants');

const SALT_ROUNDS = 10;

// Nunca generamos usuarios de prueba con rol ADMIN.
const MOCKABLE_USER_ROLES = [ROLES.USER, ROLES.REPARTIDOR];

const SEEDABLE_COLLECTIONS = ['users', 'orders', 'deliveries'];

// Nombre "lindo" de cada colección, para la respuesta del endpoint de seed.
const COLLECTION_LABELS = {
  users: 'usuarios',
  orders: 'pedidos',
  deliveries: 'entregas',
};


class MockService {
  // ---------- Builders: arman UN registro con forma real ----------

  buildUser(role) {
    const finalRole = role && MOCKABLE_USER_ROLES.includes(role)
      ? role
      : faker.helpers.arrayElement(MOCKABLE_USER_ROLES);

    return {
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password({ length: 10 }),
      role: finalRole,
      isMock: true,
    };
  }

  buildOrder(userId) {
    const items = faker.helpers.multiple(
      () => ({
        productName: faker.commerce.productName(),
        quantity: faker.number.int({ min: 1, max: 5 }),
        price: Number(faker.commerce.price({ min: 5, max: 200 })),
      }),
      { count: { min: 1, max: 4 } }
    );

    const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return {
      user: userId,
      items,
      totalAmount: Number(totalAmount.toFixed(2)),
      address: faker.location.streetAddress(),
      status: faker.helpers.arrayElement(Object.values(ORDER_STATUS)),
      priority: faker.helpers.arrayElement(Object.values(ORDER_PRIORITY)),
      isMock: true,
    };
  }

  buildDelivery(orderId, repartidorId) {
    return {
      order: orderId,
      repartidor: repartidorId || null,
      status: faker.helpers.arrayElement(Object.values(DELIVERY_STATUS)),
      estimatedDeliveryDate: faker.date.soon({ days: 5 }),
      isMock: true,
    };
  }

  

  previewUsers(qty, role) {
    return faker.helpers.multiple(() => this.buildUser(role), { count: qty });
  }

  previewOrders(qty) {
    return faker.helpers.multiple(
      () => this.buildOrder(faker.database.mongodbObjectId()),
      { count: qty }
    );
  }

  previewDeliveries(qty) {
    return faker.helpers.multiple(
      () =>
        this.buildDelivery(
          faker.database.mongodbObjectId(),
          faker.database.mongodbObjectId()
        ),
      { count: qty }
    );
  }

  // ---------- Seed: insertan en MongoDB de forma controlada ----------

  async seed(collection, qty) {
    if (!SEEDABLE_COLLECTIONS.includes(collection)) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        `Colección "${collection}" inválida. Usá: ${SEEDABLE_COLLECTIONS.join(', ')}.`
      );
    }

    if (collection === 'users') return this._seedUsers(qty);
    if (collection === 'orders') return this._seedOrders(qty);
    return this._seedDeliveries(qty);
  }

  async _seedUsers(qty, role) {
    const rawUsers = faker.helpers.multiple(() => this.buildUser(role), { count: qty });
    const docs = await Promise.all(
      rawUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, SALT_ROUNDS),
      }))
    );

    const inserted = await mockRepository.insertUsers(docs);
    return this._result(inserted.length, 'users');
  }

  async _seedOrders(qty) {
    // Los pedidos necesitan clientes (rol USER) reales para poder asociarse.
    let clients = await mockRepository.findUsersByRole(ROLES.USER, qty);
    if (clients.length === 0) {
      await this._seedUsers(Math.max(3, qty), ROLES.USER);
      clients = await mockRepository.findUsersByRole(ROLES.USER, qty);
    }

    const docs = faker.helpers.multiple(
      () => this.buildOrder(faker.helpers.arrayElement(clients)._id),
      { count: qty }
    );

    const inserted = await mockRepository.insertOrders(docs);
    return this._result(inserted.length, 'orders');
  }

  async _seedDeliveries(qty) {
    // Las entregas necesitan pedidos reales, y de ser posible, repartidores reales.
    let orders = await mockRepository.findOrders(qty);
    if (orders.length === 0) {
      await this._seedOrders(Math.max(3, qty));
      orders = await mockRepository.findOrders(qty);
    }

    let repartidores = await mockRepository.findUsersByRole(ROLES.REPARTIDOR, qty);
    if (repartidores.length === 0) {
      await this._seedUsers(Math.max(3, qty), ROLES.REPARTIDOR);
      repartidores = await mockRepository.findUsersByRole(ROLES.REPARTIDOR, qty);
    }

    const docs = faker.helpers.multiple(
      () =>
        this.buildDelivery(
          faker.helpers.arrayElement(orders)._id,
          repartidores.length ? faker.helpers.arrayElement(repartidores)._id : null
        ),
      { count: qty }
    );

    const inserted = await mockRepository.insertDeliveries(docs);
    return this._result(inserted.length, 'deliveries');
  }

  _result(insertados, collection) {
    return { insertados, coleccion: COLLECTION_LABELS[collection] };
  }
}

module.exports = new MockService();
