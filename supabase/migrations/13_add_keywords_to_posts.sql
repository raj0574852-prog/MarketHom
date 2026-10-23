-- Migration 13: Add keywords column to posts table
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS keywords TEXT;
