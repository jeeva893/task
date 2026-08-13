# 🚀 Quick Deployment Checklist

Complete these steps in order to deploy SkillGraph to production.

## ✅ What's Already Done

- ✅ Comprehensive README.md with use cases and documentation
- ✅ All deployment files prepared (render.yaml, vercel.json)
- ✅ Git repository initialized and ready
- ✅ CORS configured for production
- ✅ API endpoints fully documented
- ✅ Cypher queries explained

## 🔄 What You Need to Do

### Step 1: Push to GitHub (5 minutes)

**Create GitHub repo:**
1. Go to https://github.com/new
2. Name: `skillgraph`
3. Click "Create repository"

**Push code:**
```powershell
cd c:\Users\NEXOVA3\Downloads\task

git remote add origin https://github.com/YOUR-USERNAME/skillgraph.git
git branch -M main
git push -u origin main
```

**Verify:** Visit https://github.com/YOUR-USERNAME/skillgraph

---

### Step 2: Deploy Backend to Render (10 minutes)

**Create Render account:** https://render.com

**Create Web Service:**
1. Click "New +" → "Web Service"
2. Connect & authorize GitHub
3. Select `skillgraph` repository

**Configure:**
| Field | Value |
|-------|-------|
| Name | `skillgraph-backend` |
| Environment | Python 3.11 |
| Build | `pip install -r backend/requirements.txt` |
| Start | `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT` |
| Plan | Free |

**Environment Variables:**
```
COGNODB_URI=bolt+s://db-XXXXX.databases.cognodb.com
COGNODB_USERNAME=cognodb
COGNODB_PASSWORD=your-password
```

**Deploy:** Click "Create Web Service"

**Test:** https://skillgraph-backend.onrender.com/health

---

### Step 3: Deploy Frontend to Vercel (5 minutes)

**Create Vercel account:** https://vercel.com

**Import Project:**
1. Click "Add New" → "Project"
2. Select `skillgraph` from GitHub
3. Click "Import"

**Configure:**
| Field | Value |
|-------|-------|
| Project Name | `skillgraph` |
| Framework | Vite |
| Root Directory | `./frontend` |

**Environment Variable:**
```
VITE_API_URL=https://skillgraph-backend.onrender.com/api
```

(Replace with your Render backend URL)

**Deploy:** Click "Deploy"

**Visit:** https://skillgraph.vercel.app

---

### Step 4: Verify Everything Works

- [ ] Backend health: https://skillgraph-backend.onrender.com/health
- [ ] API candidates: https://skillgraph-backend.onrender.com/api/candidates
- [ ] Frontend loads: https://skillgraph.vercel.app
- [ ] Dashboard works
- [ ] Can select candidate
- [ ] Recommendations load

---

### Step 5: Update README with Live URLs

Edit `README.md` line 3:

Replace:
```
**Live Demo**: [Hosted Demo Coming Soon] | **Backend API**: [API Docs Coming Soon]
```

With:
```
**Live Demo**: https://skillgraph.vercel.app | **Backend API**: https://skillgraph-backend.onrender.com/api
```

Push to GitHub:
```powershell
git add README.md
git commit -m "Update README with live deployment URLs"
git push
```

---

## 🎯 Timeline

| Step | Platform | Time | Status |
|------|----------|------|--------|
| Push to GitHub | GitHub | 5 min | Pending |
| Deploy Backend | Render | 10 min | Pending |
| Deploy Frontend | Vercel | 5 min | Pending |
| Verify | Browser | 5 min | Pending |
| **Total** | | **25 min** | |

---

## 📱 Your Live URLs (After Deployment)

```
Frontend: https://skillgraph.vercel.app
Backend:  https://skillgraph-backend.onrender.com
GitHub:   https://github.com/YOUR-USERNAME/skillgraph
```

---

## 🆘 Troubleshooting

### ❌ Backend shows "db-unreachable"
→ Check COGNODB_URI and password in Render environment variables

### ❌ Frontend shows "Unable to reach backend API"
→ Check VITE_API_URL in Vercel environment variables

### ❌ CORS errors in browser console
→ Backend URL matches in Vercel env var

### ❌ Build fails on Render
→ Check backend/requirements.txt exists
→ View logs in Render dashboard

---

## 📚 Full Documentation

- **Setup Guide:** See [README.md](README.md)
- **Detailed Deployment:** See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **Query Documentation:** See [README.md](README.md#main-queries-explained)
- **API Reference:** See [README.md](README.md#api-reference)

---

**🎉 Once deployed, share your live demo with:** `https://skillgraph.vercel.app`
