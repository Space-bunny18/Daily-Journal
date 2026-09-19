import { supabase } from "./supabase";

const AUDIO_BUCKET = "memory-audio";

export async function uploadMemoryAudio(file, userId) {
  if (!file) {
    return {
      data: null,
      error: new Error("No audio file selected."),
    };
  }

  if (!userId) {
    return {
      data: null,
      error: new Error("User is not authenticated."),
    };
  }

  if (!file.type.startsWith("audio/")) {
    return {
      data: null,
      error: new Error("Please select an audio file."),
    };
  }

  const fileExtension =
    file.name.split(".").pop()?.toLowerCase() || "mp3";

  const fileName = `${crypto.randomUUID()}.${fileExtension}`;
  const filePath = `${userId}/${fileName}`;

  const { error } = await supabase.storage
    .from(AUDIO_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    console.error("Audio upload failed:", error);

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

export async function getMemoryAudioUrl(path) {
  if (!path) {
    return {
      data: null,
      error: null,
    };
  }

  const { data, error } = await supabase.storage
    .from(AUDIO_BUCKET)
    .createSignedUrl(path, 60 * 60);

  if (error) {
    console.error(
      "Could not create audio signed URL:",
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

export async function deleteMemoryAudio(path) {
  if (!path) {
    return {
      data: null,
      error: null,
    };
  }

  const { data, error } = await supabase.storage
    .from(AUDIO_BUCKET)
    .remove([path]);

  if (error) {
    console.error(
      "Could not delete audio:",
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