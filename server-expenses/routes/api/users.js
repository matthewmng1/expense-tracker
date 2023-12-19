const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/usersController');
const ROLES_LIST = require("../../config/roles")
const verifyRoles = require('../../middleware/verifyRoles');
const verifyUser = require('../../middleware/verifyUser');


router.route('/')
  .get(verifyRoles(ROLES_LIST.Admin), usersController.getAllUsers)

// router.route('/:userId')
//   .get(usersController.getUserById);

router.route('/:username')
  .get(verifyUser, usersController.getUserByUsername)
  .patch(verifyUser, usersController.editUser)

router.route('/:username/categories')
  .get(verifyUser, usersController.getUserCategories)
  .post(verifyUser, usersController.addUserCategory)

router.route('/:username/categories/:category')
  .delete(verifyUser, usersController.removeUserCategory)


router.route('/:username/paymentMethods')
  .get(verifyUser, usersController.getUserPaymentMethods)
  .post(verifyUser, usersController.addUserPaymentMethod)

  router.route('/:username/paymentMethods/:paymentMethod')
  .delete(verifyUser, usersController.removeUserPaymentMethod)

module.exports = router;