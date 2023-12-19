const User = require('../model/User');
const bcrypt = require('bcrypt');

const handleNewUser = async(req, res) => {
  const {username,
        password,
        firstName,
        lastName,
        email
         } = req.body;

  if(!username || 
     !password || 
     !firstName || 
     !lastName || 
     !email) 
      return res.status(400).json({ 'message': 'Enter all required inforamtion'})

  const duplicateUsername = await User.findOne({ username: username }).exec();
  const duplicateEmail = await User.findOne({ email: email }).exec();

  if(duplicateUsername) return res.status(409).json({ 'message': 'Username is unavailable.' })
  if(duplicateEmail) return res.status(409).json({ 'message': 'Email is already in use.' })

  try{
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await User.create({
      "username": username,
      "normalizedUsername": username.toLowerCase(),
      "password": hashedPassword,
      "firstName": firstName,
      "lastName": lastName,
      "email": email
    })

    console.log(result)

    res.status(201).json({ 'success': `New user ${username} created!` })
  }catch (err) {
    res.status(500).json({ 'message': err.message })
  }
}

module.exports = { handleNewUser }