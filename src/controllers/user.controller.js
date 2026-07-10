const userService = require('../services/user.service');
const { HTTP_STATUS, ROLES } = require('../constants');

/**
 * UserController
acá solo se traduce a HTTP.
 */
class UserController {
  async getAll(req, res, next) {
    try {
      const users = await userService.getAll();
      res.status(HTTP_STATUS.OK).json({ ok: true, data: users });
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const user = await userService.getById(req.params.id);
      res.status(HTTP_STATUS.OK).json({ ok: true, data: user });
    } catch (err) {
      next(err);
    }
  }

  async register(req, res, next) {
    try {
      const user = await userService.register(req.body);
      res.status(HTTP_STATUS.CREATED).json({ ok: true, data: user });
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const user = await userService.login(req.body);
      res.status(HTTP_STATUS.OK).json({ ok: true, data: user });
    } catch (err) {
      next(err);
    }
  }

  async remove(req, res, next) {
    try {
      // acá para que se vea el uso de las constantes de ROLES.
      const requesterRole = req.headers['x-user-role'] || ROLES.USER;
      await userService.remove(req.params.id, requesterRole);
      res.status(HTTP_STATUS.NO_CONTENT).send();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();
