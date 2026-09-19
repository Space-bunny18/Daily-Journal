import { supabase } from "./supabase";

export async function uploadMemoryPhoto(file, userId) {
  if (!file) {
    return {
      data: null,
      error: new Error("No photo selected."),
    };
  }

  if (!userId) {
    return {
      data: null,
      error: new Error("User is not authenticated."),
    };
  }

  if (!file.type.startsWith("image/")) {
    return {
      data: null,
      error: new Error("Please select an image file."),
    };
  }

  const fileExtension =
    file.name.split(".").pop()?.toLowerCase() || "jpg";

  const fileName = `${crypto.randomUUID()}.${fileExtension}`;

  const filePath = `${userId}/${fileName}`;

  const { error } = await supabase.storage
    .from("memory-photos")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    console.error("Photo upload failed:", error);

    return {
      data: null,
      error,
    };
  }

  return {
    data: {
      path: filePath,
      name: file.name,
      type: file.type,
    },
    error: null,
  };
}
export async function getMemoryPhotoUrl(path) {
  if (!path) {
    return {
      data: null,
      error: null,
    };
  }

  const { data, error } = await supabase.storage
    .from("memory-photos")
    .createSignedUrl(path, 60 * 60);

  if (error) {
    console.error(
      "Could not create photo signed URL:",
      error
    );

    return {
      data: null,
      error,
    };
  }

  return {
    data: data?.signedUrl || null,
    error: null,
  };
}
export async function deleteMemoryPhoto(path) {
  if (!path) {
    return {
      data: null,
      error: null,
    };
  }

  const { data, error } = await supabase.storage
    .from("memory-photos")
    .remove([path]);

  if (error) {
    console.error(
      "Could not delete photo:",
      error
    );

    return {
      data: null,
      error,
    };
  }

  return {
    data,
    error: null,
  };
}