const LocalStrategy = require ('/passport-local')
    .strategy
const bcrypt = require('bcrypt')



function initialize(passport) {
    const authenticateUser = (email, password, done) => {
        const user = getUserByEmail(email)
        if (user == null) {
            return done(null, false, {message: 'No such user'})
        }

        try {
            if (await bcrypt.compare(password, user.password)){
                return done(null, user)
            }
            else {
                return done(null, false, {message: 'Password incorrect'})
            }
        } catch {
            return done(e)
        }
    }

    passport.use(new LocalStrategy({usernameField: 'email'}), authenticateUser)
    passport.serializeUser((user, done) => { })
    passport.deserializeUser((id, done) => { })
}

module.exports = initialize