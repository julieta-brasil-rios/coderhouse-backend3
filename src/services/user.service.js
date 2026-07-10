const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/user.repository');
const ApiError = require('../utils/ApiError');
const { HTTP_STATUS, ROLES } = require('../constants');

const SALT_ROUNDS = 10;

/**
 * UserService
 * Acá vive TODA la lógica de negocio de usuarios:
 * - hashear/comparar passwords,
 * - validar permisos por rol,
 */
class UserService {
  async getAll() {
    return userRepository.findAll();
  }

  async getById(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, `No existe un usuario con id "${id}"`);
    }
    return user;
  }

  async register({ name, email, password, role }) {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new ApiError(HTTP_STATUS.CONFLICT, `Ya existe un usuario con el email "${email}"`);
    }

    const finalRole = Object.values(ROLES).includes(role) ? role : ROLES.USER;

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    return userRepository.create({ name, email, password: hashedPassword, role: finalRole });
  }

  async login({ email, password }) {
    const user = await userRepository.findByEmailWithPassword(email);
    if (!user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Credenciales inválidas');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Credenciales inválidas');
    }

    const { password: _omit, __v, ...safeUser } = user.toObject();
    return safeUser;
  }


  async remove(id, requesterRole) {
    if (requesterRole !== ROLES.ADMIN) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Solo un administrador puede eliminar usuarios');
    }

    const deleted = await userRepository.softDeleteById(id);
    if (!deleted) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, `No existe un usuario con id "${id}"`);
    }
    return deleted;
  }
}

module.exports = new UserService();
