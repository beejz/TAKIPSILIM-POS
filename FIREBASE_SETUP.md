# Firebase Setup Guide for Takipsilim Café

## 🔥 What Firebase Does for You

Firebase will enable **real-time synchronization** across all your devices:
- ✅ Device 1 creates an order → Device 2 sees it instantly
- ✅ Admin changes price → All POS devices update immediately
- ✅ View live sales from any device
- ✅ All data backed up in the cloud automatically

## 📋 Step-by-Step Setup

### Step 1: Create Firebase Project (5 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Project name: `takipsilim-cafe` (or your choice)
4. Disable Google Analytics (not needed)
5. Click **"Create project"**

### Step 2: Add Web App to Firebase

1. In your Firebase project, click the **Web icon** (`</>`)
2. App nickname: `Takipsilim Cafe POS`
3. Click **"Register app"**
4. You'll see Firebase configuration like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

5. **COPY THIS** - you'll need it in Step 4

### Step 3: Enable Firestore Database

1. In Firebase Console, go to **"Firestore Database"** (left sidebar)
2. Click **"Create database"**
3. Select **"Start in test mode"** (we'll secure it later)
4. Choose location: **asia-southeast1** (closest to Philippines)
5. Click **"Enable"**

### Step 4: Add Your Firebase Config to the App

1. Open the file: `/home/user/workspace/src/config/firebase.ts`
2. Replace the placeholder values with YOUR Firebase config from Step 2:

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY_HERE",
  authDomain: "PASTE_YOUR_AUTH_DOMAIN_HERE",
  projectId: "PASTE_YOUR_PROJECT_ID_HERE",
  storageBucket: "PASTE_YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "PASTE_YOUR_MESSAGING_SENDER_ID_HERE",
  appId: "PASTE_YOUR_APP_ID_HERE"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

3. Save the file

### Step 5: Secure Your Database (Important!)

In Firebase Console → Firestore Database → Rules, replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their cafe data
    match /{document=**} {
      allow read, write: if true; // For testing - change this later!
    }
  }
}
```

**⚠️ Security Note:** The above rules allow anyone to read/write. For production, you should add proper authentication rules.

## 🎉 You're Done!

After completing these steps:
1. Restart your app
2. Login on Device 1 (create an order)
3. Login on Device 2 → You'll see the order appear!
4. Make changes on either device → Both update in real-time!

## 💰 Pricing

Firebase **Free Tier** includes:
- ✅ 1 GB stored data
- ✅ 50,000 reads/day
- ✅ 20,000 writes/day
- ✅ 20,000 deletes/day

This is **more than enough** for a café with 100-200 orders per day!

If you exceed free tier: ~$25/month for small café

## 🆘 Need Help?

If you encounter any issues:
1. Check that firebase.ts has your correct config
2. Make sure Firestore is enabled in Firebase Console
3. Verify your internet connection
4. Check the expo.log file for error messages

---

**Questions?** Let me know and I'll help you through any step!
