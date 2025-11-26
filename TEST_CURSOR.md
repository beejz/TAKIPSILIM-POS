# Cursor Visibility Test

Please test the following to help diagnose the cursor issue:

## Test 1: Login Screen
1. Go to the Login screen
2. Tap on the "Username" field
3. **Look for**: A blinking orange vertical line cursor (#FF7A00)
4. **What to check**: Is the cursor visible? Is it blinking?

## Test 2: Menu Screen (Admin)
1. Login as admin (username: admin, password: admin123)
2. Go to Menu tab
3. Tap the "+" button to add a new item
4. Tap on the "Name" field
5. **Look for**: A blinking orange vertical line cursor
6. **What to check**: Is the cursor visible when you tap the field?

## If cursor is NOT visible:

The issue might be:
1. iOS/Android platform specific behavior
2. React Native version compatibility
3. NativeWind className conflict
4. Keyboard covering the cursor

## Please tell me:
- Are you on iOS or Android?
- When you tap a text field, do you see ANY cursor at all?
- Does the keyboard appear when you tap?
- Can you type text even though you don't see the cursor?
