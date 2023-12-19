// middleware/allowAdminOrCurrentUser.js
const ROLES_LIST = require('../config/roles');

const verifyUser = (req, res, next) => {

  // console.log(req.params)
  const requestingUser = req.user.toLowerCase();
  const requestedUsername = req.params.username.toLowerCase();
  const requestingUserRoles = req.roles;
  // console.log("Requesting User: ", requestingUser)
  // console.log("Requested Username: ", requestedUsername)

  // Check if the user is an admin or the same user
  const isAdmin = requestingUserRoles?.includes(ROLES_LIST.Admin);
  const isCurrentUser = requestingUser === requestedUsername;

  // console.log("isAdmin: ", isAdmin)
  // console.log("isCurrentUser: ", isCurrentUser)

  if (isAdmin || isCurrentUser) {
    next(); // Allow access
  } else {
    res.status(403).json({ message: 'Access denied' });
  }
};

module.exports = verifyUser;
