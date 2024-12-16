import { Strategy } from "passport-google-oauth20"
import passport from "passport"
import env from "dotenv"

env.config()

const pass = passport.use(new Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
},(accessToken, refreshToken, profile,done) => {
    done(null,profile)
}))

pass.serializeUser((user, done) => {
    done(null, user)
})

pass.deserializeUser((user, done) => {
    done(null, user)
})

export default pass