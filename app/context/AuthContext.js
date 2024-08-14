import {createContext, useContext, useEffect, useState} from "react";
import {GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut,} from "firebase/auth";
import {auth} from "../firebase";

const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState(null);

    const googleSignIn = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider);
    };

    const logOut = () => {
        signOut(auth);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (!currentUser) {
                return
            }
            currentUser.getIdToken().then((idToken) => {
                console.log(idToken)
                // fetch("http://localhost:8080/api/students/sign/a", {
                //     headers: {"content-type": "application/json"},
                //     method: "POST",
                //     body: JSON.stringify({token: idToken})
                // }).then((res) => {
                //     console.log(res)
                // }).catch((err) => console.error(err));
            })
        });
        return () => unsubscribe();
    }, [user]);

    return (
        <AuthContext.Provider value={{user, googleSignIn, logOut}}>
            {children}
        </AuthContext.Provider>
    );
};

export const UserAuth = () => {
    return useContext(AuthContext);
};