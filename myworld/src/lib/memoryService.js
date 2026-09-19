import { supabase } from "./supabase";

/* =========================================================
   LOAD USER MEMORIES
========================================================= */

export async function getMemories(userId) {
  if (!userId) {
    return {
      data: [],
      error: new Error("User is not authenticated."),
    };
  }

  const { data, error } = await supabase
    .from("memories")
    .select("*")
    .eq("user_id", userId)
    .order("entry_date", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Failed to load memories:",
      error
    );
  }

  return {
    data: data || [],
    error,
  };
}


/* =========================================================
   CREATE MEMORY
========================================================= */

export async function createMemory(
  userId,
  memory
) {
  if (!userId) {
    return {
      data: null,
      error: new Error("User is not authenticated."),
    };
  }

  const { data, error } = await supabase
    .from("memories")
    .insert({
      user_id: userId,

      title: memory.title || null,
      story: memory.text || null,
      mood: memory.mood || null,
      favorite: memory.favorite ?? false,

      entry_date:
        memory.date || new Date().toISOString(),

      day: memory.day || null,
      time: memory.time || null,
      tag: memory.tag || null,

      photo: memory.photo || null,
      location: memory.location || null,
      tags: Array.isArray(memory.tags)
        ? memory.tags
        : [],
      music: memory.music || null,
    })
    .select()
    .single();

  if (error) {
    console.error(
      "Failed to create memory:",
      error
    );
  }

  return {
    data,
    error,
  };
}


/* =========================================================
   UPDATE MEMORY
========================================================= */

export async function updateMemory(
  userId,
  memoryId,
  memory
) {
  if (!userId) {
    return {
      data: null,
      error: new Error("User is not authenticated."),
    };
  }

  const { data, error } = await supabase
    .from("memories")
    .update({
      title: memory.title || null,
      story: memory.text || null,
      mood: memory.mood || null,
      favorite:
        memory.favorite !== undefined
          ? memory.favorite
          : undefined,

      entry_date:
        memory.date || new Date().toISOString(),

      day: memory.day || null,
      time: memory.time || null,
      tag: memory.tag || null,

      photo: memory.photo || null,
      location: memory.location || null,
      tags: Array.isArray(memory.tags)
        ? memory.tags
        : [],
      music: memory.music || null,

      updated_at: new Date().toISOString(),
    })
    .eq("id", memoryId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    console.error(
      "Failed to update memory:",
      error
    );
  }

  return {
    data,
    error,
  };
}


/* =========================================================
   DELETE MEMORY
========================================================= */

export async function deleteMemory(
  userId,
  memoryId
) {
  if (!userId) {
    return {
      error: new Error("User is not authenticated."),
    };
  }

  const { error } = await supabase
    .from("memories")
    .delete()
    .eq("id", memoryId)
    .eq("user_id", userId);

  if (error) {
    console.error(
      "Failed to delete memory:",
      error
    );
  }

  return {
    error,
  };
}