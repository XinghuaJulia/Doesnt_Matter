var UserProfile = (function() {
    var userSession = null;
  
    var getSession = function() {
      return userSession;    // Or pull this from cookie/localStorage
    };
  
    var setSession = function(session) {
      userSession = session;     
      // Also set this in cookie/localStorage
    };
  
    return {
      getSession: getSession,
      setSession: setSession
    }
  
  })();
  
  export default UserProfile;