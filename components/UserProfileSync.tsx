"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useAppDispatch } from "@/lib/store/index"; // your typed Redux hook
import { setUser, clearUser } from "@/lib/reducers/userSlice";

export default function UserProfileSync() {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();

 

  useEffect(() => {
    if (session?.user) {
      dispatch(
        setUser({
          id: session.user.id,
          email: session.user.email,
          image: session.user.image,
        })
      );
      
    } else {
      dispatch(clearUser());
    }
  }, [session, dispatch]);

  return null;
}
