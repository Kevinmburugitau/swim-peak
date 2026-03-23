import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "npm:@supabase/supabase-js@2";

const app = new Hono();

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-29992991/health", (c) => {
  return c.json({ status: "ok" });
});

// Sign up endpoint
app.post("/make-server-29992991/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log(`Sign up error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ 
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata.name
      }
    });
  } catch (error) {
    console.log(`Sign up exception: ${error}`);
    return c.json({ error: 'Sign up failed' }, 500);
  }
});

// Get user data endpoint
app.get("/make-server-29992991/user/data", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      console.log(`Auth error while getting user data: ${error?.message}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get user data from KV store
    const userData = await kv.get(`user:${user.id}:data`);
    
    return c.json({ 
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata.name
      },
      data: userData || null
    });
  } catch (error) {
    console.log(`Get user data exception: ${error}`);
    return c.json({ error: 'Failed to get user data' }, 500);
  }
});

// Save user data endpoint
app.post("/make-server-29992991/user/data", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      console.log(`Auth error while saving user data: ${error?.message}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userData = await c.req.json();
    
    // Save user data to KV store
    await kv.set(`user:${user.id}:data`, userData);
    
    return c.json({ success: true });
  } catch (error) {
    console.log(`Save user data exception: ${error}`);
    return c.json({ error: 'Failed to save user data' }, 500);
  }
});

// Update user profile endpoint
app.put("/make-server-29992991/user/profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      console.log(`Auth error while updating profile: ${error?.message}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { name, profileImage } = await c.req.json();
    
    // Update user metadata
    const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { 
        user_metadata: { 
          ...user.user_metadata,
          name: name || user.user_metadata.name,
          profileImage: profileImage || user.user_metadata.profileImage
        }
      }
    );

    if (updateError) {
      console.log(`Profile update error: ${updateError.message}`);
      return c.json({ error: updateError.message }, 400);
    }

    return c.json({ 
      user: {
        id: updatedUser.user.id,
        email: updatedUser.user.email,
        name: updatedUser.user.user_metadata.name,
        profileImage: updatedUser.user.user_metadata.profileImage
      }
    });
  } catch (error) {
    console.log(`Update profile exception: ${error}`);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});

Deno.serve(app.fetch);