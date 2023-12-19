const User = require('../model/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const handleLogin = async(req, res) => {
  const cookies = req.cookies;
  console.log(cookies)

  const { username, password } = req.body;
  console.log(username, password)

  if(!username ||
     !password)
      return res.status(400).json({ 'message': 'Username and password are required' });
  
  const foundUser = await User.findOne({ normalizedUsername: username.toLowerCase() }).exec()
  console.log(username.toLowerCase())
  console.log(foundUser)
  if(!foundUser) return res.sendStatus(401)

  const match = await bcrypt.compare(password, foundUser.password);
  if(match){
    console.log("user:", foundUser.username)
    const username = foundUser.username
    // console.log(username)
    const roles = Object.values(foundUser.roles).filter(Boolean);
    const userId = Object.values(foundUser._id).filter(Boolean);
    // console.log(userId)

    const accessToken = jwt.sign({
      "UserInfo": {
        "username": username,
        "_id": userId,
        "roles": roles
      }
    },
      process.env.ACCESS_TOKEN_SECRET,
      {expiresIn: '60m'}  
    );
    const newRefreshToken = jwt.sign(
      { "username": username,
        "_id": userId
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );

    let newRefreshTokenArray = 
      !cookies?.jwt
        ? foundUser.refreshToken
        : foundUser.refreshToken.filter(rt => rt !== cookies.jwt);

    if(cookies?.jwt) {
      const refreshToken = cookies.jwt;
      // console.log("authController", refreshToken)
      const foundToken = await User.findOne({ refreshToken }).exec();
      // console.log("authController, foundToken", foundToken)

      if(!foundToken){
        newRefreshTokenArray = [];
      }

      res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    }

    foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    const result = await foundUser.save();
    // console.log("authControl, neRT", result)

    res.cookie('jwt', newRefreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 })

    res.json({ username, roles, accessToken });
  } else {
    res.sendStatus(401);
  }
}

module.exports = { handleLogin }