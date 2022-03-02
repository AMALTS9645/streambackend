const googleOAuth=require("passport-google-oauth20");
const User = require("../models/User");

const GoogleStrategy = googleOAuth.Strategy;

module.exports = passport => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:8800/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        // Create a new user object
        const newUser = {
          fullname: profile.displayName,
          email: profile.emails[0].value,
          profilePic: profile.photos[0].value,
        };

        try{
            //check if the user exists
            const user = await User.findOne({email: newUser.email});

            if(user){
                //generate a token
                const token = user.generateJwtToken();

                //return user
                done(null, {user, token});
            } else {
                //create a new user
                const user = await User.create(newUser);
                //generate token
                const token = user.generateJwtToken();

                //return user
                done(null, {user, token});
            }

        }catch(error){
            done(error, null);
        } 
      }
    )
  );
  passport.serializeUser((userData, done) => done(null, {...userData}));
  passport.deserializeUser((id, done) => done(null, id));
};
