import React from 'react'

const AppContext = React.createContext({
   backendUrl: '', token: '', updateToken: () => {}
})

export default AppContext