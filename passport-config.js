const LocalStrategy = require ('passport-local')
    .Strategy
const bcrypt = require('bcrypt')
const knex = require("./db/knex")



function initialize(passport, getUserById) {
    const authenticateUser = async (email, password, done) => {
        const userData = await knex("userCredentials").where({email: email, password: 1}).select()
        if (userData == null) {
            return done(null, false, {message: 'No such user'})
        }

        try {
            if (await bcrypt.compare(password, userData.password)){
                return done(null, userData)
            }
            else {
                return done(null, false, {message: 'Password incorrect'})
            }
        } catch (e){
            return done(e)
        }
    }

    passport.use(new LocalStrategy({usernameField: 'email'}, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => { return done(null, getUserById(id))
    })
}

module.exports = initialize