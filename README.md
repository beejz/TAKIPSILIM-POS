# Takipsilim Café Management System

🏪 **A complete, full-featured Café Management System** built for Takipsilim Café - a cozy local coffee shop. This comprehensive system provides two specialized workspaces: **POS for Staff** and **Back-office for Admin**.

## ✅ System Overview

### 🖥️ Two Workspaces

**POS (Point of Sale) - Staff Workspace**
- Modern, tablet-optimized POS interface with clean aesthetics
- Redesigned with minimalist, café-themed UI (#FF7A00 orange accents)
- Text-only category tabs with animated orange underline indicators
- Searchable menu grid with category filters
- **🆕 Out-of-Stock Items Still Visible** - Items with 0 stock remain visible with clear indicators
  - Faded appearance with 60% opacity
  - Prominent red "OUT OF STOCK" badge overlay
  - Cannot be added to cart (disabled interaction)
  - Staff can still add stock using the "Add Stock" button
- Real-time stock availability with visual badges
- **🆕 Quick Stock Management** - Staff can add stock directly from POS for low-stock items
  - "Add Stock" button appears on items with 10 or fewer units
  - Quick modal to enter quantity to add
  - Instant stock update without leaving POS screen
  - Perfect for restocking popular items like Almond Macchiato
- **🆕 Long Press Quantity Controls** - Fast increment/decrement in order summary
  - Press and hold the + or - buttons to rapidly change quantities
  - Auto-increments every 100ms while holding
  - Perfect for bulk orders or quick adjustments
- Quick quantity steppers with smooth animations
- Order summary sidebar with elegant spacing
- Multiple payment methods (Cash, Card, GCash, Maya)
- **🆕 No Tax System** - Simple pricing with no tax/VAT calculations (total = item prices)
- **🆕 Visible Scroll Bars** - All scrollable areas show scroll indicators for easy navigation
- Automatic stock validation before checkout
- Dark theme (#1E1E1E) optimized for staff comfort
- **🆕 Serve & Payment Tracking** - Mark orders as served and paid with automatic change calculation
- **🆕 Cash Payment Calculator** - Built-in change calculator during checkout for cash payments
- **🆕 Order History** - View all your previous orders with filters
- **🎨 NEW: Redesigned UI** - Cleaner navigation, better spacing, professional aesthetics
- **✨ NEW: Smart Blinking Cursor** - All text inputs display a bright, visible blinking cursor
  - **Bright orange (#FF7A00)** on light backgrounds (admin screens, forms)
  - **White (#FFFFFF)** on dark backgrounds (POS dark theme)
  - Always visible and easy to locate while typing

**Back-Office - Admin Workspace**
- Comprehensive dashboard with KPIs
- **🆕 REAL-TIME Dashboard Synchronization** - Automatic updates every 2 seconds + instant updates on payment
  - **Auto-refresh every 2 seconds** - Dashboard polls for updates while viewing
  - **Instant sync on payment** - Updates immediately when paid orders count changes
  - **Focus refresh** - Updates when switching to dashboard screen
  - Dashboard tracks payment completion time (not order creation time)
  - Today/Week/Month revenue updates automatically without manual refresh
  - Top selling items and order counts reflect actual payment dates
  - **Manual Refresh Button** - Blue refresh button in header as backup
  - **Note**: Dashboard will show ₱0.00 until first payment is completed today
  - Only paid orders (marked as paid in POS or Orders screen) are counted
- **🆕 Visible Scroll Bars** - All scrollable areas show scroll indicators for easy navigation
- Full CRUD operations on all modules
- Sales analytics with charts
- Inventory management with low-stock alerts
- Purchase history tracking
- Sales reports with export functionality
- **🆕 Independent Menu Stock Editing** - Edit menu item stock quantities directly in Menu screen
  - Purple cube icon button next to price/edit/delete buttons
  - Quick stock adjustment modal with +/- buttons
  - Completely independent from main inventory ingredient tracking
  - Perfect for manually adjusting stock counts without affecting ingredient quantities

### 📊 Complete Feature Set

✓ **Menu Management** - Full CRUD with dynamic category system
  - **🆕 Dynamic Category Management** - Admin can add custom categories (e.g., Smoothies, Desserts, Breakfast) to organize menu items
  - **🆕 Category Creation** - Create new categories on-the-fly when expanding your menu offerings
    - Access via "Manage Categories" button in Menu screen (admin only)
    - Or quick "Add New" link directly in the Add Item modal
  - **🆕 Category Selection** - When adding a new menu item, tap the category dropdown to select from all available categories
    - Fixed modal interaction - category picker now properly opens and closes
    - All 6 default categories available: Coffee, Waffle, Beverage, Soda, Snack, Rice Meal
    - Smooth transitions between Add Item modal and Category Picker modal
  - **🆕 Category Deletion** - Remove unused categories (only empty categories can be deleted)
  - **🆕 Product Images** - Visual menu items with product images displayed throughout the system
  - **🆕 Image Upload for New Items** - Admin can upload product images when adding new menu items via gallery picker
  - **🆕 iPad-Optimized Images** - Full product images visible with `contain` mode for easy order identification on tablets
  - **🆕 Local Image Support** - Coffee, waffle, hotdog, silog meals, and soda items use locally bundled images for instant loading
  - **🆕 Smart Image Reload** - Load Menu button refreshes all images while preserving custom prices and edits
  - **🆕 Size Options** - Items can have multiple size variants (e.g., 16oz/22oz sodas) with different prices - size selection modal appears automatically
  - **🆕 Flavor Options** - Items can have multiple flavor variants (e.g., Chicken Poppers with Cheese, Honey Butter, Sweet Chili, Soy Garlic) with different prices - flavor selection modal appears automatically
  - **🆕 Organized Subgroups** - All categories automatically organized into logical subgroups:
    - **Coffee**: Iced Coffee (Almond Macchiato ✓ with image, Vanilla Latte ✓ with image, Hazelnut Coffee ✓ with image, Iced Chocolate ✓ with image)
    - **Waffle**: Classic Waffles (Strawberry ✓ with image, Chocolate ✓ with image, Caramel ✓ with image), Premium Waffles (Biscoff ✓ with image, Cookies & Cream, Nutella)
    - **Beverage**: Fresh Lemonade Series, Other Beverages
    - **Soda**: Soda Fruit Series - Available in 16oz (₱28) and 22oz (₱38) - All flavors with images (Green Apple ✓, Strawberry ✓, Lychee ✓, Blueberry ✓, Lemon ✓)
    - **Snack**: Waffle Sticks (Waffle on Stick ✓ with 2 options: Creamy Cheese ₱20, Hotdog ₱30), Siopao (Jumbo Siopao ✓ with image, Mini Siopao ✓ with image), Sandwiches (Ultimate Hotdog ✓ with image, Classic Hotdog ✓ with image, Monster Sandwich ✓ with image), Fries & Potatoes (Jungle Twister Fries ✓ with image, Buttered Potato Wedges ✓ with image, Sea Salt Potato ✓ with image, Garden Crinkle Fries ✓ with image, Cajun Cheesy Fries ✓ with image, Baby Fries ✓ with image)
    - **Rice Meal**: Chicken Meals (Chicken Poppers ✓ with image - with 5 flavors: With Gravy ₱55, Cheese ₱80, Honey Butter ₱80, Sweet Chili ₱80, Soy Garlic ₱80, Chicken Fillet ✓ with image), Siomai Meals (Siomai Rice ✓ with image - with 3 options: Fried ₱45, Steamed ₱45, Combo Meal with Drinks ₱110), Shanghai Meals (Shanghai Rice ✓ with image - with 2 options: Shanghai Rice Only ₱45, Shanghai Combo Meal ₱110), Silog Meals (Hotsilog ✓ with image, Tocilog ✓ with image, Baconsilog ✓ with image, Spamsilog ✓ with image, Sausagesilog ✓ with image, Longsilog ✓ with image)
  - **Smart Categorization** - Items automatically grouped based on name/description patterns
  - **Clean UI** - Amber subgroup labels for easy navigation with product images
  - **Smart Menu Refresh** - Load complete menu template while preserving custom prices and edits
✓ **Order Management** - Automatic stock deduction on completion
✓ **🆕 Serve & Payment Tracking** - Mark orders as served/paid with visual indicators
✓ **🆕 Order History for Staff** - Personal order log with paid/unpaid filters
✓ **Inventory & Ingredients** - Complete inventory system with **automatic stock reduction**
  - **🆕 Auto-Syncing Inventory System** - Inventory automatically reduces when orders are paid
    - **Real-time Stock Deduction**: When staff marks an order as paid, the system automatically:
      1. Reduces menu item stock quantity (e.g., "Chicken Poppers" count decreases)
      2. Reduces ingredient stock based on recipe mappings (e.g., chicken, rice, oil, cups)
      3. Updates low-stock alerts immediately
    - **Recipe-Based Tracking**: Every menu item has ingredient mappings:
      - Coffees: Coffee beans, milk, syrups, ice, cups, straws, lids
      - Waffles: Waffle mix, eggs, butter, toppings, syrups, takeout boxes
      - Beverages: Lemons, cucumber, yakult, sugar, ice, cups
      - Sodas: Soda water, flavor syrups, ice, cups, straws, lids
      - Rice Meals: Rice, meat (chicken/spam/sausage/etc), eggs, cooking oil, boxes, utensils
      - Snacks: Frozen items, cooking oil, seasonings, packaging
    - **Accurate Quantity Usage**: Each recipe specifies exact amounts (e.g., 0.15 kg chicken, 150g rice, 1 cup)
    - **Smart Validation**: Orders cannot be created if insufficient inventory stock
    - **Dashboard Integration**: Low-stock items appear on admin dashboard automatically
  - **🆕 Auto-Loading Inventory** - Inventory automatically loads with 85+ items on first app launch
    - Seamless setup - no manual data entry required
    - All ingredients ready to track from day one
    - Works automatically on first login (admin or staff)
  - **🆕 Manual Reload Option** - "Load Inventory" button to refresh all items anytime
    - Useful after app updates or data resets
    - Preserves any custom items you've added
    - One-click access to full ingredient list
  - **🆕 Comprehensive Inventory** - 85+ inventory items organized by category:
    - **Coffee Ingredients**: Arabica beans, milk, ice, syrups (vanilla, almond, hazelnut, chocolate, caramel, strawberry)
    - **Waffle Ingredients**: Waffle mix, eggs, butter, fresh strawberries, whipped cream
    - **Beverage Ingredients**: Soda water, fruit syrups (green apple, blueberry, lychee), fresh lemons, cucumber, yakult, sugar
    - **Snack Ingredients**: Frozen siopao, hotdog, buns, cheese, bacon, mayo, mustard, chicken (poppers/fillet), siomai, shanghai rolls, potato fries, cooking oil
    - **Rice Meal Ingredients**: Rice, spam, sausage, tocino, longanisa, garlic, soy sauce, vinegar
    - **Packaging**: 22oz cups, straws, lids, takeout boxes, napkins, plastic utensils
    - **Seasonings**: Salt, pepper, cajun, sea salt, ketchup, chili sauce
  - **🆕 Organized Category View** - Inventory items displayed in organized sections by category, just like the menu
    - Each category shows item count (e.g., "Coffee Beans - 1 item", "Syrups - 9 items")
    - Clean, scrollable layout with visual separation between categories
    - Easy to navigate and find specific ingredients
  - **🆕 Visible Option-Style Category Selection** - When adding/editing inventory items, categories are displayed as visible buttons:
    - **INGREDIENTS** section (13 categories): Coffee Beans, Dairy, Syrups, Waffle Ingredients, Fresh Fruits, Fresh Vegetables, Toppings, Frozen Foods, Meats, Bakery, Canned Goods, Condiments, Seasonings
    - **BEVERAGES** section (1 category): Beverages
    - **SUPPLIES** section (2 categories): Basics, Packaging
    - All options visible at once - no scrolling needed
    - Selected category highlighted in amber with white text
    - Unselected categories show white background with border
    - Section headers in amber color for clear visual separation
  - **Smart Organization** - Items grouped by usage type (Dairy, Meats, Frozen Foods, Fresh Fruits/Vegetables, Condiments, Canned Goods, Bakery, Basics)
  - **Realistic Quantities** - Pre-set stock levels and minimum quantities for reorder alerts
  - **Supplier Tracking** - Each item linked to specific suppliers for easy ordering
  - **Cost Management** - Track cost per unit for accurate profit calculations
  - **Low-Stock Alerts** - Automatic warnings when items reach minimum quantity
✓ **🆕 Admin-Only Price Management** - Secure price control restricted to administrators
  - **Individual Price Editing** - Edit prices for specific menu items with admin authentication
  - **Bulk Price Changes** - Adjust multiple item prices simultaneously:
    - Percentage-based increases/decreases (e.g., 10% price increase)
    - Fixed amount adjustments (e.g., add ₱5 to all items)
    - Category-specific or all-items targeting
    - Real-time preview before applying changes
  - **Access Control** - Staff can view prices but cannot modify them
✓ **Purchase History** - Log supplier restocks
✓ **Sales Dashboard** - Today/week/month KPIs with charts
✓ **CSV Exports** - Export sales by day, item, payment method, and order list
✓ **User Roles** - Admin (full access) & Staff (POS-focused)
✓ **Authentication** - Email/password system
✓ **Payment Methods** - Cash, Card, GCash, Maya
✓ **Theme Support** - Light/dark theme toggle
✓ **Image Support** - Menu item images (upload ready)
✓ **Stock Validation** - Automatic checks before order completion

## 🎨 Branding

**Takipsilim Café Theme**
- Coffee Brown: `#5A3825`
- Cream: `#F5E9DA`
- Sunset Orange: `#FF7A00` (Primary accent)
- Dark Background: `#1E1E1E`
- Dark Card: `#2C2C2C`

**Design Philosophy:**
- Modern, minimalist POS interface with warm café aesthetics
- Clean text-only category navigation with orange underline indicators
- Dark theme optimized with charcoal backgrounds and warm orange accents
- 8-10px border radius for modern, rounded corners
- Smooth fade/slide animations for category transitions
- System font (Poppins/Inter inspired) for readability

Warm, inviting color palette perfect for a cozy café atmosphere with professional staff usability.

### 🔐 Permissions & Roles

### Admin (Back-Office)
- Full CRUD on menu, inventory, purchases
- **🆕 Admin-Only Price Control** - Exclusive access to edit, add, or delete menu items and prices
- **🆕 Bulk Price Management** - Change prices for multiple items at once:
  - Increase or decrease prices by percentage or fixed amount
  - Apply changes to all items or specific categories
  - Real-time preview of changes before applying
- Access to dashboard and analytics
- Sales reports and exports
- Complete order management
- User management capabilities
- Delete orders

### Staff (POS)
- Create and view orders via POS system
- **🆕 Mark orders as Served** - Toggle order served status
- **🆕 Mark orders as Paid** - Finalize payment and auto-deduct stock
- **🆕 View Order History** - See personal order history with filters
- View menu items (read-only, prices visible)
- View inventory levels (read-only)
- Access to order list
- No price editing capabilities
- No delete operations
- No schema changes

## 🚀 Quick Start

### 🔐 Authentication System

**Secure Google + Role-Based Authentication**

The app uses a modern authentication system that combines Google account verification with role-specific passwords for enhanced security:

**First-Time Setup:**
1. **Connect Google Account** - Enter your Google email and full name
2. **Select Role** - Choose Admin or Staff
3. **Setup Password** - Create a secure password for your selected role (minimum 6 characters)
4. **Sign In** - Use the password you created to access the app

**Subsequent Logins:**
1. Google account is remembered automatically
2. Select your role (Admin or Staff)
3. Enter your role-specific password
4. Access granted!

**Security Features:**
- ✅ Google account required for all users
- ✅ Separate passwords for Admin and Staff roles
- ✅ Same Google account can access both roles with different passwords
- ✅ Passwords stored securely with AsyncStorage
- ✅ Role-based access control throughout the app

**First Login Flow:**
1. Enter any Google email address (e.g., `yourname@gmail.com`)
2. Enter your full name
3. Click "Connect with Google"
4. Select Admin role
5. Create admin password (e.g., `admin123`)
6. Confirm password
7. Click "Setup Password"
8. Now you can log in!

**Note:** This currently simulates Google Sign-In for demo purposes. When deployed, it will use real Google OAuth authentication.

The app is **ready to use** - all features are fully functional!

## 💾 Data Storage

**🔥 Firebase Cloud Sync Setup Available!**

The app currently uses AsyncStorage (local device storage) for development. However, **Firebase Firestore integration is ready** for multi-device real-time synchronization!

### Current Setup (Local Storage)
- Data stored on each device separately
- Fast and works offline
- No internet required

### Firebase Setup (Multi-Device Sync) ⚡
**Want all devices to share the same data in real-time?**

See **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)** for complete setup instructions!

**Benefits:**
- ✅ Real-time sync across all devices
- ✅ Device 1 creates order → Device 2 sees it instantly
- ✅ Admin changes prices → All POS devices update immediately
- ✅ Cloud backup of all data
- ✅ Access from multiple phones/tablets/computers
- ✅ Works offline, syncs when back online
- ✅ **FREE** for small cafés (up to 50,000 reads/day)

**Setup Time:** ~10 minutes

The system architecture supports both:
- **Local Storage** (AsyncStorage) - Current
- **Cloud Storage** (Firebase Firestore) - Ready to enable

## 🎯 Key Features

### 🆕 Admin-Only Price Management System
**Secure, Powerful Price Control**

Administrators have exclusive access to comprehensive price management tools:

**Individual Item Editing:**
- Click the edit button (pencil icon) on any menu item
- Modify name, category, price, stock quantity, and description
- Admin authentication required - staff users receive "Access Denied" message
- Real-time validation ensures data integrity

**Bulk Price Changes:**
- Access via "Bulk Price" button in Menu screen (admin-only)
- **Category Targeting** - Apply changes to:
  - All items across all categories
  - Specific category (Coffee, Waffle, Rice Meal, etc.)
- **Flexible Adjustment Types:**
  - **Percentage-Based** - Increase/decrease by % (e.g., 10% price hike)
  - **Fixed Amount** - Add/subtract fixed ₱ amount (e.g., add ₱5 to all)
- **Increase or Decrease** - Toggle between raising or lowering prices
- **Real-Time Preview** - See exactly what will change before applying
- **Safety Features:**
  - Prevents prices from going below ₱0
  - Rounds to 2 decimal places for currency accuracy
  - Confirmation with count of items updated

**Access Control:**
- Staff users can view menu and prices (read-only)
- All edit/add/delete buttons hidden from non-admin users
- Programmatic checks prevent unauthorized price changes
- Only admin role can access bulk price tool

### Automatic Stock Management
- Menu items linked to ingredients
- Stock automatically reduced on order completion
- Low-stock alerts (configurable threshold)
- Validation prevents over-ordering

### CSV Export System
- **Sales by Day** - Daily revenue, order count, items sold
- **Sales by Item** - Top-selling items with quantities and revenue
- **Sales by Payment** - Revenue breakdown by payment method (Cash, Card, GCash, Maya)
- **Order List** - Complete order history with customer details
- All exports include date ranges and are shareable via native share sheet

### 🆕 Serve & Payment Tracking System
**Complete Order Lifecycle Management**

Staff can now track the full journey of each order:

1. **Order Created** - Initial order placed (status: Pending)
   - Stock is NOT yet deducted
   - Order appears as gray/pending
   - **💰 Cash Payment Calculator**: When choosing Cash payment, a calculator modal appears
     - Enter amount received from customer
     - Quick amount buttons (exact, round to 100s, 500s, 1000s)
     - Real-time change calculation displayed in green
     - Cannot proceed if amount is insufficient
     - Change amount saved with order for reference

2. **Mark as Served** 🧺 - Food/drinks delivered to customer
   - Toggle `isServed = true`
   - Status changes to "Served" (yellow badge)
   - Stock still not deducted
   - Tracked with `servedAt` timestamp
   - Can be marked served even after payment (flexible workflow)

3. **Mark as Paid** 💰 - Payment received from customer
   - Toggle `isPaid = true`
   - Status automatically changes to "Completed" (green badge)
   - **Stock and ingredients automatically deducted**
   - Tracked with `completedAt` timestamp
   - Order now counts toward sales analytics
   - If cash payment, displays change amount on order card

**Key Features:**
- ✅ Visual indicators (checkmarks) for served/paid status
- ✅ Color-coded badges (Gray → Yellow → Green)
- ✅ Only paid orders count in sales totals and dashboard
- ✅ Only paid orders deduct stock
- ✅ Staff can view their personal order history with filters
- ✅ Admin retains delete permissions
- ✅ **NEW: Cash change calculator integrated into checkout flow**
- ✅ **NEW: Change amount displayed on completed orders**
- ✅ **NEW: Flexible serve workflow (can serve before or after payment)**

**Order History Screen:**
- Filter by: All, Paid, Unpaid, Served, Unserved
- Shows: Order code, customer, items, total, timestamps
- Staff-specific: Only shows orders created by logged-in staff
- Sortable by date (newest first)

### POS Flow
1. Browse/search menu with category filters
2. Add items to cart with quantity steppers
3. Real-time stock validation
4. View order summary with tax calculation (12% VAT)
5. Click "Checkout" to enter customer details
6. Select payment method and add optional notes
7. Click "Confirm Order" - order is created (unpaid)
8. **Payment calculator automatically appears** with order total
9. Enter amount received from customer
10. See real-time change calculation with quick amount buttons
11. Click "Confirm Payment" - order marked as paid, stock deducted, modal closes
12. Success message appears, cart clears, ready for next order

**Key Features:**
- Single payment flow - payment happens once immediately after order creation
- No need to navigate to Orders screen - order is already marked as paid
- Clean UX - payment modal closes automatically after confirmation, no duplicate prompts
- Checkout modal stays closed after payment completion

### Dashboard KPIs
- Total sales today (only counts paid orders)
- Total completed orders
- Low-stock items list
- Top-selling items (today/7d/30d)
- Recent orders
- Revenue trends
- **Real-time updates** - Dashboard automatically refreshes when orders are marked as paid

## 🛠️ Technical Stack

- **React Native 0.76.7** with Expo SDK 53
- **TypeScript** - Full type safety
- **Zustand** - State management with persistence (optimized for reactivity)
- **React Navigation** - Drawer + Stack navigation
- **NativeWind** - TailwindCSS for styling
- **AsyncStorage** - Local data persistence
- **Date-fns** - Date manipulation

### Recent Optimizations
- **State Reactivity Fix** - Menu and order updates now properly trigger re-renders across all screens
- **Real-time Price Updates** - Price changes by admin immediately reflect in staff POS view
- **Income Tracking Fix** - Dashboard revenue metrics update instantly when orders are marked as paid
- **Optimized Zustand Selectors** - All screens use individual selectors for maximum reactivity and performance
- **Improved State Immutability** - State updates create fresh array references to ensure proper React re-renders
- **Smart Menu Merge** - Load Menu button intelligently adds missing items while preserving all custom prices and edits
- **Image Reload System** - Load Menu now properly refreshes all product images while keeping custom prices
- **Streamlined Payment Flow** - Payment calculator now appears immediately after order creation in POS, orders automatically marked as paid upon payment confirmation
- **Modal State Management** - Fixed checkout modal from reappearing after payment confirmation
- **iPad Image Display** - Product images now use `contain` mode to show full images without cropping on tablet displays
- **Size Selection System** - Clean size picker modal for items with multiple size options (no duplicate menu entries)
- **Flavor Selection System** - Clean flavor picker modal for items with multiple flavor options (e.g., Chicken Poppers with 5 flavors)
- **Local Image Loading** - Direct filename mapping for coffee, waffle, and hotdog images without protocol prefixes for better compatibility with Zustand persistence
- **Category Migration System** - Automatic detection and repair of corrupted category data on app startup, ensuring all 6 default categories are always available
- **Order Status Migration** - Automatic fix for inconsistent order data on app startup AND dashboard focus - all paid orders now correctly marked as "completed" for accurate dashboard reporting
- **Mark-As-Served Protection** - `markAsServed` now preserves "completed" status for already-paid orders, preventing status downgrade from completed → served

## 📱 Optimizations

- **Large tap targets** - Touch-friendly design
- **Tablet-friendly** - Responsive layout for POS screens
- **Clean, minimalist** - Apple Human Interface inspired
- **Fast navigation** - Role-based routing
- **Real-time updates** - Instant feedback on all operations

---

## 📦 How to Deploy This App as APK

### ✅ Build Setup Complete! (All Issues Fixed)

The Android build environment has been fully configured and all `expo doctor` issues resolved:

- ✅ Android native files generated (EAS will regenerate from app.json)
- ✅ EAS CLI installed
- ✅ Build profiles configured (preview, production)
- ✅ App metadata set (Takipsilim Café, com.takipsilim.cafe)
- ✅ **Expo Project ID**: `0935114b-b685-425b-87d1-6f813f83640a`
- ✅ **Icon/Splash**: PNG format configured
- ✅ **Git**: Clean repository, android/ properly gitignored
- ✅ **Lock files**: Using bun.lock only

### Prerequisites

You'll need:
- An [Expo account](https://expo.dev) (free)
- Internet connection for cloud builds

### Step 1: Login to Expo

If not already logged in:

```bash
eas login
```

Enter your Expo credentials or create a new account.

### Step 2: Build Your APK

The app is now ready to build! Run:

**For Testing/Preview (Recommended):**
```bash
eas build --profile preview --platform android
```

**For Production:**
```bash
eas build --profile production --platform android
```

### Step 3: Wait for Build

EAS will:
1. Upload your code to Expo servers
2. Build the APK in the cloud (takes 10-15 minutes)
3. Provide a download link when complete

### Step 4: Download & Install

1. Click the download link provided by EAS
2. Download the APK file to your computer
3. Transfer it to your Android device (via USB, Google Drive, etc.)
4. On your Android device:
   - Enable "Install from Unknown Sources" in Settings
   - Open the APK file
   - Tap "Install"
5. Your app is now installed! 🎉

### Build Configuration

The app is pre-configured with:
- **App Name**: Takipsilim Café
- **Package**: com.takipsilim.cafe
- **Version**: 1.0.0
- **Icon**: Your café logo
- **Build Type**: APK (for easy installation)

Files already configured:
- ✅ `eas.json` - Build profiles (preview, production)
- ✅ `app.json` - App metadata and configuration

### Alternative: Local Build

If you have Android Studio installed, you can build locally:

```bash
npx expo run:android --variant release
```

This builds directly on your machine without using EAS servers.

### Troubleshooting

**Build fails with "Run gradlew" error?**
- ✅ **Fixed!** - Android native files have been pre-generated
- The `/android` directory now contains all necessary Gradle configuration
- EAS Build runs Gradle commands on their cloud servers (no local Java/Android SDK needed)

**Build fails with other errors?**
- Check that `app.json` has a valid `projectId` in the `extra.eas` section
- Ensure all dependencies in `package.json` are compatible
- Try `eas build:configure` to reconfigure

**Can't install APK?**
- Enable "Install from Unknown Sources" in Android Settings > Security
- Make sure you downloaded the `.apk` file (not `.aab`)

**Need an AAB for Play Store?**
Change `buildType` in `eas.json`:
```json
"android": {
  "buildType": "aab"
}
```

### Publishing to Google Play Store

Once you have an AAB file:
1. Create a [Google Play Console](https://play.google.com/console) account ($25 one-time fee)
2. Create a new app listing
3. Upload your AAB file
4. Fill out store listing details (description, screenshots, etc.)
5. Submit for review

---

**Built for Takipsilim Café** 🌅☕

_Where every sunset brings a perfect cup of coffee_

