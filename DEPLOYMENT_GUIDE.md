# 🚀 SkillGraph Deployment Guide

This guide walks you through deploying SkillGraph to production using free platforms.

## 📋 Prerequisites

Before you start:
- ✅ GitHub account (https://github.com)
- ✅ CognoDB instance running (with credentials)
- ✅ Render account (https://render.com) - free tier
- ✅ Vercel account (https://vercel.com) - free tier

## 🔑 Step 1: Push to GitHub

### 1.1 Create a GitHub Repository

1. Go to https://github.com/new
2. Repository name: `skillgraph` (or your preference)
3. Description: `Graph-powered job recommendation system`
4. **Choose**: Public (easier for Render/Vercel integration)
5. Click "Create repository"

### 1.2 Connect Local Repository to GitHub

Copy the commands from GitHub after creation and run:

```bash
cd c:\Users\NEXOVA3\Downloads\task

# Add remote (replace YOUR-USERNAME and YOUR-REPO)
git remote add origin https://github.com/YOUR-USERNAME/skillgraph.git
git branch -M main
git push -u origin main
```

**⚠️ First time push**: Enter your GitHub credentials or use a Personal Access Token (PAT)

Verify on GitHub: Your code should now be visible at `https://github.com/YOUR-USERNAME/skillgraph`

---

## 🚀 Step 2: Deploy Backend to Render

### Why Render?
- Free tier with 750 hours/month
- Automatic Git deployment
- Environment variables support
- Persistent database connections

### 2.1 Create Render Account & Service

1. Go to https://render.com and sign up
2. Click "New +" → "Web Service"
3. Connect GitHub:
   - Click "Connect account"
   - Authorize GitHub
   - Search for `skillgraph` repo
   - Click "Connect"

### 2.2 Configure Web Service

Fill in the form:

| Field | Value |
|-------|-------|
| **Name** | `skillgraph-backend` |
| **Environment** | `Python 3.11` |
| **Build Command** | `pip install -r backend/requirements.txt` |
| **Start Command** | `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT` |
| **Instance Type** | Free |

### 2.3 Add Environment Variables

Scroll down to "Environment" section:

```
COGNODB_URI=bolt+s://db-XXXXX.databases.cognodb.com
COGNODB_USERNAME=cognodb
COGNODB_PASSWORD=your-password-here
```

⚠️ **Get these from your CognoDB dashboard**

### 2.4 Deploy

Click "Create Web Service" and wait ~3-5 minutes for deployment.

**Your backend URL**: `https://skillgraph-backend.onrender.com`

### 2.5 Verify Backend

Open in browser: `https://skillgraph-backend.onrender.com/health`

Expected response:
```json
{ "status": "ok" }
```

If it shows `"db-unreachable"`: Check CognoDB credentials in environment variables

---

## 🎨 Step 3: Deploy Frontend to Vercel

### Why Vercel?
- Free tier with unlimited deployments
- Fast global CDN
- Automatic Git integration
- Environment variables for API URLs

### 3.1 Create Vercel Account & Project

1. Go to https://vercel.com and sign up (use GitHub login for easier integration)
2. Click "Add New..." → "Project"
3. Find your `skillgraph` repo from GitHub
4. Click "Import"

### 3.2 Configure Project

Fill in the form:

| Field | Value |
|-------|-------|
| **Project Name** | `skillgraph` |
| **Framework Preset** | `Vite` |
| **Root Directory** | `./frontend` |

### 3.3 Add Environment Variables

Expand "Environment Variables" section:

```
VITE_API_URL=https://skillgraph-backend.onrender.com/api
```

(Replace with your actual Render backend URL)

### 3.4 Deploy

Click "Deploy" and wait ~2-3 minutes.

**Your frontend URL**: `https://skillgraph.vercel.app`

---

## ✅ Step 4: Verify Full Deployment

### 4.1 Test Frontend

1. Open: `https://skillgraph.vercel.app`
2. You should see the Dashboard
3. Check browser console (F12) for any API errors

### 4.2 Test API Endpoints

From command line or Postman:

```bash
# Health check
curl https://skillgraph-backend.onrender.com/health

# List candidates
curl https://skillgraph-backend.onrender.com/api/candidates

# Get recommendations for first candidate
curl https://skillgraph-backend.onrender.com/api/candidates/c-1/recommendations
```

### 4.3 Common Issues & Fixes

**Issue**: Frontend shows "Unable to reach backend API"
- ✅ Solution: Check `VITE_API_URL` in Vercel environment variables
- ✅ Verify backend is running: `https://skillgraph-backend.onrender.com/health`

**Issue**: Backend shows "db-unreachable"
- ✅ Solution: Check COGNODB credentials in Render environment variables
- ✅ Verify CognoDB instance is running in console.cognodb.com

**Issue**: CORS errors in browser console
- ✅ Solution: Update `backend/app/main.py` CORS settings:
  ```python
  allow_origins=['https://skillgraph.vercel.app']
  ```

---

## 📝 Step 5: Update README with Live URLs

Edit your root `README.md`:

Replace:
```markdown
**Live Demo**: [Hosted Demo Coming Soon] | **Backend API**: [API Docs Coming Soon]
```

With:
```markdown
**Live Demo**: https://skillgraph.vercel.app | **Backend API**: https://skillgraph-backend.onrender.com/api
```

Push to GitHub:
```bash
git add README.md
git commit -m "Update README with live URLs"
git push
```

---

## 🔄 Continuous Deployment

After setup, deployment is **automatic**:

1. **Make code changes** locally
2. **Push to GitHub**: `git push`
3. **Render** auto-rebuilds backend
4. **Vercel** auto-rebuilds frontend
5. **Live in ~2-5 minutes**

### Example Workflow

```bash
# Edit code
code frontend/src/App.tsx

# Commit
git add .
git commit -m "Fix dashboard UI"

# Push to GitHub (triggers auto-deploy)
git push

# Check deployment status:
# - Render: https://dashboard.render.com
# - Vercel: https://vercel.com/dashboard
```

---

## 📊 Monitoring

### Render Backend

- **Dashboard**: https://dashboard.render.com
- **Logs**: Click service → "Logs" tab
- **Metrics**: CPU, memory, request count visible

### Vercel Frontend

- **Dashboard**: https://vercel.com/dashboard
- **Deployments**: View all deployment history
- **Analytics**: Pageviews, response times (Pro feature)

---

## 💰 Costs

**Total cost: FREE!**

- **Render**: 750 hours/month = ~25 days continuous
- **Vercel**: Unlimited deployments + bandwidth
- **CognoDB**: Free tier with limits

### When to Upgrade (Optional)

- Render: When you need >750 hours/month ($7+/month)
- Vercel: When you exceed 100GB bandwidth/month ($20+)
- CognoDB: When you exceed node/relationship limits ($99+)

---

## 🎯 Next Steps

1. ✅ Deploy backend to Render
2. ✅ Deploy frontend to Vercel
3. ✅ Test both services
4. ✅ Update README with live URLs
5. 🔄 Set up automatic deployments
6. 📸 Take screenshots for documentation
7. 🚀 Share your live demo!

---

## 🆘 Troubleshooting

### Render build fails

```
Check: backend/requirements.txt exists
Check: Backend code uses standard Python (no Windows-specific paths)
Solution: View full logs in Render dashboard → Logs tab
```

### Vercel build fails

```
Check: frontend/package.json exists
Check: frontend/vite.config.ts configured correctly
Solution: View build logs in Vercel deployment details
```

### API calls fail

```
1. Open browser DevTools (F12)
2. Check Network tab for request
3. Check Response tab for error message
4. Verify backend URL matches in frontend/.env or VITE_API_URL
```

---

## 📞 Support

Need help? Check:
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Neo4j Driver Docs](https://neo4j.com/docs/drivers/current/)

---

**Congratulations! Your app is now deployed to production.** 🎉
