const User = require('../model/User')
const jwt = require('jsonwebtoken')

const handleRefreshToken = async (req, res) => {
  // console.log("refresh token controller")
  const cookies = req.cookies
  // console.log("RTC cookies", cookies)
  if(!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;
  // console.log("RTC", refreshToken)

  if(refreshToken){
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
  }
  
  const foundUser = await User.findOne({ refreshToken }).exec();
  // console.log(foundUser)


  // detected refresh token reuse!
  if(!foundUser) {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) return res.sendStatus(403); 
        // Delete refresh tokens of hacked user
        const hackedUser = await User.findOne({ username: decoded.username }).exec();
        hackedUser.refreshToken = [];
        const result = await hackedUser.save()
      }
    )
    return res.sendStatus(401); // Forbidden
  }

  const newRefreshTokenArray = foundUser.refreshToken.filter(rt => rt !== refreshToken);

  // console.log(newRefreshTokenArray)

  // evaluate jwt
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        foundUser.refreshToken = [...newRefreshTokenArray];
        const result = await foundUser.save();
      }
      if(err || foundUser.username !== decoded.username) return res.sendStatus(403);

      //Refresh token was still valid
      const roles = Object.values(foundUser.roles);
      const accessToken = jwt.sign(
        {
          "UserInfo": {
            "username": decoded.username,
            "_id": decoded._id,
            "roles": roles
          }
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: '1d'}
      );

      const newRefreshToken  = jwt.sign(
        {"username": foundUser.username},
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d'}
      );
      // saving refresh token with current user
      foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
      const result = await foundUser.save();

      //create secure cookie with refresh token
      res.cookie('jwt', newRefreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 })

      res.json({ roles, accessToken })
      // console.log(accessToken)
    }
  )
}

module.exports = { handleRefreshToken }