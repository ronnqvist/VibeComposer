# Promo Code Feature Documentation

## Overview
Added a promo code feature that allows users who have reached their message limit to enter a special promo code to unlock unlimited messages.

## Promo Code
- **Code**: `keeponvibing` (case-insensitive)
- **Effect**: Grants unlimited messages to the user

## Implementation Details

### 1. Database Changes
**File**: `app/db/models.ts`
- Added new `User` model with the following fields:
  - `userId`: String (unique identifier)
  - `hasUnlimitedMessages`: Boolean (default: false)
  - `promoCodeApplied`: String (optional, stores the promo code used)
  - `promoCodeAppliedAt`: Number (optional, timestamp when promo was applied)
  - `createdAt`: Number
  - `updatedAt`: Number

### 2. API Endpoint
**File**: `app/routes/api.promo-code.tsx`
- **Endpoint**: `POST /api/promo-code`
- **Request Body**:
  ```json
  {
    "userId": "string",
    "promoCode": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Keep on vibing with unlimited messages!",
    "hasUnlimitedMessages": true
  }
  ```
- **Features**:
  - Case-insensitive promo code validation
  - Creates or updates user record
  - Prevents duplicate promo code application
  - Tracks analytics events

### 3. State Management
**File**: `app/store/useStore.ts`
- Added `hasUnlimitedMessages` boolean state
- Added `setHasUnlimitedMessages()` method
- Updated `loadChats()` to fetch and set promo status
- Updated `getMessageStats()` to return Infinity for unlimited users

### 4. UI Changes
**File**: `app/components/message-limit-exceeded-modal.tsx`
- Added promo code input field
- Added "Apply" button with loading state
- Added success/error message display
- Implemented promo code validation flow
- Auto-closes modal after successful promo application (2 seconds)
- Added visual separator between promo code and email support sections

### 5. Message Limit Enforcement
**File**: `app/routes/api.chat.message.tsx`
- Updated to check user's `hasUnlimitedMessages` status
- Bypasses message limit check for users with unlimited messages
- Only counts messages for users without promo code

### 6. Chats API Update
**File**: `app/routes/api.chats.tsx`
- Updated loader to return `hasUnlimitedMessages` status
- Fetches user data and includes promo status in response

### 7. Routes Configuration
**File**: `app/routes.ts`
- Added route for promo code API endpoint

### 8. Frontend Display Updates
**Files**: `app/components/mobile-layout.tsx`, `app/components/desktop-layout.tsx`
- Updated message count display to show **"Messages: Unlimited ∞"** in green when promo is active
- Normal users see: "Messages: X/10"
- Promo users see: "Messages: Unlimited ∞" (in green)

## Analytics Events

The following events are tracked:
1. `promo_code_invalid` - When an invalid promo code is entered
2. `promo_code_already_applied` - When user tries to apply already active promo
3. `promo_code_applied` - When promo is successfully applied (backend)
4. `promo_code_success_ui` - When promo succeeds (frontend)
5. `promo_code_error_ui` - When promo validation fails (frontend)
6. `promo_code_exception_ui` - When an exception occurs during application
7. `promo_code_application_failed` - When backend processing fails

## User Flow

1. User reaches message limit (10 messages)
2. Message limit modal appears
3. User sees promo code input field at the top
4. User enters promo code "keeponvibing"
5. User clicks "Apply" button or presses Enter
6. System validates promo code with backend
7. On success:
   - Green success message appears
   - User state updated to unlimited messages
   - Modal auto-closes after 2 seconds
   - **Message counter updates to show "Messages: Unlimited ∞" in green**
   - User can now send unlimited messages
8. On failure:
   - Red error message appears
   - User can try again or contact support

## Testing Checklist

- [x] Database model created with proper schema
- [x] API endpoint validates promo code correctly
- [x] API endpoint handles invalid codes with error message
- [x] API endpoint prevents duplicate promo applications
- [x] Modal displays promo code input field
- [x] Modal shows success message on valid promo
- [x] Modal shows error message on invalid promo
- [x] Modal auto-closes after successful promo
- [x] Store properly tracks unlimited message status
- [x] Message limit check bypassed for promo users
- [x] Chats API returns promo status on load
- [x] Analytics events properly tracked
- [x] No linting errors in modified files
- [x] Routes configuration updated
- [x] Frontend displays "Unlimited ∞" for promo users
- [x] Message counter updates immediately after promo application

## Future Enhancements

Potential improvements for future iterations:
1. Add expiration date for promo codes
2. Add usage limit per promo code
3. Support multiple promo codes with different benefits
4. Admin interface to manage promo codes
5. Promo code generation system
6. Usage analytics dashboard
7. Email notification on promo code application
8. Promo code sharing/referral system

