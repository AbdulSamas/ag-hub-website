import { supabase } from "./supabase";

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}

export async function updateProfile(
  userId: string,
  values: any
) {
  return await supabase
    .from("profiles")
    .update(values)
    .eq("id", userId)
    .select()
    .single();
}

export async function uploadProfileImage(
  userId: string,
  file: File
) {
  const ext = file.name.split(".").pop();

  const fileName = `${userId}.${ext}`;

  const { error } = await supabase.storage
    .from("profiles")
    .upload(fileName, file, {
      upsert: true,
    });

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage
    .from("profiles")
    .getPublicUrl(fileName);

  await updateProfile(userId, {
    profile_image: publicUrl,
  });

  return publicUrl;
}