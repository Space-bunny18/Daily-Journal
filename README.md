# 🌙 MyWorld

### Your diary. Your world.

> A personal digital diary designed to help you write, remember, reflect, and grow.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-MyWorld-9b7bb8?style=for-the-badge)](https://dailyjournal-silk.vercel.app/)
[![Built with React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

---

## ✨ Overview

**MyWorld** is a modern personal diary web application built around one simple idea:

> **Your memories are more than data — they're your story.**

Instead of being just a place to write text, MyWorld creates a personal space where users can capture different parts of their everyday life.

Write a thought.

Save a photo.

Attach audio or music.

Track your mood.

Revisit an old memory.

See how your journey changes over time.

MyWorld combines all of these experiences into one calm, personal digital space.

---

## 🎯 What Makes MyWorld Different?

MyWorld isn't designed like a traditional notes application.

It focuses on the **experience of remembering**.

### 📝 Express

Write your thoughts, experiences and everyday moments.

### 📸 Capture

Save photos and meaningful moments alongside your entries.

### 🎵 Remember

Attach audio and music to memories.

### 🌈 Reflect

Track moods and explore how you've been feeling over time.

### 📅 Revisit

Use the calendar and "On This Day" experiences to return to previous moments.

### 🔒 Keep It Personal

User authentication, account isolation and protected storage help keep personal memories private.

---

# 🚀 Features

## 🏠 Personalized Diary Home

A dynamic dashboard designed around the user's personal world.

- Personalized time-based greeting
- Total memory count
- Mood statistics
- Writing streak
- Recent memories
- Quick mood selection
- Daily prompts
- Memory resurfacing
- Achievement system

---

## ✍️ Diary Editor

Create detailed memories with:

- Title
- Story / journal entry
- Mood
- Date
- Time
- Tags
- Location
- Photos
- Audio
- Music information
- Favorites

---

## 🖼️ Memories Library

A dedicated space for exploring saved memories.

Includes:

- Memory cards
- Search
- Mood filtering
- Favorites
- Photos
- Audio
- Tags
- Memory metadata

---

## 📅 Memory Calendar

Explore your diary through time.

The calendar connects diary entries with their corresponding dates, making it easier to revisit specific moments.

---

## 🌈 Mood Timeline

Track your emotional journey through your saved diary entries.

Instead of only storing memories, MyWorld helps users see the emotional patterns behind them.

---

## ✨ On This Day

Rediscover memories from the same date in previous years.

A simple way to bring older moments back into the present.

---

## 💭 Daily Prompts

When you don't know what to write, MyWorld provides prompts to help start the conversation with yourself.

---

## 🔥 Writing Streaks

Build a consistent journaling habit by tracking consecutive writing days.

---

## 🏆 Achievements

MyWorld includes an achievement system that rewards continued journaling.

Achievements are unlocked based on activities such as:

- Writing memories
- Building streaks
- Exploring the diary
- Reaching personal milestones

---

## 🔐 Authentication & Privacy

MyWorld uses Supabase Authentication to provide secure account-based access.

Supported authentication includes:

- Email authentication
- Google OAuth
- Password reset

Each user's memories are isolated using **Supabase Row Level Security (RLS)**.

---

## 📷 Private Photo Storage

Photos are stored using Supabase Storage with private buckets.

The application uses:

- Authenticated storage policies
- User-specific access
- Signed URLs
- Automatic photo cleanup when memories are deleted

---

## 🎧 Audio Memories

Users can attach audio to memories.

Audio files are stored separately using a private Supabase Storage bucket and loaded securely through signed URLs.

---

## ⭐ Favorites

Important memories can be marked as favorites and filtered separately from the rest of the diary.

---

## 🔍 Search

Search through your personal world using:

- Titles
- Stories
- Moods
- Tags
- Dates
- Locations
- Music
- Artists

---

## 📦 Data Export

MyWorld includes a personal data backup feature.

Users can export their diary data as a JSON file containing their stored memory information.

Example:

```text
myworld-backup-YYYY-MM-DD.json
