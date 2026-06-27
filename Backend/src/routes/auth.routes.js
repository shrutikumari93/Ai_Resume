const { Router } = require('express')
const authController = require("../controllers/auth.controller")
const authMiddleware = require("../middlewares/auth.middleware")
const authRouter = Router()

/*********@route POST /api/auth/register 
 * @description Register a new user
 * @access Public
*/
authRouter.post('/register', authController.registerUserController)
  





/*********@route POST /api/auth/login
 * @description loogin user with email or password
 * @access Public
*/
authRouter.post('/login', authController.loginUserController)
  // Handle login logic here

/**
 * @route GET /api/auth/logout
 * @description clear token from user anmd add the token in blacklist
 * @access Public
 */

authRouter.get("/logout" , authController.logoutUserController)


/**
 * @route GET /api/auth/profile
 * @description get the current logged in user details
 * @access private
 */
authRouter.get("/get-me", authMiddleware.authUser, authController.getMeController)

module.exports = authRouter