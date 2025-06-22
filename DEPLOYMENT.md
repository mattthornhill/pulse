# Deploying Profit Pulse AI to Vercel

## Prerequisites
- Vercel account (sign up at https://vercel.com)
- Environment variables from your `.env.local` file

## Deployment Steps

### Option 1: Deploy via Vercel CLI (Recommended)

1. Install Vercel CLI globally (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. Run the deployment command:
   ```bash
   vercel
   ```

3. Follow the prompts:
   - Log in to your Vercel account
   - Select scope (personal or team)
   - Link to existing project or create new
   - Confirm project settings

4. For production deployment:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via GitHub Integration

1. Push your code to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/pulse-ai-dashboard.git
   git push -u origin main
   ```

2. Go to https://vercel.com/new
3. Import your GitHub repository
4. Configure project settings and deploy

### Environment Variables

After deployment, add your environment variables in Vercel:

1. Go to your project dashboard on Vercel
2. Navigate to Settings → Environment Variables
3. Add the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_METABASE_SITE_URL=your_metabase_url
NEXT_PUBLIC_METABASE_DASHBOARD_ID=your_dashboard_id
```

### Post-Deployment

1. Your app will be available at:
   - `https://your-project-name.vercel.app` (auto-generated)
   - You can add a custom domain in project settings

2. Metabase Configuration:
   - Ensure your Metabase dashboard is set to public
   - Update CORS settings if needed

3. Monitor deployment:
   - Check Functions tab for API routes
   - Review Analytics for performance
   - Set up error tracking if desired

### Troubleshooting

- If Metabase embed doesn't work, check:
  - Dashboard is public
  - Correct dashboard ID
  - No CORS issues

- If environment variables aren't working:
  - Redeploy after adding them
  - Check variable names match exactly
  - Ensure NEXT_PUBLIC_ prefix for client-side vars