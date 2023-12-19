const User = require('../model/User')

const handleLogout = async (req, res) => {
  const cookies = req.cookies
  // console.log(cookies)
  if(!cookies?.jwt) return res.sendStatus(204);

  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken }).exec();
  if(!foundUser){
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    return res.sendStatus(204);
  }

  foundUser.refreshToken = foundUser.refreshToken.filter(rt => rt !== refreshToken);
  const result = await foundUser.save();
  
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true }); 
  res.sendStatus(204).send('Logged out!');
}

module.exports = { handleLogout }