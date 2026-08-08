import { supabase } from "./supabase";

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}

export async function signup(
  name: string,
  email: string,
  password: string
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { data, error };
  }

  if (data.user) {
   const { error: profileError } = await supabase
  .from("profiles")
  .insert({
    id: data.user.id,
    full_name: name,
    email: email,
    phone: "",
    address: "",
    city: "",
    country: "",
    profile_image: "",
    total_orders: 0,
  });

console.log("PROFILE INSERT ERROR:", profileError);
  }

  return { data, error };
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}