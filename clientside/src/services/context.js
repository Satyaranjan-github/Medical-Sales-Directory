export const AuthContext = React.createContext();


const AuthContextProvider = ({ children }) => {

    const value = {}

    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
}