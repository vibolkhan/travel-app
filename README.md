# Travel App Project

A React Native (Expo) travel booking application that allows users to explore destinations, hotels, and tours, manage favorites, and book trips.

## 📱 Application Flow

The application uses a tab-based navigation layout with the following main flows:

### 1. 🌍 Explore (Home)
- **Entry Point**: The default screen upon opening the app.
- **Features**:
  - Displays a list of curated **Destinations** (centered cards).
  - Search bar to filter destinations by name or location.
  - Category chips (All, Beach, Mountain, etc.) for quick filtering.
- **Navigation**:
  - Tapping a card opens the **Destination Detail** screen.

### 2. 🏨 Detail Screens
Detailed views for Destinations, Hotels, and Tours.
- **Features**:
  - **Hero Image & Rating**: High-quality headers with star ratings.
  - **Favorite Toggle**: integration with `FavoritesContext` to save items.
  - **Info Sections**: Description, amenities (hotels), itinerary (tours), reviews preview.
  - **Sub-listings**: Destination details show "Popular Hotels" and "Top Tours" in that area.
- **Actions**:
  - **Back Button**: Custom top-left arrow to return to the previous screen.
  - **"Book Now" / "Select Dates"**: Initiates the booking flow.

### 3. 📅 Booking Flow
A multi-step process to reserve a trip.
1.  **Detail Screen**: User clicks "Book" or "Select Details".
2.  **Date Selection**: User picks Start/End dates and Number of guests.
3.  **Summary Screen**: Review booking details, price breakdown (Base + Taxes + Fees), and total cost.
4.  **Confirmation**: Clicking "Pay" creates a booking record in `BookingContext` and redirects to a Success screen.

### 4. ❤️ Saved (Favorites)
- Displays a list of all items (Destinations, Hotels, Tours) marked as "Favorite".
- **Persistence**: Favorites are saved locally using `AsyncStorage`, so they remain even after closing the app.

### 5. ✈️ Trips (History)
- Lists all pending and past bookings.
- Managed via `BookingContext` and persisted locally.

## 🛠 Technical Stack

- **Framework**: React Native with [Expo Router](https://docs.expo.dev/router/introduction/).
- **Language**: TypeScript.
- **State Management**: React Context API (`FavoritesContext`, `BookingContext`).
- **Persistence**: `@react-native-async-storage/async-storage`.
- **Styling**: `StyleSheet` with standard Flexbox layout.

## 🚀 Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Start the Server**:
    ```bash
    npx expo start -c
    ```
    *(The `-c` flag is recommended to clear cache if you switched from other state libraries)*.

3.  **Run on Device**:
    - Scan the QR code with the **Expo Go** app (Android) or Camera (iOS).
    - Ensure your phone and computer are on the same Wi-Fi network.

## 📂 Project Structure

- `app/`: Expo Router pages.
  - `(tabs)/`: Main tab screens (Explore, Favorite, History, etc.).
  - `tours/`, `hotels/`, `explore/`: Detail screens.
  - `booking/`: Booking flow screens.
- `components/`: Reusable UI components (`Card`, `Button`, `IconSymbol`).
- `context/`: Global state providers (`FavoritesContext`, `BookingContext`).
- `data/`: Mock data for the application.
- `types/`: TypeScript interfaces/models.
