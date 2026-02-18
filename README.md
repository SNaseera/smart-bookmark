# Smart Bookmark

A full-stack bookmark manager built using Next.js and Supabase.

## Features
- Google Authentication
- Private bookmarks per user
- Real-time updates
- Add & delete bookmarks
- Deployed on Vercel

## Challenges Faced

1. Google login redirected to localhost after deployment.
   - Fixed by updating Supabase Authentication → URL Configuration with the Vercel domain.

2. Realtime not working initially.
   - Resolved by adding the bookmarks table to `supabase_realtime` publication.

3. Data privacy between users.
   - Implemented Row Level Security (RLS) policies using:
     ```
     auth.uid() = user_id
     ```

## Tech Stack
- Next.js
- Supabase (PostgreSQL, Auth, Realtime)
- Vercel

Live Demo:
https://smart-bookmark-xi-five.vercel.app/
