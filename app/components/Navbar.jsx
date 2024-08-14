import React, { useState, useEffect } from "react";
import Link from "next/link";
import { UserAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, googleSignIn, logOut } = UserAuth();
  const [loading, setLoading] = useState(true);

  const handleSignIn = async () => {
    try {
      await googleSignIn();

    } catch (error) {
      console.log(error);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setLoading(false);
    };
    checkAuthentication();
  }, [user]);

  return (
    <div className="navbar bg-base-100 h-20 w-full border-b-2 flex items-center justify-between p-2">
      <a className="btn btn-ghost text-xl">Aarohan</a>
      <ul className="flex">
        <li className="p-2">
          <Link href="/" className="btn btn-ghost">Home</Link>
        </li>
        <li className="p-2">
          <Link href="/viewQuestions" className="btn btn-ghost">View Questions</Link>
        </li>
  
        {user && (
          <>
            <li className="p-2">
              <Link href="/addQuestions" className="btn btn-ghost">Add Questions</Link>
            </li>
            <li className="p-2">
              <Link href="/editMetaData" className="btn btn-ghost">Edit Options</Link>
            </li>
          </>
        )}
      </ul>
  
      {!loading && (
        <>
          {!user ? (
            <ul className="flex">
              <li onClick={handleSignIn} className="btn btn-ghost p-2 cursor-pointer">
                Login
              </li>
              <li onClick={handleSignIn} className="btn btn-ghost p-2 cursor-pointer">
                Sign up
              </li>
            </ul>
          ) : (
            <div>
              <p>Welcome, {user.displayName}</p>
              <button className="btn btn-ghost" onClick={handleSignOut}>
                Sign out
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
  
};

export default Navbar;