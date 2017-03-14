const bcryptCompare = (loginPassword, user) => {
  bcrypt.compare(loginPassword, user.password, function(err, cmp){
        if(cmp){
            req.session.user = user;
            console.log("session has been created")
            return req.session.user;
          } else { res.send("Invalid username/password combination") }
      })
  }
export { bcryptCompare };
