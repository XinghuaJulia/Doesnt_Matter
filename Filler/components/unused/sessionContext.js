import React from 'react'
const sessionContext = React.createContext({
    userSession: null,
    setUserSession: () => {}, //methode will update context value
    
})
export default sessionContext